import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Search, Download, Bug, ShieldAlert, Activity, Filter, Clock, LayoutList, CheckCircle, Database } from 'lucide-react';

export const TrafficAnalysisAdvanced = ({ 
   t, 
   trafficData, 
   recentLogs, 
   dpiEnabled, 
   setShowDebuggerModal 
}: any) => {
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [viewDpiLog, setViewDpiLog] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('24h');

  // Metrics from recent logs
  const topDomains = useMemo(() => {
    const counts: Record<string, number> = {};
    recentLogs.forEach((log: any) => {
      counts[log.domain] = (counts[log.domain] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([domain, count]) => ({ domain, count }));
  }, [recentLogs]);

  const topBlocked = useMemo(() => {
    const counts: Record<string, number> = {};
    recentLogs.filter((log: any) => log.status !== 'Lejuar').forEach((log: any) => {
      counts[log.domain] = (counts[log.domain] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([domain, count]) => ({ domain, count }));
  }, [recentLogs]);

  const topClients = useMemo(() => {
    const counts: Record<string, number> = {};
    recentLogs.forEach((log: any) => {
      counts[log.client] = (counts[log.client] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([client, count]) => ({ client: client.split(' ')[0], count }));
  }, [recentLogs]);

  const queryTypes = useMemo(() => {
    const counts = { A: 0, AAAA: 0, HTTPS: 0, OTHER: 0 };
    recentLogs.forEach((log: any) => {
      if (log.type === 'A') counts.A++;
      else if (log.type === 'AAAA') counts.AAAA++;
      else if (log.type === 'HTTPS') counts.HTTPS++;
      else counts.OTHER++;
    });
    return [
      { name: 'A (IPv4)', value: counts.A, color: '#7aa2f7' },
      { name: 'AAAA (IPv6)', value: counts.AAAA, color: '#bb9af7' },
      { name: 'HTTPS', value: counts.HTTPS, color: '#9ece6a' },
      { name: 'OTHER', value: counts.OTHER, color: '#e0af68' }
    ].filter(i => i.value > 0);
  }, [recentLogs]);

  const filteredLogs = useMemo(() => {
    if (!logSearchTerm) return recentLogs;
    const term = logSearchTerm.toLowerCase();
    return recentLogs.filter((log: any) => 
       log.domain.toLowerCase().includes(term) || 
       log.client.toLowerCase().includes(term)
    );
  }, [recentLogs, logSearchTerm]);

  const exportCSV = () => {
    const headers = ['Time', 'Client', 'Domain', 'Type', 'Status', 'DPI Protocol Match'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map((log: any) => 
        [log.time, log.client, log.domain, log.type, log.status, log.protocolMatch || 'DNS'].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traffic_logs_${new Date().getTime()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex justify-between items-end mb-4">
         <div>
           <h2 className="m-0 text-[14px] uppercase tracking-[0.05em] font-semibold text-theme-text-p flex items-center gap-2">
             <Activity size={16} className="text-theme-accent"/> {t('real_time_logs')}
           </h2>
           <p className="text-[11px] text-theme-text-s mt-1 mb-0">{t('live_monitoring')} with deep traffic analysis.</p>
         </div>
         <div className="flex items-center gap-3">
           <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-theme-surface border border-theme-border text-white text-[11px] rounded-[2px] px-3 py-1.5 focus:outline-none focus:border-theme-accent cursor-pointer font-bold uppercase tracking-wider"
           >
              <option value="1h">Last 1 Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
           </select>
           <button onClick={() => setShowDebuggerModal(true)} className="bg-theme-accent text-black border-none hover:opacity-90 px-[12px] py-[6px] rounded-[2px] text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-2 uppercase tracking-wider">
             <Bug size={14} /> {t('query_debugger')}
           </button>
           <button onClick={exportCSV} className="bg-theme-surface text-theme-text-p border border-theme-border hover:text-white px-[12px] py-[6px] rounded-[2px] text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-2 uppercase tracking-wider shadow-sm">
             <Download size={14} /> {t('export_csv')}
           </button>
         </div>
      </div>

      {/* Analytics Charts Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 bg-theme-surface border border-theme-border rounded-[4px] p-5 shadow-sm">
             <div className="text-[11px] uppercase tracking-wider text-[#565f89] font-bold mb-4 flex items-center gap-2">
                <Clock size={14} /> Global Query Volume Overview
             </div>
             <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7aa2f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#7aa2f7" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f7768e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f7768e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2e3d" vertical={false} />
                    <XAxis dataKey="time" stroke="#565f89" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#565f89" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => value > 1000 ? `${(value/1000).toFixed(1)}k` : value} />
                    <RechartsTooltip 
                       contentStyle={{ backgroundColor: '#1a1b26', border: '1px solid #292e42', borderRadius: '4px', fontSize: '11px', color: '#c0caf5' }}
                       itemStyle={{ color: '#c0caf5', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="total" name="Total Queries" stroke="#7aa2f7" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                    <Area type="monotone" dataKey="bllokuar" name="Blocked Queries" stroke="#f7768e" strokeWidth={2} fillOpacity={1} fill="url(#colorBlocked)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
          
          <div className="bg-theme-surface border border-theme-border rounded-[4px] p-5 shadow-sm flex flex-col">
             <div className="text-[11px] uppercase tracking-wider text-[#565f89] font-bold mb-4 flex items-center gap-2">
                <Database size={14} /> Query Protocols
             </div>
             {queryTypes.length > 0 ? (
               <div className="flex-1 flex flex-col justify-center">
                 <div className="h-[140px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={queryTypes}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={65}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {queryTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                           contentStyle={{ backgroundColor: '#1a1b26', border: '1px solid #292e42', borderRadius: '4px', fontSize: '11px', color: '#c0caf5' }}
                           itemStyle={{ color: '#c0caf5', fontWeight: 'bold' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="mt-2 grid grid-cols-2 gap-2">
                    {queryTypes.map((t, i) => (
                       <div key={i} className="flex items-center gap-1.5 text-[10px] text-theme-text-s">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }}></div>
                          {t.name}
                       </div>
                    ))}
                 </div>
               </div>
             ) : (
               <div className="flex-1 flex items-center justify-center text-[10px] text-theme-text-s uppercase tracking-wider font-bold">No Data Available</div>
             )}
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-theme-surface border border-theme-border rounded-[4px] p-4 shadow-sm flex flex-col">
             <div className="text-[10px] uppercase tracking-wider text-[#565f89] font-bold mb-3 border-b border-theme-border pb-2">Top Permitted Domains</div>
             <div className="flex-1 min-h-[150px]">
               {topDomains.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={topDomains} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                     <XAxis type="number" hide />
                     <YAxis dataKey="domain" type="category" width={100} stroke="#565f89" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => val.length > 15 ? val.substring(0,15)+'...' : val} />
                     <RechartsTooltip 
                       cursor={{ fill: '#1e1e2e' }}
                       contentStyle={{ backgroundColor: '#1a1b26', border: '1px solid #292e42', borderRadius: '4px', fontSize: '11px', color: '#c0caf5' }}
                       itemStyle={{ color: '#9ece6a', fontWeight: 'bold' }}
                     />
                     <Bar dataKey="count" fill="#9ece6a" radius={[0, 4, 4, 0]} maxBarSize={20} />
                   </BarChart>
                 </ResponsiveContainer>
               ) : <div className="text-[10px] text-theme-text-s text-center py-4">No data</div>}
             </div>
          </div>
          <div className="bg-theme-surface border border-theme-border rounded-[4px] p-4 shadow-sm flex flex-col">
             <div className="text-[10px] uppercase tracking-wider text-[#565f89] font-bold mb-3 border-b border-theme-border pb-2">Top Blocked Threats</div>
             <div className="flex-1 min-h-[150px]">
               {topBlocked.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={topBlocked} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                     <XAxis type="number" hide />
                     <YAxis dataKey="domain" type="category" width={100} stroke="#565f89" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => val.length > 15 ? val.substring(0,15)+'...' : val} />
                     <RechartsTooltip 
                       cursor={{ fill: '#1e1e2e' }}
                       contentStyle={{ backgroundColor: '#1a1b26', border: '1px solid #292e42', borderRadius: '4px', fontSize: '11px', color: '#c0caf5' }}
                       itemStyle={{ color: '#f7768e', fontWeight: 'bold' }}
                     />
                     <Bar dataKey="count" fill="#f7768e" radius={[0, 4, 4, 0]} maxBarSize={20} />
                   </BarChart>
                 </ResponsiveContainer>
               ) : <div className="text-[10px] text-theme-text-s text-center py-4">No data</div>}
             </div>
          </div>
          <div className="bg-theme-surface border border-theme-border rounded-[4px] p-4 shadow-sm flex flex-col">
             <div className="text-[10px] uppercase tracking-wider text-[#565f89] font-bold mb-3 border-b border-theme-border pb-2">Top Requesting Clients</div>
             <div className="flex-1 min-h-[150px]">
               {topClients.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={topClients} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                     <XAxis type="number" hide />
                     <YAxis dataKey="client" type="category" width={80} stroke="#565f89" fontSize={10} tickLine={false} axisLine={false} />
                     <RechartsTooltip 
                       cursor={{ fill: '#1e1e2e' }}
                       contentStyle={{ backgroundColor: '#1a1b26', border: '1px solid #292e42', borderRadius: '4px', fontSize: '11px', color: '#c0caf5' }}
                       itemStyle={{ color: '#7aa2f7', fontWeight: 'bold' }}
                     />
                     <Bar dataKey="count" fill="#7aa2f7" radius={[0, 4, 4, 0]} maxBarSize={20} />
                   </BarChart>
                 </ResponsiveContainer>
               ) : <div className="text-[10px] text-theme-text-s text-center py-4">No data</div>}
             </div>
          </div>
      </div>

      {/* Query Search / Filter Header */}
      <div className="bg-theme-surface border border-theme-border rounded-[4px] p-3 flex justify-between items-center shadow-sm">
         <div className="flex items-center gap-3">
           <Filter size={14} className="text-theme-text-s" />
           <span className="text-[11px] uppercase tracking-wider font-bold text-theme-text-p">Packet Inspector & Real-time Logs</span>
         </div>
         <div className="relative w-full max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-text-s" />
            <input 
              type="text" 
              value={logSearchTerm}
              onChange={(e) => setLogSearchTerm(e.target.value)}
              className="w-full bg-[#050607] border border-theme-border text-white text-[11px] rounded-[2px] pl-9 pr-3 py-2 focus:outline-none focus:border-theme-accent transition-colors font-mono shadow-inner" 
              placeholder="Search domains, addresses, payloads..." 
            />
         </div>
      </div>

      {/* Detailed Logs & DPI Inspector */}
      <div className="flex gap-4">
        {/* Left: Log Stream */}
        <div className="bg-[#050607] border border-theme-border rounded-[4px] font-mono text-[11px] p-3 h-[600px] overflow-y-auto w-full lg:flex-1 shadow-inner custom-scrollbar relative">
          {!filteredLogs.length ? (
             <div className="absolute inset-0 flex items-center justify-center text-theme-text-s text-[11px] font-bold uppercase tracking-wider">No traffic logged matching filters</div>
          ) : filteredLogs.map((log: any) => (
            <div key={log.id} onClick={() => setViewDpiLog(log)} 
                 className={`flex gap-3 mb-1.5 border border-white/5 p-2 rounded-sm cursor-pointer transition-all ${
                     viewDpiLog?.id === log.id 
                     ? 'bg-theme-accent/10 border-theme-accent/30 shadow-[inset_2px_0_0_rgba(var(--theme-accent-rgb),1)]' 
                     : 'hover:bg-theme-surface hover:border-theme-border bg-black/20'
                 }`}>
              <span className="text-[#565f89] shrink-0 font-bold tracking-widest">{log.time}</span>
              <span className="text-theme-accent shrink-0 w-[120px] truncate" title={log.client}>{log.client.split(' ')[0]}</span>
              <span className="text-[#565f89] shrink-0">→</span>
              <div className="flex-1 min-w-0">
                 <div className="text-white truncate" title={log.domain}>{log.domain}</div>
                 <div className="text-[9px] text-[#565f89] uppercase tracking-widest mt-0.5">{log.type} // {log.protocolMatch || 'DNS'}</div>
              </div>
              <div className="shrink-0 flex items-center justify-end w-[100px]">
                <span className={`px-2 py-0.5 rounded-[2px] border font-bold uppercase tracking-wider text-[9px] ${
                   log.status === 'Lejuar' || log.status === 'Resolved'
                   ? 'text-theme-success bg-theme-success/10 border-theme-success/20' 
                   : 'text-theme-danger bg-theme-danger/10 border-theme-danger/20'
                }`}>
                  {log.status === 'Lejuar' ? 'Allowed' : log.status === 'Resolved' ? 'Allowed' : 'Blocked'}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Right: Detailed DPI Inspector Panel */}
        {dpiEnabled && viewDpiLog && (
          <div className="hidden lg:block w-[400px] bg-theme-bg border border-theme-border rounded-[4px] font-mono p-5 h-[600px] overflow-hidden flex flex-col shadow-xl relative">
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-theme-accent/5 to-transparent pointer-events-none"></div>
            
            <div className="text-[11px] text-theme-accent uppercase font-bold tracking-widest mb-4 pb-3 border-b border-theme-border flex justify-between items-center">
              <span className="flex items-center gap-2"><LayoutList size={14} /> Packet Inspector</span>
              <span className="text-[#565f89]">{viewDpiLog.id.substring(0, 8)}</span>
            </div>

            <div className="space-y-5 overflow-y-auto flex-1 pr-2 custom-scrollbar">
               
               <div className="bg-theme-surface p-3 rounded-sm border border-theme-border/50">
                 <div className="text-[9px] text-[#565f89] uppercase tracking-wider mb-2">Target Payload / Scope</div>
                 <div className="text-[12px] text-white break-all font-bold tracking-wide">{viewDpiLog.domain}</div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                 <div className="bg-theme-surface p-3 rounded-sm border border-theme-border/50">
                   <div className="text-[9px] text-[#565f89] uppercase tracking-wider mb-1.5">Source IP</div>
                   <div className="text-[11px] text-theme-text-p">{viewDpiLog.client}</div>
                 </div>
                 <div className="bg-theme-surface p-3 rounded-sm border border-theme-border/50">
                   <div className="text-[9px] text-[#565f89] uppercase tracking-wider mb-1.5">Record Type</div>
                   <div className="text-[11px] text-theme-text-p">{viewDpiLog.type}</div>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                 <div className="bg-theme-surface p-3 rounded-sm border border-theme-border/50 relative overflow-hidden">
                   <div className="absolute bottom-0 left-0 w-full h-[2px] bg-theme-accent/50"></div>
                   <div className="text-[9px] text-[#565f89] uppercase tracking-wider mb-1.5">DPI Protocol</div>
                   <div className="text-[11px] text-white font-bold">{viewDpiLog.protocolMatch || 'DNS / UNKNOWN'}</div>
                 </div>
                 <div className="bg-theme-surface p-3 rounded-sm border border-theme-border/50 relative overflow-hidden">
                   <div className={`absolute bottom-0 left-0 w-full h-[2px] ${(viewDpiLog.status === 'Lejuar' || viewDpiLog.status === 'Resolved') ? 'bg-theme-success/50' : 'bg-theme-danger/50'}`}></div>
                   <div className="text-[9px] text-[#565f89] uppercase tracking-wider mb-1.5">Final Verdict</div>
                   <div className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${(viewDpiLog.status === 'Lejuar' || viewDpiLog.status === 'Resolved') ? 'text-theme-success' : 'text-theme-danger'}`}>
                      {(viewDpiLog.status === 'Lejuar' || viewDpiLog.status === 'Resolved') ? <CheckCircle size={12}/> : <ShieldAlert size={12}/>} 
                      {(viewDpiLog.status === 'Lejuar' || viewDpiLog.status === 'Resolved') ? 'Allowed' : 'Intercepted'}
                   </div>
                 </div>
               </div>

               <div>
                 <div className="text-[9px] text-[#565f89] uppercase tracking-wider mb-2 flex justify-between items-center">
                    <span>Signature Match Confidence</span>
                    <span className="text-white font-bold">{viewDpiLog.confidence || 100}%</span>
                 </div>
                 <div className="h-2 bg-[#050607] border border-theme-border w-full rounded-full overflow-hidden">
                    <div className="h-full bg-theme-accent transition-all duration-1000" style={{ width: `${viewDpiLog.confidence || 100}%` }}></div>
                 </div>
               </div>

               <div className="pt-2">
                 <div className="text-[9px] text-[#565f89] uppercase tracking-wider mb-2">Raw Packet Base64 / Hex Dump</div>
                 <div className="text-[10px] text-theme-text-s bg-[#050607] p-3 rounded-sm border border-theme-border/50 font-mono tracking-widest leading-relaxed whitespace-pre-wrap shadow-inner overflow-x-auto max-h-[150px]">
                   {viewDpiLog.hexDump || '0000: 45 00 00 3c 1c 46 40 00 40 06 b1 e6 c0 a8 01 02...\n0010: 00 00 00 01 00 00 00 00 00 00 06 67 6f 6f 67 6c...\n0020: 65 03 63 6f 6d 00 00 01 00 01'}
                 </div>
               </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-theme-border/50 text-[9px] text-[#565f89] text-center uppercase tracking-widest">
               Deep Packet Inspection L7 Analysis Engine
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
