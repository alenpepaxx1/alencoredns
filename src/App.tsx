// Copyright Alen Pepa
import React, { useState, useEffect } from 'react';
import { Shield, Activity, Server, AlertTriangle, Users, BookOpen, Clock, Lock, Globe, Plus, Search, Settings, Copy, X, Download, Bug, Trash, Monitor, Smartphone, Tv, HardDrive, Wifi, ShieldAlert } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { io } from 'socket.io-client';
import { WireguardAdvanced } from './components/WireguardAdvanced';
import { SystemSettingsAdvanced } from './components/SystemSettingsAdvanced';
import { CustomDNSAdvanced } from './components/CustomDNSAdvanced';
import { ClientRegistryAdvanced } from './components/ClientRegistryAdvanced';
import { SecurityPoliciesAdvanced } from './components/SecurityPoliciesAdvanced';
import { TrafficAnalysisAdvanced } from './components/TrafficAnalysisAdvanced';
import { DashboardAdvanced } from './components/DashboardAdvanced';
import { AdBlockControlAdvanced } from './components/AdBlockControlAdvanced';


const socket = io(); // Connects to the same host


type Language = 'en' | 'de' | 'sq';

const translations = {
  en: {
    sidebar_adblock: 'Adblock & Content',
    sidebar_vpn: 'WireGuard VPN',
    vpn_title: 'WireGuard VPN Settings',
    vpn_desc: 'Optionally enable a WireGuard VPN tunnel. Devices using this node for DNS can optionally tunnel all traffic through this VPN.',
    enable_vpn: 'Enable WireGuard VPN',
    vpn_enabled: 'VPN Active',
    vpn_disabled: 'VPN Disabled',
    vpn_endpoint: 'VPN Endpoint',
    vpn_public_key: 'Public Key',
    vpn_listen_port: 'Listen Port',
    vpn_allowed_ips: 'Allowed IPs',
    vpn_save: 'Save Configuration',
    sidebar_dashboard: 'Dashboard',
    sidebar_client: 'Client Registry',
    sidebar_security: 'Security Policies',
    sidebar_traffic: 'Traffic Analysis',
    sidebar_settings: 'System Settings',
    server_active: 'Server Active & Listening',
    configure_devices: 'Configure your devices on the local network (Wi-Fi or LAN) with the following DNS addresses (DNS 1 / DNS 2) to apply traffic filtering rules and route through this node.',
    total_requests: 'Total Requests',
    live_from: 'Live from port',
    blocked_threats: 'Blocked Threats',
    total_traffic: 'total traffic',
    avg_latency: 'Avg Latency',
    network_performance: 'Network performance',
    active_rules: 'Active Rules',
    policies_loaded: 'Policies loaded',
    traffic_activity: 'Traffic Activity (24h)',
    quick_actions: 'Quick Actions',
    add_node: 'Add Node',
    update_lists: 'Update Lists',
    reboot_service: 'Reboot Service',
    client_management: 'Client Management',
    provision_new: '+ PROVISION NEW CLIENT',
    client_identifier: 'Client Identifier',
    local_ip: 'Local IP',
    mac_address: 'MAC Address',
    assigned_policy: 'Assigned Policy',
    client_nodes: 'Client Nodes (Nodes/PCs)',
    add_client: 'Add Client',
    client_name: 'Client Name',
    ip_mac: 'IP Address / MAC',
    upstream_target: 'Upstream Target',
    bandwidth_limit: 'Bandwidth Limit',
    status: 'Status',
    actions: 'Actions',
    active: 'Active',
    blocked: 'Blocked',
    total: 'Total',
    localhost: 'Localhost',
    dns_health_monitor: 'DNS Health Monitor',
    provider_ip: 'Provider / IP',
    latency: 'Latency',
    pkt_loss: 'Pkt Loss',
    recent_logs: 'Recent Logs',
    idle: 'Idle',
    edit: 'Edit',
    traffic_filtering: 'Traffic Filtering Rules',
    geo_blocking: 'Geo-Blocking',
    create_policy: 'Create Policy',
    target_element: 'Target Element',
    applied_to: 'Applied To',
    action: 'Action',
    current_status: 'Current Status',
    granular_policies: 'Granular block/allow policies based on domain, IP, or keywords.',
    sync_blocklists: 'SYNC BLOCKLISTS',
    real_time_logs: 'Real-time Interception Logs',
    live_monitoring: 'Live monitoring across all active nodes.',
    search_domain: 'Search domain or IP...',
    export_csv: 'EXPORT CSV',
    query_debugger: 'QUERY DEBUGGER',
    time: 'Time',
    client: 'Client',
    domain: 'Domain',
    type: 'Type',
    system_settings: 'System Settings',
    dashboard_refresh: 'Dashboard Auto-Refresh',
    enable_realtime: 'Enable real-time analytics data fetching through WebSockets.',
    dns_cache: 'DNS Resolution Cache',
    clear_cache: 'Clear the current cache to resolve stale local records or upstream propagation issues.',
    flush_cache: 'FLUSH CACHE',
    flushing: 'FLUSHING...',
    daily_reports: 'Daily Summary Reports',
    receive_reports: 'Receive automated email notifications of daily traffic and health.',
    report_email: 'Report Delivery Email',
    save: 'SAVE',
    dpi_title: 'Deep Packet Inspection (DPI)',
    dpi_desc: 'Enable granular traffic protocol analysis (DNS, HTTP, HTTPS, QUIC) in the Traffic Analysis tab.',
    simulate_dns: 'Simulate DNS Query (Domain)',
    tracing: 'TRACING...',
    trace: 'TRACE',
    cancel: 'Cancel',
    start_sync: 'START SYNC',
    syncing: 'SYNCING...',
    disclaimer: 'Disclaimer',
    external_url: 'External URL (Hosts Format)',
    provide_url: 'Provide a URL to a community-maintained hosts file or regex list.',
    uram_usage: 'RAM: 1.2GB / 8GB',
    core_status: 'ONLINE',
    uptime: 'UPTIME',
    cpu_usage: 'CPU Usage',
    ram_usage: 'RAM Usage',
    resolved: 'RESOLVED',
    rejected: 'REJECTED',
    blacklist: 'Blacklist',
    active_interface: 'Active LAN Interface',
    ip_scope: 'IP Scope',
    connection_type: 'Connection Type',
    active_adapters: 'Active Network Adapters',
    dns_primary: 'DNS 1 (Primary)',
    dns_secondary: 'DNS 2 (Secondary)',
    purged: 'Cache successfully invalidated.'
  },
  de: {
    sidebar_adblock: 'Adblock & Inhalt',
    sidebar_vpn: 'WireGuard VPN',
    vpn_title: 'WireGuard VPN-Einstellungen',
    vpn_desc: 'Aktivieren Sie optional einen WireGuard-VPN-Tunnel. Geräte, die diesen Knoten für DNS verwenden, können den gesamten Datenverkehr über dieses VPN tunneln.',
    enable_vpn: 'WireGuard VPN Aktivieren',
    vpn_enabled: 'VPN Aktiv',
    vpn_disabled: 'VPN Deaktiviert',
    vpn_endpoint: 'VPN-Endpunkt',
    vpn_public_key: 'Öffentlicher Schlüssel',
    vpn_listen_port: 'Listen-Port',
    vpn_allowed_ips: 'Erlaubte IPs',
    vpn_save: 'Konfiguration Speichern',
    sidebar_dashboard: 'Dashboard',
    sidebar_client: 'Client-Registrierung',
    sidebar_security: 'Sicherheitsrichtlinien',
    sidebar_traffic: 'Verkehrsanalyse',
    sidebar_settings: 'Systemeinstellungen',
    server_active: 'Server Aktiv & Hört zu',
    configure_devices: 'Konfigurieren Sie Ihre Geräte im lokalen Netzwerk (WLAN oder LAN) mit den folgenden DNS-Adressen (DNS 1 / DNS 2), um Verkehrsfilterregeln anzuwenden.',
    total_requests: 'Gesamtanfragen',
    live_from: 'Live von Port',
    blocked_threats: 'Blockierte Bedrohungen',
    total_traffic: 'gesamter Verkehr',
    avg_latency: 'Durchschn. Latenz',
    network_performance: 'Netzwerkleistung',
    active_rules: 'Aktive Regeln',
    policies_loaded: 'Richtlinien geladen',
    traffic_activity: 'Verkehrsaktivität (24h)',
    quick_actions: 'Schnelle Aktionen',
    add_node: 'Knoten Hinzufügen',
    update_lists: 'Listen Aktualisieren',
    reboot_service: 'Dienst Neustarten',
    client_management: 'Client-Management',
    provision_new: '+ NEUEN CLIENT BEREITSTELLEN',
    client_identifier: 'Client-Kennung',
    local_ip: 'Lokale IP',
    mac_address: 'MAC-Adresse',
    assigned_policy: 'Zugewiesene Richtlinie',
    client_nodes: 'Client-Knoten (PCs/Knoten)',
    add_client: 'Client Hinzufügen',
    client_name: 'Client-Name',
    ip_mac: 'IP-Adresse / MAC',
    upstream_target: 'Upstream-Ziel',
    bandwidth_limit: 'Bandbreitenlimit',
    status: 'Status',
    actions: 'Aktionen',
    active: 'Aktiv',
    blocked: 'Blockiert',
    total: 'Gesamt',
    localhost: 'Lokaler Host',
    dns_health_monitor: 'DNS-Gesundheitsmonitor',
    provider_ip: 'Anbieter / IP',
    latency: 'Latenz',
    pkt_loss: 'Pkt-Verlust',
    recent_logs: 'Aktuelle Protokolle',
    idle: 'Leerlauf',
    edit: 'Bearbeiten',
    traffic_filtering: 'Verkehrsfilterregeln',
    geo_blocking: 'Geo-Blockierung',
    create_policy: 'Richtlinie Erstellen',
    target_element: 'Zielelement',
    applied_to: 'Angewendet Auf',
    action: 'Aktion',
    current_status: 'Aktueller Status',
    granular_policies: 'Detaillierte Blockier-/Erlaubnisrichtlinien.',
    sync_blocklists: 'SPERRLISTEN SYNCHRONISIEREN',
    real_time_logs: 'Echtzeit-Abfangprotokolle',
    live_monitoring: 'Live-Überwachung über alle aktiven Knoten.',
    search_domain: 'Domäne oder IP suchen...',
    export_csv: 'CSV EXPORTIEREN',
    query_debugger: 'ABFRAGE-DEBUGGER',
    time: 'Zeit',
    client: 'Client',
    domain: 'Domäne',
    type: 'Typ',
    system_settings: 'Systemeinstellungen',
    dashboard_refresh: 'Dashboard Auto-Aktualisierung',
    enable_realtime: 'Aktivieren Sie Echtzeit-Analysedatenabruf über WebSockets.',
    dns_cache: 'DNS-Auflösungs-Cache',
    clear_cache: 'Leeren Sie den Cache, um veraltete lokale Einträge oder Upstream-Verbreitungsprobleme zu beheben.',
    flush_cache: 'CACHE LEEREN',
    flushing: 'LEEREN...',
    daily_reports: 'Tägliche Zusammenfassungsberichte',
    receive_reports: 'Erhalten Sie automatische E-Mail-Benachrichtigungen über den täglichen Verkehr.',
    report_email: 'Berichtszustellungs-E-Mail',
    save: 'SPEICHERN',
    dpi_title: 'Tiefe Paketinspektion (DPI)',
    dpi_desc: 'Aktivieren Sie die detaillierte Verkehrsprotokollanalyse (DNS, HTTP, HTTPS, QUIC).',
    simulate_dns: 'DNS-Abfrage simulieren (Domäne)',
    tracing: 'VERFOLGUNG...',
    trace: 'VERFOLGEN',
    cancel: 'Abbrechen',
    start_sync: 'SYNCHRONISIERUNG STARTEN',
    syncing: 'SYNCHRONISIEREN...',
    disclaimer: 'Haftungsausschluss',
    external_url: 'Externe URL (Hosts-Format)',
    provide_url: 'Geben Sie eine URL zu einer von der Community gepflegten Hosts-Datei an.',
    uram_usage: 'RAM: 1.2GB / 8GB',
    core_status: 'ONLINE',
    uptime: 'BETRIEBSZEIT',
    cpu_usage: 'CPU-Auslastung',
    ram_usage: 'RAM-Auslastung',
    resolved: 'AUFGELÖST',
    rejected: 'ABGEWIESEN',
    blacklist: 'Sperrliste',
    active_interface: 'Aktive LAN-Schnittstelle',
    ip_scope: 'IP-Bereich',
    connection_type: 'Verbindungstyp',
    active_adapters: 'Aktive Netzwerkadapter',
    dns_primary: 'DNS 1 (Primär)',
    dns_secondary: 'DNS 2 (Sekundär)',
    purged: 'Cache erfolgreich entleert.'
  },
  sq: {
    sidebar_adblock: 'Adblock & Filtrimi',
    sidebar_vpn: 'WireGuard VPN',
    vpn_title: 'Cilësimet e WireGuard VPN',
    vpn_desc: 'Aktivizo opsionalisht një tunel VPN WireGuard. Pajisjet që përdorin këtë nyje për DNS mund të ridrejtojnë të gjithë trafikun nëpërmjet këtij VPN-i.',
    enable_vpn: 'Aktivizo WireGuard VPN',
    vpn_enabled: 'VPN Aktiv',
    vpn_disabled: 'VPN Joaktiv',
    vpn_endpoint: 'Pika e Përfundimit (Endpoint)',
    vpn_public_key: 'Çelësi Publik',
    vpn_listen_port: 'Porta e Dëgjimit',
    vpn_allowed_ips: 'IP të Lejuara',
    vpn_save: 'Ruaj Konfigurimin',
    sidebar_dashboard: 'Paneli',
    sidebar_client: 'Regjistri i Klientëve',
    sidebar_security: 'Politikat e Sigurisë',
    sidebar_traffic: 'Analiza e Trafikut',
    sidebar_settings: 'Cilësimet e Sistemit',
    server_active: 'Serveri Aktiv & Në Dëgjim',
    configure_devices: 'Konfiguroni pajisjet tuaja në rrjetin lokal (Wi-Fi ose LAN) me adresat DNS të mëposhtme (DNS 1 / DNS 2).',
    total_requests: 'Kërkesat Totale',
    live_from: 'Drejtpërdrejt nga porti',
    blocked_threats: 'Kërcënimet e Bllokuara',
    total_traffic: 'trafiku total',
    avg_latency: 'Vonesa Mesatare',
    network_performance: 'Performanca e Rrjetit',
    active_rules: 'Rregulla Aktive',
    policies_loaded: 'Politika të ngarkuara',
    traffic_activity: 'Aktiviteti i Trafikut (24h)',
    quick_actions: 'Veprime të Shpejta',
    add_node: 'Shto Nyje',
    update_lists: 'Përditëso Listat',
    reboot_service: 'Rinis Shërbimin',
    client_management: 'Menaxhimi i Klientëve',
    provision_new: '+ KRIJO KLIENT TË RI',
    client_identifier: 'Identifikuesi i Klientit',
    local_ip: 'IP Lokale',
    mac_address: 'Adresa MAC',
    assigned_policy: 'Politika e Caktuar',
    client_nodes: 'Nyjet e Klientit (Nyje/PC)',
    add_client: 'Shto Klient',
    client_name: 'Emri i Klientit',
    ip_mac: 'Adresa IP / MAC',
    upstream_target: 'Objektivi në Rrjedhë',
    bandwidth_limit: 'Kufiri i Bandwidth',
    status: 'Statusi',
    actions: 'Veprimet',
    active: 'Aktiv',
    blocked: 'Bllokuar',
    total: 'Totali',
    localhost: 'Lokale',
    dns_health_monitor: 'Monitorimi i Shëndetit DNS',
    provider_ip: 'Ofruesi / IP',
    latency: 'Vonesa',
    pkt_loss: 'Humbje Pkt',
    recent_logs: 'Kërkimet e Fundit',
    idle: 'Në Pritje',
    edit: 'Ndrysho',
    traffic_filtering: 'Rregullat e Filtrimit të Trafikut',
    geo_blocking: 'Bllokimi Gjeografik',
    create_policy: 'Krijo Politikë',
    target_element: 'Elementi i Synuar',
    applied_to: 'Zbatohet Në',
    action: 'Veprimi',
    current_status: 'Statusi Aktual',
    granular_policies: 'Politika bllokimi/lejimi sipas domenit, IP-së, ose fjalëve kyçe.',
    sync_blocklists: 'SINKRONIZO LISTAT E BLLOKIMIT',
    real_time_logs: 'Kërkimet e Ndërprera në Kohë Reale',
    live_monitoring: 'Monitorim i drejtpërdrejtë në të gjitha nyjet aktive.',
    search_domain: 'Kërko domen ose IP...',
    export_csv: 'EKSPOPRTO CSV',
    query_debugger: 'DEBUGGER I KËRKIMEVE',
    time: 'Koha',
    client: 'Klienti',
    domain: 'Domeni',
    type: 'Tipi',
    system_settings: 'Cilësimet e Sistemit',
    dashboard_refresh: 'Rifresko Automatikisht',
    enable_realtime: 'Aktivizo marrjen e të dhënave në kohë reale.',
    dns_cache: 'Kufina e Vendimeve DNS',
    clear_cache: 'Pastro keshin aktual për të zgjidhur ngadalësimin.',
    flush_cache: 'PASTRO KESHIN',
    flushing: 'DUKE PASTRUAR...',
    daily_reports: 'Raporte Ditore',
    receive_reports: 'Merr raporte me email çdo ditë.',
    report_email: 'Emaili i Dërgimit të Raportit',
    save: 'RUAJ',
    dpi_title: 'Inspektim i Thellë Paketash (DPI)',
    dpi_desc: 'Aktivizo analizimin e thellë të protokolleve të trafikut (DNS, HTTP, HTTPS, QUIC).',
    simulate_dns: 'Simulo Kërkesë DNS (Domen)',
    tracing: 'DUKE NDIJEKUR...',
    trace: 'NDIQ',
    cancel: 'Anulo',
    start_sync: 'FILLONI SINKRONIZIMIN',
    syncing: 'DUKE SINKRONIZUAR...',
    disclaimer: 'Mohim Përgjegjësie',
    external_url: 'URL e Jashtme (Formati i Hosteve)',
    provide_url: 'Siguroni një URL të një skedari hosts.',
    uram_usage: 'RAM: 1.2GB / 8GB',
    core_status: 'ONLINE',
    uptime: 'KOHA AKTIVE',
    cpu_usage: 'Përdorimi i CPU-së',
    ram_usage: 'Përdorimi i RAM-it',
    resolved: 'LEJUAR',
    rejected: 'BLLOKUAR',
    blacklist: 'Lista e Zezë',
    active_interface: 'Ndërfaqja Aktive LAN',
    ip_scope: 'Shtrirja e IP-ve',
    connection_type: 'Lloji i Lidhjes',
    active_adapters: 'Karta Rrjeti Aktive',
    dns_primary: 'DNS 1 (Parësor)',
    dns_secondary: 'DNS 2 (Dytësor)',
    purged: 'Kashi u pastrua me sukses.'
  }
};

