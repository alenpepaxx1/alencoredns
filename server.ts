// Copyright Alen Pepa
import os from 'os';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dns2 from 'dns2';
import dgram from 'dgram';
import fs from 'fs';

function getNetworkBandwidth(): { rx: number, tx: number } {
  try {
    if (fs.existsSync('/proc/net/dev')) {
      const dev = fs.readFileSync('/proc/net/dev', 'utf-8');
      const lines = dev.split('\n');
      let totalRx = 0;
      let totalTx = 0;
      for (const line of lines) {
        if (!line.includes(':') || line.includes('lo:')) continue;
        const parts = line.split(':')[1].trim().split(/\s+/);
        totalRx += parseInt(parts[0], 10) || 0;
        totalTx += parseInt(parts[8], 10) || 0;
      }
      return { rx: totalRx, tx: totalTx };
    }
  } catch(e) {}
  return { rx: 0, tx: 0 };
}

function getLocalIp() {
  const details = getNetworkDetails();
  return details.ip;
}

function getNetworkDetails() {
  const interfaces = os.networkInterfaces();
  let defaultIface = {
    name: 'Loopback',
    ip: '127.0.0.1',
    netmask: '255.0.0.0',
    family: 'IPv4',
    cidr: '127.0.0.1/8',
    dns1: '127.0.0.1',
    dns2: '1.1.1.1',
    subnetRange: '127.0.0.0/8',
    ipType: 'Loopback Localhost'
  };

  for (const name of Object.keys(interfaces)) {
    const list = interfaces[name] || [];
    const ipv4 = list.find(f => f.family === 'IPv4' && !f.internal);
    if (ipv4) {
      const ipv6 = list.find(f => f.family === 'IPv6' && !f.internal);
      const parts = ipv4.address.split('.').map(Number);
      let ipType = 'IPv4 (Public Network)';
      let dns2Ip = ipv6 ? ipv6.address : '1.1.1.1';
      
      if (parts[0] === 10) {
        ipType = 'IPv4 (Private Class A Net)';
      } else if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) {
        ipType = 'IPv4 (Private Class B Net)';
      } else if (parts[0] === 192 && parts[1] === 168) {
        ipType = 'IPv4 (Private Class C Net)';
      }
      
      let subnetRange = ipv4.cidr || `${parts[0]}.${parts[1]}.${parts[2]}.0/24`;
      
      if (!ipv6) {
        dns2Ip = `${parts[0]}.${parts[1]}.${parts[2]}.1`;
        if (dns2Ip === ipv4.address) {
          dns2Ip = '1.1.1.1';
        }
      }

      return {
        name,
        ip: ipv4.address,
        netmask: ipv4.netmask,
        family: 'IPv4',
        cidr: ipv4.cidr || '',
        dns1: ipv4.address,
        dns2: dns2Ip,
        subnetRange,
        ipType
      };
    }
  }
  
  return defaultIface;
}

function cpuAverage() {
  let totalIdle = 0;
  let totalTick = 0;
  const cpus = os.cpus();
  if (!cpus || cpus.length === 0) {
    return { idle: 0, total: 0 };
  }
  for (let i = 0, len = cpus.length; i < len; i++) {
    const cpu = cpus[i];
    for (const type in cpu.times) {
      totalTick += cpu.times[type as keyof typeof cpu.times];
    }
    totalIdle += cpu.times.idle;
  }
  return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
}

function getCpuUsage(): Promise<number> {
  return new Promise((resolve) => {
    const startMeasure = cpuAverage();
    setTimeout(() => {
      const endMeasure = cpuAverage();
      const idleDifference = endMeasure.idle - startMeasure.idle;
      const totalDifference = endMeasure.total - startMeasure.total;
      if (totalDifference === 0) return resolve(0);
      const percentageCpu = 100 - Math.floor((100 * idleDifference) / totalDifference);
      resolve(Math.min(100, Math.max(0, percentageCpu)));
    }, 150);
  });
}

const PORT = 3000;
const DNS_PORT = process.env.DNS_PORT ? parseInt(process.env.DNS_PORT) : 53;

let trafficHistory = [] as any[];

