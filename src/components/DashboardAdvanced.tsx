import React, { useState, useEffect } from 'react';
import { Activity, Copy, Shield, ShieldCheck, ShieldAlert, Cpu, Globe, Server, Database, TrendingUp, Zap, Clock, Maximize2, RefreshCw, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, ComposedChart 
} from 'recharts';

export const DashboardAdvanced = ({ 
  t, 
  netConfig, 
  bandwidth, 
  stats, 
  filteringRules, 
  geoBlockingRules, 
  customRecordsList, 
  trafficData, 
  dnsHealthData, 
  recentLogs, 
  dnsPort, cpuUsage, ramStats, serverUptime 
}: any) => {

  const [expandedChart, setExpandedChart] = useState<string | null>(null);
  
  // Real-time animated counters
  const [liveReqs, setLiveReqs] = useState(stats.totalRequests);
  const [liveBlocked, setLiveBlocked] = useState(stats.blockedAds);

  useEffect(() => {
    setLiveReqs(stats.totalRequests);
    setLiveBlocked(stats.blockedAds);
  }, [stats]);

  const COLORS = ['#00E676', '#FF4B5C', '#00F0FF', '#F5A623', '#9D00FF'];

  // Calculate top domains from recent logs
  const topBlockedDomains = recentLogs
    .filter((l: any) => l.status === 'Bllokuar')
    .reduce((acc: any, curr: any) => {
      acc[curr.domain] = (acc[curr.domain] || 0) + 1;
      return acc;
    }, {});
  
  const topBlockedData = Object.keys(topBlockedDomains)
    .sort((a, b) => topBlockedDomains[b] - topBlockedDomains[a])
    .slice(0, 5)
    .map(key => ({ name: key, count: topBlockedDomains[key] }));

  // Query Types stats
  const queryTypes = [
    { name: 'A', value: 65, color: '#00E676' },
    { name: 'AAAA', value: 20, color: '#00F0FF' },
    { name: 'HTTPS', value: 10, color: '#F5A623' },
    { name: 'CNAME', value: 3, color: '#9D00FF' },
    { name: 'TXT', value: 2, color: '#FF4B5C' },
  ];

  return (
    <div className="space-y-6">
      {/* Network Interface Intel Bar */}
      <div className="bg-theme-surface border border-theme-border p-5 rounded-[4px] relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-theme-accent/5 to-transparent pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className="space-y-5 w-full lg:max-w-3xl relative z-10">
            <div>
              <h2 className="text-[14px] font-bold text-white uppercase tracking-widest mb-1.5 flex items-center gap-2">
                <Activity size={16} className="text-theme-accent" /> Network Deploy Hub & Global Telemetry
              </h2>
              <p className="text-[11px] text-[#565f89] mt-0 mb-0 font-mono">
                Active Edge Node. Devices routed to this node's DNS IPs will be intercepted, filtered, and aggregated in real-time.
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-theme-bg/50 p-3 rounded-[2px] border border-theme-border/50">
                <span className="block text-[#565f89] uppercase text-[9px] font-bold tracking-widest mb-1.5 flex items-center gap-1.5"><Globe size={10}/> Active Interface</span>
                <span className="text-white font-mono font-bold text-[13px]">{netConfig.name}</span>
              </div>
              <div className="bg-theme-bg/50 p-3 rounded-[2px] border border-theme-border/50">
                <span className="block text-[#565f89] uppercase text-[9px] font-bold tracking-widest mb-1.5 flex items-center gap-1.5"><Network size={10} className="hidden" /> IP Subnet</span>
                <span className="text-white font-mono font-bold text-[13px]">{netConfig.netmask}</span>
              </div>
              <div className="bg-theme-bg/50 p-3 rounded-[2px] border border-theme-border/50">
                <span className="block text-[#565f89] uppercase text-[9px] font-bold tracking-widest mb-1.5 flex items-center gap-1.5"><Database size={10}/> CIDR Scope</span>
                <span className="text-white font-mono font-bold text-[13px]">{netConfig.subnetRange}</span>
              </div>
              <div className="bg-theme-bg/50 p-3 rounded-[2px] border border-theme-border/50">
                <span className="block text-[#565f89] uppercase text-[9px] font-bold tracking-widest mb-1.5 flex items-center gap-1.5"><Zap size={10}/> Link Type</span>
                <span className="text-theme-accent font-mono font-bold text-[13px]">{netConfig.ipType}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="bg-[#050607] px-4 py-3 rounded-[2px] border border-theme-border flex items-center gap-5 group hover:border-theme-accent/50 transition-colors shadow-inner">
                <div>
                  <span className="block text-[9px] text-theme-accent uppercase font-bold tracking-widest mb-1">Primary DNS (v4)</span>
                  <span className="font-mono text-[16px] text-white font-bold tracking-widest">{netConfig.dns1}</span>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(netConfig.dns1); }} className="text-theme-text-s group-hover:text-theme-accent transition-colors cursor-pointer bg-theme-surface border border-theme-border p-1.5 rounded-sm"><Copy size={14}/></button>
              </div>
              
              <div className="bg-[#050607] px-4 py-3 rounded-[2px] border border-theme-border flex items-center gap-5 group hover:border-theme-success/50 transition-colors shadow-inner">
                <div>
                  <span className="block text-[9px] text-theme-success uppercase font-bold tracking-widest mb-1">Secondary DNS (v4)</span>
                  <span className="font-mono text-[16px] text-white font-bold tracking-widest">{netConfig.dns2}</span>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(netConfig.dns2); }} className="text-theme-text-s group-hover:text-theme-success transition-colors cursor-pointer bg-theme-surface border border-theme-border p-1.5 rounded-sm"><Copy size={14}/></button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end lg:self-stretch justify-between h-full bg-[#050607]/50 p-4 rounded-[4px] border border-theme-border/30 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-6">
              <span className="relative flex h-2.5 w-2.5">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-accent opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-theme-accent"></span>
              </span>
              <span className="text-[12px] text-theme-accent font-mono uppercase tracking-widest font-bold">Node Online &middot; Port {dnsPort}</span>
            </div>
            
            <div className="flex flex-col items-end gap-3 text-right w-full">
              <div className="bg-[#050607] px-4 py-3 border border-theme-border/50 rounded-[2px] w-full min-w-[160px] shadow-sm flex flex-col items-end">
                <div className="text-[9px] uppercase tracking-widest text-[#00E676] font-bold mb-1 flex items-center gap-1.5"><TrendingUp size={10} className="rotate-180"/> RX STREAM (DL)</div>
                <div className="text-white font-mono text-[18px] font-bold">
                   {bandwidth.rx > 1024*1024 ? (bandwidth.rx / 1024 / 1024).toFixed(2) + ' MB/s' : (bandwidth.rx / 1024).toFixed(1) + ' KB/s'}
                </div>
              </div>
              <div className="bg-[#050607] px-4 py-3 border border-theme-border/50 rounded-[2px] w-full min-w-[160px] shadow-sm flex flex-col items-end">
                <div className="text-[9px] uppercase tracking-widest text-theme-accent font-bold mb-1 flex items-center gap-1.5"><TrendingUp size={10}/> TX STREAM (UL)</div>
                <div className="text-white font-mono text-[18px] font-bold">
                   {bandwidth.tx > 1024*1024 ? (bandwidth.tx / 1024 / 1024).toFixed(2) + ' MB/s' : (bandwidth.tx / 1024).toFixed(1) + ' KB/s'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-theme-surface border border-theme-border p-5 rounded-[4px] relative overflow-hidden shadow-sm group hover:border-theme-accent/50 transition-colors">
          <div className="flex justify-between items-start mb-2">
             <div className="text-[10px] uppercase text-[#565f89] tracking-widest font-bold">Global Queries</div>
             <Server size={14} className="text-theme-text-s group-hover:text-theme-accent transition-colors"/>
          </div>
          <div className="font-mono text-[28px] font-bold text-white tracking-tight">{liveReqs.toLocaleString()}</div>
          <div className="text-[10px] text-theme-success mt-1.5 flex items-center gap-1 font-bold tracking-wider"><TrendingUp size={10}/> +12% vs last hr</div>
          <div className="absolute -bottom-2 -right-2 text-theme-border/20 z-0"><Activity size={64}/></div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-theme-surface border border-theme-border p-5 rounded-[4px] relative overflow-hidden shadow-sm group hover:border-theme-danger/50 transition-colors">
          <div className="flex justify-between items-start mb-2">
             <div className="text-[10px] uppercase text-[#565f89] tracking-widest font-bold">Threats Dropped</div>
             <ShieldAlert size={14} className="text-theme-danger/70 group-hover:text-theme-danger transition-colors"/>
          </div>
          <div className="font-mono text-[28px] font-bold text-theme-danger tracking-tight">{liveBlocked.toLocaleString()}</div>
          <div className="text-[10px] text-theme-danger mt-1.5 tracking-wider font-bold">{stats.percentBlocked.toFixed(1)}% of total transit</div>
          <div className="absolute -bottom-2 -right-2 text-theme-border/20 z-0"><ShieldAlert size={64}/></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-theme-surface border border-theme-border p-5 rounded-[4px] relative overflow-hidden shadow-sm group hover:border-theme-accent/50 transition-colors">
          <div className="flex justify-between items-start mb-2">
             <div className="text-[10px] uppercase text-[#565f89] tracking-widest font-bold">P99 Engine Latency</div>
             <Zap size={14} className="text-theme-text-s group-hover:text-theme-accent transition-colors"/>
          </div>
          <div className="font-mono text-[28px] font-bold text-theme-accent tracking-tight">{stats.activeMilliSec}ms</div>
          <div className="text-[10px] text-theme-success mt-1.5 tracking-wider font-bold flex items-center gap-1"><ShieldCheck size={10}/> Optimal execution</div>
          <div className="absolute -bottom-2 -right-2 text-theme-border/20 z-0"><Cpu size={64}/></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-theme-surface border border-theme-border p-5 rounded-[4px] relative overflow-hidden shadow-sm group hover:border-white/20 transition-colors">
          <div className="flex justify-between items-start mb-2">
             <div className="text-[10px] uppercase text-[#565f89] tracking-widest font-bold">Active Policies</div>
             <Shield size={14} className="text-theme-text-s group-hover:text-white transition-colors"/>
          </div>
          <div className="font-mono text-[28px] font-bold text-white tracking-tight">{filteringRules.length + geoBlockingRules.length + customRecordsList.length}</div>
          <div className="text-[10px] text-[#565f89] mt-1.5 tracking-wider font-bold">Rules injected into cache</div>
          <div className="absolute -bottom-2 -right-2 text-theme-border/20 z-0"><Database size={64}/></div>
        </motion.div>
      </div>

      {/* Main Charts Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Live Traffic Flow (Spans 2 columns) */}
         <div className="bg-theme-surface border border-theme-border rounded-[4px] p-5 shadow-sm lg:col-span-2 flex flex-col">
            <div className="flex justify-between items-center mb-6">
               <h2 className="m-0 text-[14px] uppercase tracking-widest font-bold text-white flex items-center gap-2">
                 <Activity size={14} className="text-theme-accent"/> Global Traffic Flow
               </h2>
               <div className="flex gap-4 text-[10px] font-mono font-bold tracking-wider">
                  <span className="flex items-center gap-1.5 text-white"><span className="w-2 h-2 rounded-full bg-theme-success"></span>TOTAL</span>
                  <span className="flex items-center gap-1.5 text-white"><span className="w-2 h-2 rounded-full bg-theme-danger"></span>DROPPED</span>
                  <span className="flex items-center gap-1.5 text-white"><span className="w-2 h-2 rounded-full bg-theme-accent"></span>CACHED</span>
               </div>
            </div>
            
            <div className="flex-1 min-h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E676" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00E676" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF4B5C" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FF4B5C" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLocal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" stroke="#262A33" vertical={false} />
                  <XAxis dataKey="time" stroke="#565f89" tick={{fill: '#565f89', fontSize: 10, fontFamily: 'JetBrains Mono'}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#565f89" tick={{fill: '#565f89', fontSize: 10, fontFamily: 'JetBrains Mono'}} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#14161B', borderColor: '#262A33', color: '#F8FAFC', fontSize: 11, fontFamily: 'JetBrains Mono', borderRadius: '4px' }}
                    itemStyle={{ color: '#F8FAFC', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="total" name="Total DNS" stroke="#00E676" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                  <Area type="monotone" dataKey="bllokuar" name="Blocked" stroke="#FF4B5C" strokeWidth={2} fillOpacity={1} fill="url(#colorBlocked)" />
                  <Area type="monotone" dataKey="localhost" name="Cached" stroke="#00F0FF" strokeWidth={2} fillOpacity={1} fill="url(#colorLocal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Distribution & Threat Intel */}
         <div className="flex flex-col gap-6">
            {/* Query Types Pie */}
            <div className="bg-theme-surface border border-theme-border rounded-[4px] p-5 shadow-sm">
                <h2 className="m-0 mb-4 text-[12px] text-white uppercase tracking-widest font-bold border-b border-theme-border/50 pb-3 flex items-center gap-2">
                   <Database size={14} className="text-theme-accent"/> Protocol Distribution
                </h2>
                <div className="h-[180px] w-full relative">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie
                           data={queryTypes}
                           cx="50%"
                           cy="50%"
                           innerRadius={50}
                           outerRadius={80}
                           paddingAngle={2}
                           dataKey="value"
                           stroke="none"
                         >
                           {queryTypes.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                         </Pie>
                         <Tooltip 
                           contentStyle={{ backgroundColor: '#14161B', borderColor: '#262A33', color: '#FFF', fontSize: 11, fontFamily: 'JetBrains Mono', borderRadius: '4px' }}
                           itemStyle={{ fontWeight: 'bold' }}
                         />
                      </PieChart>
                   </ResponsiveContainer>
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                      <span className="text-[20px] font-mono font-bold text-white">DNS</span>
                      <span className="text-[9px] text-[#565f89] uppercase tracking-widest font-bold">Types</span>
                   </div>
                </div>
            </div>

            {/* Top Blocked Domains */}
            <div className="bg-theme-surface border border-theme-border rounded-[4px] p-5 shadow-sm flex-1">
                <h2 className="m-0 mb-4 text-[12px] text-white uppercase tracking-widest font-bold border-b border-theme-border/50 pb-3 flex items-center gap-2">
                   <ShieldAlert size={14} className="text-theme-danger"/> Threat Intelligence
                </h2>
                <div className="space-y-3">
                   {topBlockedData.length > 0 ? topBlockedData.map((item: any, idx: number) => (
                      <div key={idx} className="flex flex-col gap-1.5">
                         <div className="flex justify-between items-center text-[11px] font-mono">
                            <span className="text-white truncate max-w-[180px]">{item.name}</span>
                            <span className="text-theme-danger font-bold">{item.count}</span>
                         </div>
                         <div className="w-full h-1.5 bg-theme-bg rounded-full overflow-hidden border border-theme-border/50">
                            <div className="h-full bg-theme-danger" style={{ width: `${Math.min((item.count / topBlockedData[0].count) * 100, 100)}%` }}></div>
                         </div>
                      </div>
                   )) : (
                      <div className="text-center text-[11px] text-theme-text-s py-4 uppercase tracking-widest font-bold">No threats mitigated yet</div>
                   )}
                </div>
            </div>
         </div>
      </div>

      {/* Real-time Subsystem & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Live Hardware Metrics */}
         <div className="bg-theme-surface border border-theme-border rounded-[4px] p-5 shadow-sm">
            <h2 className="m-0 mb-4 text-[12px] text-white uppercase tracking-widest font-bold border-b border-theme-border/50 pb-3 flex justify-between items-center">
               <div className="flex items-center gap-2"><Cpu size={14} className="text-theme-accent"/> Hardware Infrastructure</div>
            </h2>
            <div className="space-y-5">
               <div>
                  <div className="flex justify-between items-end mb-1 text-[11px] font-mono">
                     <span className="text-[#565f89] uppercase font-bold tracking-wider text-[10px]">CPU Compute</span>
                     <span className={cpuUsage > 80 ? 'text-theme-danger font-bold' : 'text-theme-success font-bold'}>{cpuUsage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-theme-bg rounded-full overflow-hidden border border-theme-border/50">
                     <div className={cpuUsage > 80 ? 'h-full bg-theme-danger transition-all' : 'h-full bg-theme-success transition-all'} style={{ width: `${cpuUsage}%` }}></div>
                  </div>
               </div>
               
               <div>
                  <div className="flex justify-between items-end mb-1 text-[11px] font-mono">
                     <span className="text-[#565f89] uppercase font-bold tracking-wider text-[10px]">Memory (DRAM)</span>
                     <span className={ramStats?.percent > 85 ? 'text-theme-danger font-bold' : 'text-theme-accent font-bold'}>{ramStats?.used} GB / {ramStats?.total} GB</span>
                  </div>
                  <div className="w-full h-1.5 bg-theme-bg rounded-full overflow-hidden border border-theme-border/50">
                     <div className={ramStats?.percent > 85 ? 'h-full bg-theme-danger transition-all' : 'h-full bg-theme-accent transition-all'} style={{ width: `${ramStats?.percent}%` }}></div>
                  </div>
               </div>
               
               <div className="pt-3 border-t border-theme-border/50">
                  <div className="flex justify-between items-end mb-1 text-[11px] font-mono">
                     <span className="text-[#565f89] uppercase font-bold tracking-wider text-[10px]">Node Uptime</span>
                     <span className="text-white font-bold">{serverUptime}</span>
                  </div>
               </div>
            </div>
         </div>
         {/* Live Node Health */}
         <div className="bg-theme-surface border border-theme-border rounded-[4px] p-5 shadow-sm">
            <h2 className="m-0 mb-4 text-[12px] text-white uppercase tracking-widest font-bold border-b border-theme-border/50 pb-3 flex justify-between items-center">
               <div className="flex items-center gap-2"><Cpu size={14} className="text-theme-accent"/> Resolver Matrix Health</div>
               <div className="flex items-center gap-2 text-[9px] text-theme-success bg-theme-success/10 px-2 py-0.5 rounded-sm border border-theme-success/20">
                 <span className="w-1.5 h-1.5 bg-theme-success rounded-full animate-ping"></span> SYNCED
               </div>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
               {dnsHealthData.map((item: any, idx: number) => {
                 let bgColor = 'bg-theme-bg';
                 let borderColor = 'border-theme-border/50';
                 let textColor = 'text-white';
                 let dotColor = 'bg-theme-text-s animate-pulse';
                 
                 if (item.status === 'Optimal') {
                   bgColor = 'bg-[#00E676]/10';
                   borderColor = 'border-[#00E676]/30';
                   textColor = 'text-[#00E676]';
                   dotColor = 'bg-[#00E676]';
                 } else if (item.status === 'Stable') {
                   bgColor = 'bg-[#00F0FF]/10';
                   borderColor = 'border-[#00F0FF]/30';
                   textColor = 'text-[#00F0FF]';
                   dotColor = 'bg-[#00F0FF]';
                 } else if (item.status === 'Degraded') {
                   bgColor = 'bg-[#F5A623]/10';
                   borderColor = 'border-[#F5A623]/30';
                   textColor = 'text-[#F5A623]';
                   dotColor = 'bg-[#F5A623]';
                 } else { // Down or TIMEOUT
                   bgColor = 'bg-[#FF4B5C]/10';
                   borderColor = 'border-[#FF4B5C]/30';
                   textColor = 'text-[#FF4B5C]';
                   dotColor = 'bg-[#FF4B5C]';
                 }

                 return (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     key={idx} 
                     className={`border rounded-[4px] p-3 shadow-inner flex flex-col justify-between h-[80px] transition-colors ${bgColor} ${borderColor}`}
                   >
                     <div className="flex justify-between items-start w-full gap-2">
                       <span className="text-[10px] font-bold text-white uppercase tracking-wider truncate flex-1" title={item.provider}>
                          {item.provider}
                       </span>
                       <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shadow-[0_0_8px_currentColor] shrink-0 mt-1`}></span>
                     </div>
                     
                     <div className="flex justify-between items-end w-full">
                       <span className={`text-[14px] font-mono font-bold tracking-tight ${textColor === 'text-white' ? '' : textColor}`}>
                         {item.latency}
                       </span>
                       <span className="text-[8px] uppercase tracking-widest text-white/50 font-bold ml-2 truncate">
                         {item.status}
                       </span>
                     </div>
                   </motion.div>
                 );
               })}
            </div>
         </div>

         {/* Latest Ingress Logs */}
         <div className="bg-theme-surface border border-theme-border rounded-[4px] p-5 shadow-sm">
            <h2 className="m-0 mb-4 text-[12px] text-white uppercase tracking-widest font-bold border-b border-theme-border/50 pb-3 flex justify-between items-center">
               <div className="flex items-center gap-2"><Clock size={14} className="text-theme-accent"/> Filter Ingress Stream</div>
               <button className="bg-theme-bg border border-theme-border text-white px-2 py-1 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider hover:border-theme-accent transition-colors rounded-sm cursor-pointer">
                  View All
               </button>
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[11px] text-left">
                  <thead>
                     <tr className="border-b border-theme-border/50">
                       <th className="py-3 px-2 text-[#565f89] uppercase tracking-widest font-bold w-[70px]">Timestamp</th>
                       <th className="py-3 px-2 text-[#565f89] uppercase tracking-widest font-bold min-w-[100px]">Node/MAC</th>
                       <th className="py-3 px-2 text-[#565f89] uppercase tracking-widest font-bold">Query</th>
                       <th className="py-3 px-2 text-[#565f89] uppercase tracking-widest font-bold text-right">Result</th>
                     </tr>
                  </thead>
                  <tbody>
                    {recentLogs.slice(0,5).map((log: any, idx: number) => (
                      <tr key={idx} className="border-b border-theme-border/30 hover:bg-theme-bg/50 transition-colors">
                        <td className="py-3 px-2 font-mono text-[#565f89]">{log.time}</td>
                        <td className="py-3 px-2 font-mono text-white font-bold truncate max-w-[100px]" title={log.client}>{log.client.split(' ')[0]}</td>
                        <td className="py-3 px-2 font-mono text-theme-accent truncate max-w-[150px]" title={log.domain}>{log.domain}</td>
                        <td className="py-3 px-2 text-right">
                          <span className={`px-[6px] py-[3px] rounded-[2px] text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                            log.status === 'Lejuar' 
                            ? 'text-theme-success bg-theme-success/10 border border-theme-success/20' 
                            : 'text-theme-danger bg-theme-danger/10 border border-theme-danger/20'
                          }`}>
                            {log.status === 'Lejuar' ? 'RESOLVED' : 'BLOCKED'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {recentLogs.length === 0 && (
                  <div className="text-center py-8 text-[11px] font-bold uppercase tracking-widest text-[#565f89]">
                    Awaiting Ingress Traffic...
                  </div>
                )}
            </div>
         </div>
      </div>
    </div>
  );
};