export default function App() {
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [cpuUsage, setCpuUsage] = useState<number>(0);
  const [ramStats, setRamStats] = useState({ used: 0, total: 0, percent: 0 });
  const [bandwidth, setBandwidth] = useState({ rx: 0, tx: 0 });
  const [serverUptime, setServerUptime] = useState<string>('...');
  const [netConfig, setNetConfig] = useState<any>({
    name: 'Loopback',
    ip: '127.0.0.1',
    netmask: '255.0.0.0',
    dns1: '127.0.0.1',
    dns2: '1.1.1.1',
    subnetRange: '127.0.0.0/8',
    ipType: 'Loopback Localhost'
  });

  const [language, setLanguage] = useState<Language>('en');
  const t = (key: keyof typeof translations.en) => translations[language][key];
  const [activeTab, setActiveTab] = useState('overview');

  const [vpnEnabled, setVpnEnabled] = useState(false);
  const [vpnEndpoint, setVpnEndpoint] = useState('vpn.example.com:51820');

  const [toast, setToast] = useState<{ id: string, message: string, title: string, time: string } | null>(null);

  // Dynamic backend state
  const [dnsPort, setDnsPort] = useState<number | string>('...');
  const [localIp, setLocalIp] = useState<string>('...');
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [dnsHealthData, setDnsHealthData] = useState<any[]>([]);

  const [providers, setProviders] = useState([
    { id: '1', name: 'Cloudflare', ips: '1.1.1.1, 1.0.0.1', protocol: 'DoH', endpoint: 'https://cloudflare-dns.com/dns-query', active: true, latency: '~12ms' },
    { id: '2', name: 'Google Public DNS', ips: '8.8.8.8, 8.8.4.4', protocol: 'DoH', endpoint: 'https://dns.google/dns-query', active: false, latency: '-' },
    { id: '3', name: 'Quad9', ips: '9.9.9.9, 149.112.112.112', protocol: 'DoH', endpoint: 'https://dns.quad9.net/dns-query', active: false, latency: '-' }
  ]);

  const [filteringRules, setFilteringRules] = useState<any[]>([]);
  const [geoBlockingRules, setGeoBlockingRules] = useState<any[]>([]);
  const [customRecordsList, setCustomRecordsList] = useState<any[]>([]);
  const [clientsList, setClientsList] = useState<any[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const autoRefreshRef = React.useRef(autoRefresh);
  
  // Debugger state
  const [showDebuggerModal, setShowDebuggerModal] = useState(false);
  const [debugDomain, setDebugDomain] = useState('');
  const [debugResult, setDebugResult] = useState<any>(null);

  const [isDebugRunning, setIsDebugRunning] = useState(false);

  const handleSetProviders = async (newProviders: any[]) => {
    setProviders(newProviders);
    try {
      await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProviders)
      });
    } catch (e) {}
  };

  const [stats, setStats] = useState({
    totalRequests: 0,
    blockedAds: 0,
    percentBlocked: 0,
    activeMilliSec: 0
  });
  const [isFlushingCache, setIsFlushingCache] = useState(false);
  const [dailyReportsEnabled, setDailyReportsEnabled] = useState(false);
  const [reportEmail, setReportEmail] = useState('');
  const [dpiEnabled, setDpiEnabled] = useState(true);
  const [viewDpiLog, setViewDpiLog] = useState<any>(null);

  const handleFlushCache = () => {
    setIsFlushingCache(true);
    // Simulate backend sending success response
    setTimeout(() => {
      setIsFlushingCache(false);
      setToast({
        id: Date.now().toString(),
        title: 'Cache Flushed',
        message: 'DNS resolution cache cleared successfully.',
        time: 'Just now'
      });
      setTimeout(() => setToast(null), 3000);
    }, 1000);
  };


  const runDebugger = async () => {
    if (!debugDomain) return;
    setIsDebugRunning(true);
    setDebugResult(null);

    try {
      const res = await fetch('/api/debug-dns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: debugDomain })
      });
      const data = await res.json();
      setDebugResult(data);
    } catch (e) {
      setDebugResult({ status: 'Error', error: 'Failed to reach backend' });
    } finally {
      setIsDebugRunning(false);
    }
  };

  useEffect(() => {
    autoRefreshRef.current = autoRefresh;
  }, [autoRefresh]);

  useEffect(() => {
    // Fetch initial state
    fetch('/api/state').then(r => r.json()).then(state => {
      setFilteringRules(state.filteringRules || []);
      setGeoBlockingRules(state.geoBlockingRules || []);
      setCustomRecordsList(state.customRecords || []);
      setDnsHealthData(state.dnsHealth || []);
      setClientsList(state.clients || []);
      if (state.providers) setProviders(state.providers);
      setStats(state.stats || { totalRequests: 0, blockedAds: 0, percentBlocked: 0, activeMilliSec: 0 });
      if (state.trafficHistory) {
        setTrafficData(state.trafficHistory);
      }
    }).catch(err => console.error("Could not fetch initial state", err));

    fetch('/api/status').then(r => r.json()).then(s => {
      setDnsPort(s.dnsPort);
      setLocalIp(s.localIp);
      if (s.netConfig) {
        setNetConfig(s.netConfig);
      }
    }).catch(console.error);

    fetch('/api/metrics').then(r => r.json()).then(metrics => {
      setCpuUsage(metrics.cpu);
      const usedGb = parseFloat((metrics.ramUsed / 1024 / 1024 / 1024).toFixed(2));
      const totalGb = parseFloat((metrics.ramTotal / 1024 / 1024 / 1024).toFixed(1));
      setRamStats({
        used: usedGb,
        total: totalGb,
        percent: metrics.ramPercent
      });
      const totalSec = metrics.uptime;
      const d = Math.floor(totalSec / (3600*24));
      const h = Math.floor((totalSec % (3600*24)) / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      setServerUptime(`${d}d ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m`);
      if (metrics.bandwidth) {
         setBandwidth(metrics.bandwidth);
      }
    }).catch(console.error);

    socket.on('initialLogs', (logs) => {
      if (autoRefreshRef.current) {
        setRecentLogs(logs);
      }
    });

    socket.on('newLog', (log) => {
      if (autoRefreshRef.current) {
        setRecentLogs(prev => [log, ...prev].slice(0, 100));
      }
    });

    socket.on('statsUpdate', (newStats) => {
      if (autoRefreshRef.current) {
        setStats(newStats);
      }
    });

    socket.on('trafficUpdate', (history) => {
      if (autoRefreshRef.current) {
        setTrafficData(history);
      }
    });

    socket.on('systemMetrics', (metrics) => {
      if (autoRefreshRef.current) {
        setCpuUsage(metrics.cpu);
        const usedGb = parseFloat((metrics.ramUsed / 1024 / 1024 / 1024).toFixed(2));
        const totalGb = parseFloat((metrics.ramTotal / 1024 / 1024 / 1024).toFixed(1));
        setRamStats({
          used: usedGb,
          total: totalGb,
          percent: metrics.ramPercent
        });
        const totalSec = metrics.uptime;
        const d = Math.floor(totalSec / (3600*24));
        const h = Math.floor((totalSec % (3600*24)) / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        setServerUptime(`${d}d ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m`);
        if (metrics.bandwidth) {
          setBandwidth(metrics.bandwidth);
        }
      }
    });

    socket.on('dnsHealthUpdate', (health) => {
      setDnsHealthData(health);
    });

    socket.on('clientUpdate', (clients) => {
      setClientsList(clients);
    });

    socket.on('providerUpdate', (data) => {
      setProviders(data);
    });

    socket.on('customDnsUpdate', (data) => {
      setCustomRecordsList(data);
    });

    socket.on('filteringRulesUpdate', (data) => {
      setFilteringRules(data);
    });

    socket.on('geoBlockingRulesUpdate', (data) => {
      setGeoBlockingRules(data);
    });

    return () => {
      socket.off('initialLogs');
      socket.off('newLog');
      socket.off('statsUpdate');
      socket.off('trafficUpdate');
      socket.off('systemMetrics');
      socket.off('dnsHealthUpdate');
      socket.off('clientUpdate');
      socket.off('providerUpdate');
      socket.off('customDnsUpdate');
      socket.off('filteringRulesUpdate');
      socket.off('geoBlockingRulesUpdate');
    };
  }, []);

  // Simulated toast logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setToast({
        id: Date.now().toString(),
        title: 'Network Monitor',
        message: 'Backend server is running and intercepting simulated internal network traffic.',
        time: 'Just now'
      });
      
      const hideTimer = setTimeout(() => setToast(null), 10000);
      return () => clearTimeout(hideTimer);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <DashboardAdvanced 
            t={t}
            netConfig={netConfig}
            bandwidth={bandwidth}
            stats={stats}
            filteringRules={filteringRules}
            geoBlockingRules={geoBlockingRules}
            customRecordsList={customRecordsList}
            trafficData={trafficData}
            dnsHealthData={dnsHealthData}
            recentLogs={recentLogs}
            dnsPort={dnsPort}