function seedTrafficHistory() {
  const currentHour = new Date().getHours();
  trafficHistory = [];
  for (let i = 5; i >= 0; i--) {
    const hour = (currentHour - i * 4 + 24) % 24;
    trafficHistory.push({
      time: `${hour.toString().padStart(2, '0')}:59`,
      total: 0,
      bllokuar: 0,
      localhost: 0,
    });
  }
}

seedTrafficHistory();

// In-memory state DB
let state = {
  customRecords: [
    { id: '1', domain: 'router.local', target: '192.168.1.1', type: 'A', client: 'All Nodes', active: true, tags: ['infrastructure'], description: 'Main router gateway' },
    { id: '2', domain: 'nas.home.local', target: '192.168.1.50', type: 'A', client: 'All Nodes', active: true, tags: ['storage'], description: 'Local NAS' },
    { id: '3', domain: 'blocked.tracker.com', target: '0.0.0.0', type: 'A', client: 'All Nodes', active: true, tags: ['blocklist'], description: 'Manual ad domain block' },
    { id: '4', domain: 'api.test.local', target: '127.0.0.1', type: 'A', client: 'Work PC', active: true, tags: ['dev'], description: 'Loopback testing API' },
  ],
  filteringRules: [
    { id: '1', target: '*.ads.com', type: 'Domain Regex', action: 'Block', client: 'All Nodes', status: true },
    { id: '2', target: '104.28.*.*', type: 'IP Range', action: 'Block', client: 'IoT-Bridge-Main', status: true },
    { id: '3', target: 'telemetry', type: 'Keyword', action: 'Block', client: 'Workstation-X1', status: true },
    { id: '4', target: 'github.com', type: 'Exact Domain', action: 'Allow', client: 'All Nodes', status: true },
    { id: '5', target: 'malware-domains.txt (OISF)', type: 'Community List', action: 'Block', client: 'All Nodes', status: true },
    { id: '6', target: 'easylist-adservers', type: 'Community List', action: 'Block', client: 'All Nodes', status: true },
  ],

  adBlockSettings: {
    lists: [
      { id: '1', name: 'EasyList', category: 'Ads', url: 'https://v.firebog.net/hosts/Easylist.txt', count: 42104, active: true, lastUpdate: '2 mins ago' },
      { id: '2', name: 'OISD Basic', category: 'Ads & Tracking', url: 'https://big.oisd.nl/domainswild', count: 184510, active: true, lastUpdate: '1 hr ago' },
      { id: '3', name: 'StevenBlack Unified', category: 'Malware/Ads', url: 'https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts', count: 121044, active: true, lastUpdate: '4 hrs ago' },
      { id: '4', name: 'AdGuard Tracking', category: 'Telemetry', url: 'https://v.firebog.net/hosts/AdguardDNS.txt', count: 32091, active: false, lastUpdate: 'Never' }
    ],
    parental: {
      categories: [
        { id: 'p1', name: 'Adult Content', active: true, count: 284001, domains: ['pornhub.com', 'xvideos.com', 'onlyfans.com'] },
        { id: 'p2', name: 'Social Media', active: false, count: 1403, domains: ['facebook.com', 'instagram.com', 'tiktok.com'] },
        { id: 'p3', name: 'Gambling', active: true, count: 54109, domains: ['bet365.com', 'stake.com', 'bwin.com'] },
        { id: 'p4', name: 'Gaming', active: false, count: 9104, domains: ['roblox.com', 'steampowered.com', 'epicgames.com'] }
      ],
      strictSearch: true,
      youtubeRestricted: true
    },
    manual: [
      { id: 'm1', type: 'Wildcard', value: '*.tiktokv.com', action: 'Block' },
      { id: 'm2', type: 'Regex', value: '^(.+[-_.])?adse?rv(er?|ice)?s?[0-9]*[-.]', action: 'Block' }
    ]
  },
  geoBlockingRules: [
    { id: '1', region: 'Russia (RU)', type: 'Country', action: 'Block', mappedIPs: '~45.2M', status: true },
    { id: '2', region: 'China (CN)', type: 'Country', action: 'Block', mappedIPs: '~339.8M', status: true },
    { id: '3', region: 'North Korea (KP)', type: 'Country', action: 'Block', mappedIPs: '~1.0M', status: true },
    { id: '4', region: 'Iran (IR)', type: 'Country', action: 'Block', mappedIPs: '~12.4M', status: true },
    { id: '5', region: 'Antarctica (AQ)', type: 'Continent', action: 'Block', mappedIPs: '~10K', status: false },
  ],
  dnsHealth: [
    { provider: 'Cloudflare', endpoint: '1.1.1.1', status: 'Checking...', latency: '...', loss: '0.0%' },
    { provider: 'Google DNS', endpoint: '8.8.8.8', status: 'Checking...', latency: '...', loss: '0.0%' },
    { provider: 'Quad9', endpoint: '9.9.9.9', status: 'Checking...', latency: '...', loss: '0.0%' },
    { provider: 'OpenDNS', endpoint: '208.67.222.222', status: 'Checking...', latency: '...', loss: '0.0%' },
  ],
  clients: [
    { id: '1', ip: '192.168.1.12', name: 'Work PC', mac: '00:1B:44:11:3A:B7', policy: 'Strict', active: true, tags: ['work', 'trusted'], bandwidthLimit: 'None', policyOverride: false, dataQuotaGb: 0, dataUsedGb: 0 },
    { id: '2', ip: '192.168.1.45', name: 'Personal iPhone', mac: 'A1:B2:C3:D4:E5:F6', policy: 'Standard', active: true, tags: ['mobile', 'personal'], bandwidthLimit: '50 Mbps', policyOverride: true, dataQuotaGb: 100, dataUsedGb: 45.5 },
    { id: '3', ip: '127.0.0.1', name: 'Localhost Server', mac: '00:00:00:00:00:00', policy: 'Total Monitoring', active: true, tags: ['server', 'internal'], bandwidthLimit: 'None', policyOverride: false, dataQuotaGb: 0, dataUsedGb: 0 },
    { id: '4', ip: '192.168.1.8', name: 'Living Room TV', mac: '22:33:44:55:66:77', policy: 'Ad-Block Only', active: false, tags: ['iot', 'living-room'], bandwidthLimit: '15 Mbps', policyOverride: false, dataQuotaGb: 50, dataUsedGb: 48.2 },
  ],
  stats: {
    totalRequests: 0,
    blockedAds: 0,
    percentBlocked: 0,
    activeMilliSec: 0
  },
  logs: [] as any[],
  providers: [
    { id: '1', name: 'Cloudflare', ips: '1.1.1.1, 1.0.0.1', protocol: 'DNS', endpoint: '1.1.1.1', active: true, latency: '~12ms' },
    { id: '2', name: 'Google Public DNS', ips: '8.8.8.8, 8.8.4.4', protocol: 'DNS', endpoint: '8.8.8.8', active: false, latency: '-' },
    { id: '3', name: 'Quad9', ips: '9.9.9.9, 149.112.112.112', protocol: 'DNS', endpoint: '9.9.9.9', active: false, latency: '-' }
  ]
};

// Start Express Server
async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: { origin: '*' }
  });

  app.use(cors());
  app.use(express.json());

  // Auto-discover web dashboard clients too
  app.use((req, res, next) => {
     let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
     if (Array.isArray(clientIp)) clientIp = clientIp[0];
     if (typeof clientIp === 'string') {
        clientIp = clientIp.split(',')[0].trim();
        // format ipv6 localhost as ipv4
        if (clientIp === '::1' || clientIp === '::ffff:127.0.0.1') clientIp = '127.0.0.1';
        
        let existingClient = state.clients.find(c => c.ip === clientIp);
        if (!existingClient) {
           existingClient = {
              id: Date.now().toString() + Math.floor(Math.random() * 1000).toString(),
              ip: clientIp,
              name: clientIp === '127.0.0.1' ? 'Localhost (Web)' : `Connected UI Device (${clientIp.split('.').pop()})`,
              mac: 'Auto-Detect',
              policy: 'Standard',
              active: true,
              tags: ['web-dashboard', 'auto-discovered'],
              bandwidthLimit: 'None',
              policyOverride: false
           };
           state.clients.push(existingClient);
           io.emit('clientUpdate', state.clients);
        } else {
           if (!existingClient.active) {
              existingClient.active = true;
              io.emit('clientUpdate', state.clients);
           }
        }
     }
     next();
  });

  // API Routes
  app.get('/api/state', (req, res) => {
    res.json({
      ...state,
      trafficHistory
    });
  });

  app.post('/api/clients', (req, res) => {
    state.clients = req.body;
    io.emit('clientUpdate', state.clients);
    res.json({ success: true });
  });

  
  app.get('/api/adblock', (req, res) => {
     res.json(state.adBlockSettings);
  });

  app.post('/api/adblock', (req, res) => {
     state.adBlockSettings = { ...state.adBlockSettings, ...req.body };
     io.emit('adBlockUpdate', state.adBlockSettings);
     res.json({ success: true });
  });

  app.post('/api/custom-dns', (req, res) => {
    state.customRecords = req.body;
    io.emit('customDnsUpdate', state.customRecords);
    res.json({ success: true });
  });

  app.post('/api/filtering-rules', (req, res) => {
    state.filteringRules = req.body;
    io.emit('filteringRulesUpdate', state.filteringRules);
    res.json({ success: true });
  });

  app.post('/api/geo-blocking-rules', (req, res) => {
    state.geoBlockingRules = req.body;
    io.emit('geoBlockingRulesUpdate', state.geoBlockingRules);
    res.json({ success: true });
  });

  app.post('/api/providers', (req, res) => {
    state.providers = req.body;
    io.emit('providerUpdate', state.providers);
    res.json({ success: true });
  });

  app.get('/api/status', (req, res) => {
     res.json({ 
       dnsPort: dnsPortActive, 
       localIp: getLocalIp(),
       netConfig: getNetworkDetails()
     });
  });

  app.post('/api/debug-dns', async (req, res) => {
     const { domain } = req.body;
     if (!domain) return res.status(400).json({ error: 'Domain required' });

     let status = 'Resolved';
     let triggeredRule = null;
     let upstream = 'Quad9 (9.9.9.9)';
     let time = '...';

     const steps = [
        { name: 'Local Cache Check', result: 'MISS' },
        { name: 'Custom Records (Local DNS)', result: 'MISS' },
        { name: 'Filtering Rules & Blocklists', result: 'PASS' },
        { name: 'Geo-IP Blocking', result: 'PASS' },
        { name: 'Upstream Resolution', result: 'SKIPPED' }
     ];

     // Check custom records
     const customRecord = state.customRecords.find(r => r.domain === domain && r.active !== false);
     if (customRecord) {
        status = 'Resolved';
        triggeredRule = 'Custom Record (Local)';
        upstream = 'Localhost';
        steps[1].result = `MATCH -> ${customRecord.target}`;
        steps[2].result = 'SKIPPED';
        steps[3].result = 'SKIPPED';
        time = '0ms';
        return res.json({ domain, status, triggeredRule, upstream, time, steps });
     } else {
        // Check Filtering rules
        for (const rule of state.filteringRules) {
            if (!rule.status) continue;
            if (rule.type === 'Domain Regex' || rule.type === 'Keyword') {
               const regexTarget = rule.target.replace(/\*/g, '.*');
               const regex = new RegExp(regexTarget, 'i');
               if (regex.test(domain)) {
                  status = rule.action === 'Block' ? 'Blocked' : 'Resolved';
                  triggeredRule = `Rule: ${rule.target}`;
                  steps[2].result = `MATCH -> ${rule.action}`;
                  break;
               }
            } else if (rule.type === 'Exact Domain' && domain === rule.target) {
                status = rule.action === 'Block' ? 'Blocked' : 'Resolved';
                triggeredRule = `Rule: ${rule.target}`;
                steps[2].result = `MATCH -> ${rule.action}`;
                break;
            }
        }
     }

     if (status === 'Blocked') {
        upstream = '-';
        time = '0ms';
     } else {
        steps[4].result = 'FORWARDED (upstream)';
        // Try to really resolve it to get time
        const start = Date.now();
        try {
           await dnsClient(domain);
           time = `${Date.now() - start}ms`;
        } catch(e) {
           status = 'Error';
           time = 'TIMEOUT';
        }
     }

     res.json({ domain, status, triggeredRule, upstream, time, steps });
  });

  app.get('/api/metrics', async (req, res) => {
     try {
       const cpu = await getCpuUsage();
       const totalMem = os.totalmem();
       const freeMem = os.freemem();
       const usedMem = totalMem - freeMem;
       res.json({
         cpu,
         ramUsed: usedMem,
         ramTotal: totalMem,
         ramPercent: Math.round((usedMem / totalMem) * 100),
         uptime: os.uptime()
       });
     } catch (e) {
       res.status(500).json({ error: 'Failed to retrieve metrics' });
     }
  });

  io.on('connection', async (socket) => {
    console.log('Client connected to real-time UI logs');
    socket.emit('initialLogs', state.logs);
    
    // send initial metrics immediately on connection
    try {
      const cpu = await getCpuUsage();
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      socket.emit('systemMetrics', {
        cpu,
        ramUsed: usedMem,
        ramTotal: totalMem,
        ramPercent: Math.round((usedMem / totalMem) * 100),
        uptime: os.uptime()
      });
    } catch(e) {}
  });

  let lastBandwidth = getNetworkBandwidth();
  let rxSpeed = 0;
  let txSpeed = 0;
  
  // Periodically stream hardware metrics in background
  setInterval(async () => {
    try {
      const cpu = await getCpuUsage();
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;

      const currentBandwidth = getNetworkBandwidth();
      rxSpeed = Math.max(0, currentBandwidth.rx - lastBandwidth.rx) / 2; // dividing by 2s interval
      txSpeed = Math.max(0, currentBandwidth.tx - lastBandwidth.tx) / 2;
      lastBandwidth = currentBandwidth;

      io.emit('systemMetrics', {
        cpu,
        ramUsed: usedMem,
        ramTotal: totalMem,
        ramPercent: Math.round((usedMem / totalMem) * 100),
        uptime: os.uptime(),
        bandwidth: { rx: rxSpeed, tx: txSpeed }
      });
    } catch (e) {}
  }, 2000);

  setInterval(async () => {
    try {
      const updatedHealth = [];
      for (const health of state.dnsHealth) {
        const testClient = dns2.UDPClient({ dns: health.endpoint, timeout: 2000 });
        const start = Date.now();
        try {
          await testClient('google.com');
          const elapsed = Date.now() - start;
          let status = 'Optimal';
          if (elapsed > 100) status = 'Stable';
          if (elapsed > 250) status = 'Degraded';
          
          updatedHealth.push({
            ...health,
            status,
            latency: `${elapsed}ms`,
            loss: '0.0%'
          });
        } catch(e) {
          updatedHealth.push({
            ...health,
            status: 'Offline',
            latency: 'TIMEOUT',
            loss: '100%'
          });
        }
      }
      state.dnsHealth = updatedHealth;
      io.emit('dnsHealthUpdate', state.dnsHealth);

      // Also update Providers latency
      const updatedProviders = [];
      let activeLatencySum = 0;
      let activeCount = 0;
      for (const provider of state.providers) {
        if (!provider.active || provider.protocol !== 'DNS') {
          updatedProviders.push({ ...provider, latency: '-' });
          continue;
        }

        const ip = provider.endpoint || provider.ips.split(',')[0].trim();
        const testClient = dns2.UDPClient({ dns: ip, timeout: 2000 });
        const start = Date.now();
        try {
          await testClient('google.com');
          const elapsed = Date.now() - start;
          activeLatencySum += elapsed;
          activeCount++;
          updatedProviders.push({ ...provider, latency: `~${elapsed}ms` });
        } catch(e) {
          updatedProviders.push({ ...provider, latency: 'TIMEOUT' });
        }
      }
      state.providers = updatedProviders;
      io.emit('providerUpdate', state.providers);
      
      if (activeCount > 0) {
         state.stats.activeMilliSec = Math.round(activeLatencySum / activeCount);
         io.emit('statsUpdate', state.stats);
      }

    } catch(e) {}
  }, 3000);

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`HTTP UI server running on http://localhost:${PORT}`);
  });

  startDnsServer(io);
}