cpuUsage={cpuUsage}
ramStats={ramStats}
serverUptime={serverUptime}
          />
        );
      case 'clients':
        return (
          <ClientRegistryAdvanced t={t} clientsList={clientsList} setClientsList={setClientsList} />
        );
      case 'rules':
        return (
          <SecurityPoliciesAdvanced 
             t={t} 
             filteringRules={filteringRules} 
             setFilteringRules={setFilteringRules} 
             geoBlockingRules={geoBlockingRules} 
             setGeoBlockingRules={setGeoBlockingRules} 
          />
        );
      case 'dns':
        return (
          <CustomDNSAdvanced t={t} customRecordsList={customRecordsList} setCustomRecordsList={setCustomRecordsList} />
        );
      case 'logs':
        return (
          <TrafficAnalysisAdvanced 
             t={t} 
             trafficData={trafficData} 
             recentLogs={recentLogs} 
             dpiEnabled={dpiEnabled} 
              
             setShowDebuggerModal={setShowDebuggerModal} 
          />
        );
      case 'vpn':
        return (
          <WireguardAdvanced t={t} />
        );
      case 'settings':
        return (
          <SystemSettingsAdvanced t={t} providers={providers} setProviders={handleSetProviders} dnsPort={dnsPort} localIp={localIp} autoRefresh={autoRefresh} setAutoRefresh={setAutoRefresh} />
        );
      case 'adblock':
        return (
          <AdBlockControlAdvanced t={t} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text-p font-sans h-screen flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="h-[60px] bg-theme-surface border-b border-theme-border flex items-center justify-between px-6 shrink-0">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-theme-accent rounded-[4px] flex items-center justify-center text-black font-bold text-lg">
               A
            </div>
            <h1 className="text-[18px] font-semibold m-0 tracking-[-0.5px]">Alen<span className="text-theme-accent">DNS</span> Core</h1>
            <span className="text-[10px] bg-theme-accent/10 py-[2px] px-[8px] border border-theme-accent rounded-full ml-2 text-theme-accent">v4.2.0-STABLE</span>
         </div>
         <div className="flex gap-6 font-mono text-[12px] items-center">
            <div className="flex gap-2 mr-4">
              <button onClick={() => setLanguage('en')} className={`text-[16px] transition-opacity cursor-pointer border-none bg-transparent ${language === 'en' ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-80'}`} title="English">🇺🇸</button>
              <button onClick={() => setLanguage('de')} className={`text-[16px] transition-opacity cursor-pointer border-none bg-transparent ${language === 'de' ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-80'}`} title="Deutsch">🇩🇪</button>
              <button onClick={() => setLanguage('sq')} className={`text-[16px] transition-opacity cursor-pointer border-none bg-transparent ${language === 'sq' ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-80'}`} title="Shqip">🇦🇱</button>
            </div>
            <div className="text-theme-success">● NODE_PARIS_01: {t('core_status')}</div>
            <div className="text-theme-text-s flex gap-4">
              <span>{t('uptime')}: 142d 04h 12m</span>
              <button className="flex items-center gap-1 text-theme-text-p hover:text-theme-accent transition cursor-pointer bg-transparent border-none p-0">
                <Clock size={14} /> 24H
              </button>
            </div>
         </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-[220px] bg-theme-surface border-r border-theme-border p-4 flex flex-col gap-1 shrink-0">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-[10px] px-[12px] py-[10px] rounded-[4px] text-[13px] transition-all font-sans border-l-2 ${
              activeTab === 'overview' 
                ? 'bg-theme-accent/5 text-theme-accent border-theme-accent' 
                : 'text-theme-text-s hover:bg-theme-accent/5 hover:text-theme-accent border-transparent'
            }`}
          >
            <Activity size={16} /> {t('sidebar_dashboard')}
          </button>
          <button 
            onClick={() => setActiveTab('clients')}
            className={`w-full flex items-center gap-[10px] px-[12px] py-[10px] rounded-[4px] text-[13px] transition-all font-sans border-l-2 ${
              activeTab === 'clients' 
                ? 'bg-theme-accent/5 text-theme-accent border-theme-accent' 
                : 'text-theme-text-s hover:bg-theme-accent/5 hover:text-theme-accent border-transparent'
            }`}
          >
            <Users size={16} /> {t('sidebar_client')}
          </button>
          <button 
            onClick={() => setActiveTab('rules')}
            className={`w-full flex items-center gap-[10px] px-[12px] py-[10px] rounded-[4px] text-[13px] transition-all font-sans border-l-2 ${
              activeTab === 'rules' 
                ? 'bg-theme-accent/5 text-theme-accent border-theme-accent' 
                : 'text-theme-text-s hover:bg-theme-accent/5 hover:text-theme-accent border-transparent'
            }`}
          >
            <Shield size={16} /> {t('sidebar_security')}
          </button>
          <button 
            onClick={() => setActiveTab('dns')}
            className={`w-full flex items-center gap-[10px] px-[12px] py-[10px] rounded-[4px] text-[13px] transition-all font-sans border-l-2 ${
              activeTab === 'dns' 
                ? 'bg-theme-accent/5 text-theme-accent border-theme-accent' 
                : 'text-theme-text-s hover:bg-theme-accent/5 hover:text-theme-accent border-transparent'
            }`}
          >
            <BookOpen size={16} /> Custom DNS
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`w-full flex items-center gap-[10px] px-[12px] py-[10px] rounded-[4px] text-[13px] transition-all font-sans border-l-2 ${
              activeTab === 'logs' 
                ? 'bg-theme-accent/5 text-theme-accent border-theme-accent' 
                : 'text-theme-text-s hover:bg-theme-accent/5 hover:text-theme-accent border-transparent'
            }`}
          >
            <Activity size={16} /> Traffic Analysis
          </button>
          
          <button 
            onClick={() => setActiveTab('adblock')}
            className={`w-full flex items-center gap-[10px] px-[12px] py-[10px] rounded-[4px] text-[13px] transition-all font-sans border-l-2 ${
              activeTab === 'adblock' 
                ? 'bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]' 
                : 'text-theme-text-s hover:bg-[#F5A623]/10 hover:text-[#F5A623] border-transparent'
            }`}
          >
            <ShieldAlert size={16} /> {t('sidebar_adblock')}
          </button>

          <button 
            onClick={() => setActiveTab('vpn')}
            className={`w-full flex items-center gap-[10px] px-[12px] py-[10px] rounded-[4px] text-[13px] transition-all font-sans border-l-2 ${
              activeTab === 'vpn' 
                ? 'bg-theme-accent/5 text-theme-accent border-theme-accent' 
                : 'text-theme-text-s hover:bg-theme-accent/5 hover:text-theme-accent border-transparent'
            }`}
          >
            <Shield size={16} /> {t('sidebar_vpn')}
          </button>
          <button 
            onClick={() => setActiveTab('settings')}

            className={`w-full flex items-center gap-[10px] px-[12px] py-[10px] rounded-[4px] text-[13px] transition-all font-sans border-l-2 ${
              activeTab === 'settings' 
                ? 'bg-theme-accent/5 text-theme-accent border-theme-accent' 
                : 'text-theme-text-s hover:bg-theme-accent/5 hover:text-theme-accent border-transparent'
            }`}
          >
            <Settings size={16} /> {t('sidebar_settings')}
          </button>
          
          <div className="mt-auto pt-3 border-t border-theme-border/60">
             <div className="flex justify-between text-[10px] uppercase text-theme-text-s tracking-[0.05em] mb-1 font-semibold">
               <span>{t('cpu_usage')}</span>
               <span className="font-mono text-theme-accent">{cpuUsage}%</span>
             </div>
             <div className="h-1.5 bg-[#14161B] w-full my-1 rounded-full overflow-hidden border border-theme-border/30">
                <div className="h-full bg-theme-accent transition-all duration-500 rounded-full" style={{ width: `${cpuUsage}%` }}></div>
             </div>
             <div className="flex justify-between text-[10px] uppercase text-theme-text-s tracking-[0.05em] mt-3 font-semibold">
               <span>{t('ram_usage')}</span>
               <span className="font-mono text-theme-accent">{ramStats.used}GB / {ramStats.total}GB</span>
             </div>
             <div className="h-1.5 bg-[#14161B] w-full my-1 rounded-full overflow-hidden border border-theme-border/30">
                <div className="h-full bg-theme-success transition-all duration-500 rounded-full" style={{ width: `${ramStats.percent}%` }}></div>
             </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-[20px] bg-theme-bg overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
  
        <footer className="mt-8 pt-4 pb-2 border-t border-theme-border/50 text-center text-theme-text-s text-[11px]">
          Copyright Alen Pepa &copy; {new Date().getFullYear()}
        </footer>
      </main>


        {showDebuggerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#050607] border border-theme-border rounded-[4px] p-5 w-[500px] shadow-2xl">
              <div className="flex justify-between items-center mb-4 border-b border-theme-border pb-3">
                <h3 className="m-0 text-[14px] uppercase tracking-[0.05em] font-semibold text-theme-text-p flex items-center gap-2">
                   <Bug size={16} className="text-theme-accent" />{t('query_debugger')}</h3>
                <button 
                  onClick={() => setShowDebuggerModal(false)}
                  className="text-theme-text-s hover:text-white transition-colors cursor-pointer bg-transparent border-none pt-1"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                   <label className="block text-[10px] text-theme-text-s uppercase tracking-[0.05em] mb-1 font-semibold">{t('simulate_dns')}</label>
                   <div className="flex gap-2">
                     <input 
                       type="text" 
                       className="flex-1 bg-theme-bg border border-theme-border text-theme-text-p text-[12px] p-2 rounded-[2px] font-mono focus:outline-none focus:border-theme-accent placeholder:text-theme-text-s/50" 
                       value={debugDomain} 
                       onChange={(e) => setDebugDomain(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && runDebugger()}
                       placeholder="e.g. tracking.example.com" 
                     />
                     <button 
                       onClick={runDebugger}
                       disabled={!debugDomain || isDebugRunning}
                       className="text-[11px] font-bold uppercase tracking-wider text-black bg-theme-accent hover:opacity-90 px-4 py-2 rounded-[2px] border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       {isDebugRunning ? 'TRACING...' : 'TRACE'}
                     </button>
                   </div>
                </div>

                {debugResult && (
                  <div className="mt-4 border border-theme-border rounded-[4px] overflow-hidden">
                    {debugResult.error ? (
                        <div className="bg-theme-danger/10 p-3 text-theme-danger text-[11px] font-mono">
                           [!] {debugResult.error}
                        </div>
                    ) : (
                      <>
                        <div className="bg-theme-surface p-3 border-b border-theme-border flex justify-between items-center">
                           <span className="font-mono text-[12px] text-theme-text-p font-semibold">{debugResult.domain}</span>
                           <span className={`px-[6px] py-[2px] rounded-[2px] text-[10px] font-bold uppercase ${
                              debugResult.status === 'Blocked' ? 'bg-theme-danger/20 text-theme-danger border border-theme-danger/50' : 'bg-theme-accent/20 text-theme-accent border border-theme-accent/50'
                           }`}>
                             {debugResult.status} ({debugResult.time})
                           </span>
                        </div>
                        <div className="p-3 bg-theme-bg text-[11px] font-mono space-y-2">
                           {debugResult.steps && debugResult.steps.map((step: any, i: number) => (
                             <div key={i} className="flex gap-3">
                               <span className="text-[#565f89] shrink-0 w-[20px] text-right">{i+1}.</span>
                               <span className="text-theme-text-s flex-1">{step.name}</span>
                               <span className={`${
                                 step.result.includes('MATCH') ? 'text-theme-danger font-bold' : 
                                 step.result.includes('FORWARDED') ? 'text-theme-success' : 'text-theme-text-p'
                               }`}>{step.result}</span>
                             </div>
                           ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#050607] border border-theme-accent shadow-[0_0_15px_rgba(30,207,178,0.15)] rounded-[4px] p-4 w-[340px] animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-theme-accent" />
                <h4 className="text-[12px] font-bold text-theme-accent uppercase tracking-wider m-0">{toast.title}</h4>
              </div>
              <button 
                onClick={() => setToast(null)}
                className="text-theme-text-s hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-[11px] text-theme-text-p m-0 mb-3 leading-relaxed">
              {toast.message}
            </p>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-theme-text-s">{toast.time}</span>
              <div className="flex gap-2">
                <button className="bg-transparent text-theme-danger hover:underline border-none cursor-pointer uppercase font-bold tracking-wider" onClick={() => setToast(null)}>Block</button>
                <button className="bg-transparent text-theme-success hover:underline border-none cursor-pointer uppercase font-bold tracking-wider" onClick={() => setToast(null)}>Allow</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