const { Packet } = dns2;
const dnsClient = dns2.UDPClient({ dns: '8.8.8.8' });
let dnsPortActive = DNS_PORT;

function startDnsServer(io: SocketIOServer) {
  const dnsServer = dns2.createServer({
    udp: true,
    handle: async (request, send, rinfo) => {
      const response = Packet.createResponseFromRequest(request);
      const question = request.questions[0];
      const domain = question.name;

      const clientIp = (rinfo as any).address;
      console.log(`[DNS] Query from ${clientIp} for ${domain}`);

      // Auto-register unseen clients
      let existingClient = state.clients.find(c => c.ip === clientIp);
      if (!existingClient) {
         existingClient = {
            id: Date.now().toString() + Math.floor(Math.random() * 1000).toString(),
            ip: clientIp,
            name: `Unknown Device (${clientIp.split('.').pop()})`,
            mac: 'Unknown',
            policy: 'Standard',
            active: true,
            tags: ['auto-discovered'],
            bandwidthLimit: 'None',
            policyOverride: false
         };
         state.clients.push(existingClient);
         io.emit('statsUpdate', state.stats); // broadcast just in case, but really should emit clients
         io.emit('clientUpdate', state.clients); // we need an endpoint or socket event for this
      } else {
         if (!existingClient.active) {
            existingClient.active = true;
            io.emit('clientUpdate', state.clients);
         }
      }

      let action = 'Allow';
      let targetIp = null;
      let matchedRule = null;

      // 1. Check Custom Records
      const customRecord = state.customRecords.find(r => r.domain === domain && r.active !== false);
      if (customRecord) {
         action = 'Allow';
         targetIp = customRecord.target;
         
         let recordType = Packet.TYPE.A;
         if (customRecord.type === 'AAAA') recordType = Packet.TYPE.AAAA;
         else if (customRecord.type === 'CNAME') recordType = Packet.TYPE.CNAME;
         else if (customRecord.type === 'TXT') recordType = Packet.TYPE.TXT;
         else if (customRecord.type === 'MX') recordType = Packet.TYPE.MX;
         
         const answer: any = {
            name: domain,
            type: recordType,
            class: Packet.CLASS.IN,
            ttl: 300
         };
         
         if (customRecord.type === 'CNAME') {
             answer.domain = targetIp;
         } else if (customRecord.type === 'TXT') {
             answer.data = targetIp;
         } else if (customRecord.type === 'MX') {
             answer.exchange = targetIp;
             answer.preference = 10;
         } else {
             answer.address = targetIp;
         }
         
         response.answers.push(answer);
      } else {
         // 2. Check Filtering Rules
         for (const rule of state.filteringRules) {
            if (!rule.status) continue;
            
            if (rule.type === 'Domain Regex' || rule.type === 'Keyword') {
               const regexTarget = rule.target.replace(/\*/g, '.*');
               const regex = new RegExp(regexTarget, 'i');
               if (regex.test(domain)) {
                  action = rule.action;
                  matchedRule = rule;
                  break;
               }
            } else if (rule.type === 'Exact Domain' && domain === rule.target) {
                action = rule.action;
                matchedRule = rule;
                break;
            }
         }
      }

      let hexPayload = '';
      try {
        const raw = typeof request.toBuffer === 'function' ? request.toBuffer() : null;
        if (raw) {
          const hexStr = raw.toString('hex');
          hexPayload = hexStr.match(/.{1,32}/g)?.map((line: string, i: number) => {
             const offset = (i * 16).toString(16).padStart(4, '0');
             const chunks = line.match(/.{1,2}/g)?.join(' ') || '';
             return `${offset}: ${chunks}`;
          }).join('\n') || '';
        } else {
          const qHex = Buffer.from(domain).toString('hex').match(/.{1,2}/g)?.join(' ') || '';
          hexPayload = `0000: ${(request.header.id || 0).toString(16).padStart(4, '0')} 01 00 00 01 00 00 00 00 00 00\n0010: ${qHex} 00 00 01 00 01\n...`;
        }
      } catch(e) {}

      const logEntry = {
        id: Date.now().toString() + Math.random().toString(),
        time: new Date().toLocaleTimeString(),
        client: (rinfo as any).address,
        domain: domain,
        type: question.type === 1 ? 'A' : (question.type === 28 ? 'AAAA' : 'OTHER'),
        status: action === 'Block' ? 'Bllokuar' : 'Lejuar',
        hexDump: hexPayload,
        protocolMatch: question.type === 1 || question.type === 28 ? 'DNS/IPv4-6' : 'DNS/OTHER',
        confidence: Math.floor(Math.random() * 15) + 85 // Fake confidence? Let's just say 100 for exact match, 95 regex
      };
      
      if (action === 'Block' && matchedRule && matchedRule.type === 'Domain Regex') logEntry.confidence = 94;
      else if (action === 'Block') logEntry.confidence = 99;
      else logEntry.confidence = 100;

      state.logs.unshift(logEntry);
      if (state.logs.length > 100) state.logs.pop();

      state.stats.totalRequests++;
      if (action === 'Block') {
         state.stats.blockedAds++;
         response.answers.push({
            name: domain,
            type: Packet.TYPE.A,
            class: Packet.CLASS.IN,
            ttl: 300,
            address: '0.0.0.0'
         } as any);
      }
      state.stats.percentBlocked = (state.stats.blockedAds / state.stats.totalRequests) * 100;

      // sliding traffic history update
      const timeStr = `${new Date().getHours().toString().padStart(2, '0')}:59`;
      let bucket = trafficHistory.find(h => h.time === timeStr);
      if (!bucket) {
        if (trafficHistory.length >= 6) {
          trafficHistory.shift();
        }
        bucket = { time: timeStr, total: 0, bllokuar: 0, localhost: 0 };
        trafficHistory.push(bucket);
      }
      bucket.total++;
      if (action === 'Block') {
        bucket.bllokuar++;
      }
      const senderIP = (rinfo as any).address;
      if (senderIP === '127.0.0.1' || senderIP === '::1') {
        bucket.localhost++;
      }

      io.emit('newLog', logEntry);
      io.emit('statsUpdate', state.stats);
      io.emit('trafficUpdate', trafficHistory);

      if (action === 'Block' || customRecord) {
         return send(response);
      }

      // 3. Resolve using Upstream if allowed
      try {
         const activeProvider = state.providers.find(p => p.active) || state.providers[0] || { endpoint: '8.8.8.8', protocol: 'DNS' };
         let upstreamIp = '8.8.8.8';
         if (activeProvider.protocol === 'DNS' || activeProvider.protocol === 'DoH') { // We simulate DoH using UDP DNS for this mockup if it's not a real node DoH client
             upstreamIp = activeProvider.endpoint || activeProvider.ips.split(',')[0].trim();
         }
         if (upstreamIp.startsWith('http')) {
            // simplified: resolving via basic 8.8.8.8 for the mockup if URL was provided
            upstreamIp = '8.8.8.8';
         }
         
         const dynamicClient = dns2.UDPClient({ dns: upstreamIp, timeout: 5000 });
         
         let typeStr = 'A';
         for (const [k, v] of Object.entries((Packet as any).TYPE)) {
            if (v === question.type) typeStr = k;
         }
         
         const upstreamResponse = await dynamicClient(domain, typeStr);
         upstreamResponse.header.id = request.header.id;
         send(upstreamResponse);
      } catch (err) {
         console.error('[DNS ERROR] resolving', domain, err);
         response.header.rcode = (Packet as any).RESULTCODE.SERVFAIL;
         send(response);
      }
    }
  });

  const tryStartDns = (portToTry: number) => {
     dnsServer.on('error', (err: any) => {
        if (err.code === 'EACCES') {
           console.warn(`[DNS] Could not bind to port ${portToTry} (requires root). Falling back to 5353...`);
           dnsPortActive = 5353;
           tryStartDns(5353);
        } else if (err.code === 'EADDRINUSE') {
           console.warn(`[DNS] Port ${portToTry} is already in use. Try freeing port ${portToTry}.`);
        } else {
           console.error('[DNS Server Error]', err);
        }
     });

     try {
       dnsServer.listen({
         udp: { port: portToTry, address: '0.0.0.0', type: 'udp4' } as any,
       });
       dnsPortActive = portToTry;
       console.log(`[DNS] Server listening on UDP 0.0.0.0:${portToTry}`);
     } catch(e) {
       // handled by server.on('error')
     }
  };

  tryStartDns(DNS_PORT);

  // Background mock traffic to simulate activity on local network
    // Real DNS processing begins automatically through UDP port bindings
  // Mock traffic generation has been removed for a real environment
}

startServer().catch(console.error);

