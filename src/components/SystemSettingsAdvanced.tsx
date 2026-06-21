// Copyright Alen Pepa
import React, { useState } from 'react';
import { Settings, Shield, RefreshCw, HardDrive, Download, Trash, CloudLightning, Server, Activity, Plus, Edit3, X, CheckSquare, Settings2, Globe, Database, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SystemSettingsAdvanced = ({ t, providers, setProviders, dnsPort, localIp, autoRefresh, setAutoRefresh }: any) => {
  const [activeTab, setActiveTab] = useState('dns_providers');
  
  // Advanced State
  const [loadBalancing, setLoadBalancing] = useState('fastest_response');
  const [dnssecEnabled, setDnssecEnabled] = useState(true);
  const [ednsEnabled, setEdnsEnabled] = useState(true);
  const [cacheStrategy, setCacheStrategy] = useState('stale_while_revalidate');
  const [cacheMemory, setCacheMemory] = useState(256);
  const [minTtl, setMinTtl] = useState(60);
  const [maxTtl, setMaxTtl] = useState(86400);
  const [workerCount, setWorkerCount] = useState(4);
  const [prometheusEnabled, setPrometheusEnabled] = useState(true);
  const [rateLimit, setRateLimit] = useState(100);

  const [showProviderModal, setShowProviderModal] = useState(false);
  const [editProviderContext, setEditProviderContext] = useState<any>(null);

  const handleSaveProvider = () => {
     if (editProviderContext.id) {
        setProviders(providers.map((p: any) => p.id === editProviderContext.id ? editProviderContext : p));
     } else {
        setProviders([...providers, { ...editProviderContext, id: Date.now().toString() }]);
     }
     setShowProviderModal(false);
  };

  const initProviderModel = (p: any = null) => {
     if (p) {
        setEditProviderContext({ ...p });
     } else {
        setEditProviderContext({ name: '', ips: '', protocol: 'DoH', endpoint: '', active: true, latency: '-', strictBind: false });
     }
     setShowProviderModal(true);
  };

  return (
    <div className="space-y-4">
      <div className="bg-theme-surface border border-theme-border rounded-[4px] p-5 shadow-sm relative overflow-hidden flex justify-between items-center mb-6">
         <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-theme-accent/5 to-transparent pointer-events-none"></div>
         <div>
           <h2 className="m-0 text-[14px] uppercase tracking-[0.05em] font-bold text-white flex items-center gap-2">
             <Settings2 size={16} className="text-theme-accent"/> Deep System Configuration
           </h2>
           <p className="text-[11px] text-theme-text-s mt-1 mb-0 max-w-2xl font-mono">
             Root-level system parameters, cluster synchronization, caching mechanics, and global resolver routing.
           </p>
         </div>
         <div className="hidden md:flex gap-4 items-center">
            <div className="flex flex-col items-end">
               <span className="text-[9px] uppercase tracking-widest text-[#565f89] font-bold">Config Version</span>
               <span className="text-[12px] font-mono text-white">v3.1.4-rt</span>
            </div>
            <div className="h-8 w-[1px] bg-theme-border"></div>
            <button className="bg-theme-accent text-black border-none px-[16px] py-[8px] rounded-[2px] text-[11px] font-bold cursor-pointer transition-colors hover:opacity-90 flex items-center gap-2 shadow-[0_0_15px_rgba(var(--theme-accent-rgb),0.5)]">
               <Download size={14} /> Commit Changes
            </button>
         </div>
      </div>

      <div className="flex border-b border-theme-border/50 gap-8 mb-6 overflow-x-auto custom-scrollbar">
        <button onClick={() => setActiveTab('dns_providers')} className={`pb-3 text-[11px] font-bold uppercase tracking-[0.05em] border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === 'dns_providers' ? 'border-theme-accent text-theme-accent' : 'border-transparent text-theme-text-s hover:text-white'} bg-transparent cursor-pointer transition-colors`}><Globe size={14}/> Forwarding Resolvers</button>
        <button onClick={() => setActiveTab('cache_sys')} className={`pb-3 text-[11px] font-bold uppercase tracking-[0.05em] border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === 'cache_sys' ? 'border-theme-accent text-theme-accent' : 'border-transparent text-theme-text-s hover:text-white'} bg-transparent cursor-pointer transition-colors`}><HardDrive size={14}/> L2 Caching Engine</button>
        <button onClick={() => setActiveTab('system_core')} className={`pb-3 text-[11px] font-bold uppercase tracking-[0.05em] border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === 'system_core' ? 'border-theme-accent text-theme-accent' : 'border-transparent text-theme-text-s hover:text-white'} bg-transparent cursor-pointer transition-colors`}><Server size={14}/> Node Processing Core</button>
        <button onClick={() => setActiveTab('networking')} className={`pb-3 text-[11px] font-bold uppercase tracking-[0.05em] border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === 'networking' ? 'border-theme-accent text-theme-accent' : 'border-transparent text-theme-text-s hover:text-white'} bg-transparent cursor-pointer transition-colors`}><Network size={14}/> Network Interoperability</button>
      </div>

      <AnimatePresence mode="wait">
      {activeTab === 'dns_providers' && (
        <motion.div key="dns_providers" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-theme-surface border border-theme-border p-5 rounded-[4px] shadow-sm md:col-span-2">
                 <div className="text-[12px] text-theme-text-p font-bold uppercase tracking-widest mb-4 flex justify-between items-center">
                    <span>Global Load Balancing</span>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div onClick={() => setLoadBalancing('fastest_response')} className={`cursor-pointer border p-4 rounded-[4px] transition-colors ${loadBalancing === 'fastest_response' ? 'border-theme-accent bg-theme-accent/5' : 'border-theme-border bg-theme-bg hover:border-white/20'}`}>
                         <h4 className={`m-0 text-[11px] uppercase tracking-wider font-bold mb-1 ${loadBalancing === 'fastest_response' ? 'text-theme-accent' : 'text-white'}`}>Fastest Response</h4>
                         <p className="text-[10px] text-theme-text-s m-0">Queries all available and returns the first response.</p>
                     </div>
                     <div onClick={() => setLoadBalancing('round_robin')} className={`cursor-pointer border p-4 rounded-[4px] transition-colors ${loadBalancing === 'round_robin' ? 'border-theme-accent bg-theme-accent/5' : 'border-theme-border bg-theme-bg hover:border-white/20'}`}>
                         <h4 className={`m-0 text-[11px] uppercase tracking-wider font-bold mb-1 ${loadBalancing === 'round_robin' ? 'text-theme-accent' : 'text-white'}`}>Round Robin</h4>
                         <p className="text-[10px] text-theme-text-s m-0">Distributes requests sequentially across active nodes.</p>
                     </div>
                     <div onClick={() => setLoadBalancing('strict_order')} className={`cursor-pointer border p-4 rounded-[4px] transition-colors ${loadBalancing === 'strict_order' ? 'border-theme-accent bg-theme-accent/5' : 'border-theme-border bg-theme-bg hover:border-white/20'}`}>
                         <h4 className={`m-0 text-[11px] uppercase tracking-wider font-bold mb-1 ${loadBalancing === 'strict_order' ? 'text-theme-accent' : 'text-white'}`}>Strict Order (Failover)</h4>
                         <p className="text-[10px] text-theme-text-s m-0">Prefers primary resolver, falls back sequentially.</p>
                     </div>
                 </div>
             </div>

             <div className="bg-theme-surface border border-theme-border p-5 rounded-[4px] shadow-sm flex flex-col justify-center gap-4">
                <div className="flex items-center justify-between">
                   <div>
                     <div className="text-[11px] font-bold text-white uppercase tracking-wider">DNSSEC Validation</div>
                     <div className="text-[10px] text-theme-text-s">Strict protocol cryptographical checks</div>
                   </div>
                   <div className={`w-8 h-4 rounded-full flex items-center p-0.5 cursor-pointer ${dnssecEnabled ? 'bg-theme-success border border-theme-success/50' : 'bg-theme-border'}`} onClick={() => setDnssecEnabled(!dnssecEnabled)}>
                      <div className={`w-3 h-3 rounded-full bg-black transition-transform ${dnssecEnabled ? 'translate-x-4' : 'bg-theme-text-s'}`}></div>
                   </div>
                </div>
                <div className="flex items-center justify-between">
                   <div>
                     <div className="text-[11px] font-bold text-white uppercase tracking-wider">EDNS(0) Client Subnet</div>
                     <div className="text-[10px] text-theme-text-s">Share client prefix for CDN locality</div>
                   </div>
                   <div className={`w-8 h-4 rounded-full flex items-center p-0.5 cursor-pointer ${ednsEnabled ? 'bg-theme-success border border-theme-success/50' : 'bg-theme-border'}`} onClick={() => setEdnsEnabled(!ednsEnabled)}>
                      <div className={`w-3 h-3 rounded-full bg-black transition-transform ${ednsEnabled ? 'translate-x-4' : 'bg-theme-text-s'}`}></div>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-theme-surface border border-theme-border rounded-[4px] p-5 shadow-sm">
             <div className="flex justify-between items-center mb-5 border-b border-theme-border/50 pb-4">
                <div className="text-[12px] text-theme-text-p uppercase font-bold tracking-widest flex items-center gap-2">
                   <Shield size={14} className="text-theme-accent" /> Upstream Target Resolvers
                </div>
                <button onClick={() => initProviderModel()} className="bg-theme-bg border border-theme-border hover:border-theme-accent px-[12px] py-[6px] rounded-[2px] text-[10px] font-bold text-white cursor-pointer flex items-center gap-2 transition-colors uppercase tracking-wider">
                  <Plus size={12}/> Deploy Upstream
                </button>
             </div>

             <div className="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-4">
               {providers.map((p: any) => (
                 <div key={p.id} className="bg-theme-bg border border-theme-border p-4 rounded-[4px] relative overflow-hidden group hover:border-theme-border/80 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                         <h3 className="text-[13px] font-bold text-white m-0 flex items-center gap-2 tracking-wide">
                            {p.name}
                            {p.active && <span className="bg-theme-success/10 text-theme-success border border-theme-success/20 px-1.5 py-0.5 rounded-[2px] text-[9px] font-bold uppercase tracking-wider flex items-center gap-1"><CheckSquare size={10}/> RUNNING</span>}
                         </h3>
                         <div className="text-[11px] text-[#565f89] mt-1.5 font-mono bg-black/40 px-2 py-0.5 w-fit rounded-sm">{p.ips}</div>
                       </div>
                       <div onClick={() => {
                           setProviders(providers.map((pr: any) => pr.id === p.id ? {...pr, active: !pr.active} : pr))
                       }} className={`w-8 h-4 rounded-full flex items-center p-0.5 cursor-pointer z-10 ${p.active ? 'bg-theme-accent border border-theme-accent/50 shadow-[0_0_8px_rgba(var(--theme-accent-rgb),0.3)]' : 'bg-theme-surface border border-theme-border'}`}>
                         <div className={`w-3 h-3 rounded-full transition-transform ${p.active ? 'bg-black translate-x-4' : 'bg-theme-text-s'}`}></div>
                       </div>
                    </div>
                    <div className="space-y-3 relative z-10 mb-5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[#565f89] uppercase tracking-wider font-bold text-[9px]">Transport</span>
                        <span className="text-white font-mono bg-theme-surface border border-theme-border px-1.5 py-0.5 rounded-sm">{p.protocol}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[#565f89] uppercase tracking-wider font-bold text-[9px]">Endpoint URI</span>
                        <span className="text-white font-mono max-w-[150px] truncate text-right" title={p.endpoint}>{p.endpoint !== '' ? p.endpoint : '-'}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-[#565f89] uppercase tracking-wider font-bold text-[9px]">P99 Latency</span>
                        <span className={`font-mono font-bold ${p.active ? 'text-theme-success' : 'text-theme-text-s'}`}>{p.latency}</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-theme-border flex justify-end gap-3 relative z-10">
                      <button onClick={() => initProviderModel(p)} className="bg-transparent border-none text-theme-text-s hover:text-white text-[11px] cursor-pointer transition-colors"><Edit3 size={14}/></button>
                      <button onClick={() => setProviders(providers.filter((pr: any) => pr.id !== p.id))} className="bg-transparent border-none text-theme-danger/70 hover:text-theme-danger text-[11px] cursor-pointer transition-colors"><Trash size={14}/></button>
                    </div>
                    {p.active && <div className="absolute top-0 right-0 w-48 h-48 bg-theme-accent/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50" />}
                 </div>
               ))}
             </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'cache_sys' && (
        <motion.div key="cache_sys" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }} className="space-y-6">
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-theme-surface border border-theme-border rounded-[4px] p-5 shadow-sm md:col-span-2">
                 <div className="text-[12px] text-theme-text-p uppercase font-bold tracking-widest mb-5 pb-4 border-b border-theme-border/50 flex items-center gap-2">
                    <Database size={14} className="text-theme-accent" /> Cache Invalidaton Methodology
                 </div>
                 
                 <div className="space-y-4">
                     <div 
                         className={`border p-4 rounded-[4px] cursor-pointer flex justify-between items-center transition-colors ${cacheStrategy === 'stale_while_revalidate' ? 'border-theme-accent bg-theme-accent/5' : 'border-theme-border bg-theme-bg'}`}
                         onClick={() => setCacheStrategy('stale_while_revalidate')}
                     >
                         <div>
                            <h4 className="m-0 text-[12px] text-white font-bold mb-1">Stale While Revalidate (Optimistic)</h4>
                            <p className="m-0 text-[10px] text-theme-text-s">Serves stale cache instantly while fetching fresh data asynchronously.</p>
                         </div>
                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${cacheStrategy === 'stale_while_revalidate' ? 'bg-theme-accent border-theme-accent' : 'border-theme-text-s'}`}>
                             {cacheStrategy === 'stale_while_revalidate' && <div className="w-1.5 h-1.5 bg-black rounded-full"></div>}
                         </div>
                     </div>
                     <div 
                         className={`border p-4 rounded-[4px] cursor-pointer flex justify-between items-center transition-colors ${cacheStrategy === 'strict_ttl' ? 'border-theme-accent bg-theme-accent/5' : 'border-theme-border bg-theme-bg'}`}
                         onClick={() => setCacheStrategy('strict_ttl')}
                     >
                         <div>
                            <h4 className="m-0 text-[12px] text-white font-bold mb-1">Strict TTL Enforced</h4>
                            <p className="m-0 text-[10px] text-theme-text-s">Drop records immediately when TTL expires. Slower, but highest accuracy.</p>
                         </div>
                         <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${cacheStrategy === 'strict_ttl' ? 'bg-theme-accent border-theme-accent' : 'border-theme-text-s'}`}>
                             {cacheStrategy === 'strict_ttl' && <div className="w-1.5 h-1.5 bg-black rounded-full"></div>}
                         </div>
                     </div>
                 </div>
              </div>

              <div className="bg-theme-surface border border-theme-border rounded-[4px] p-5 shadow-sm space-y-4 flex flex-col justify-between">
                 <div>
                     <label className="text-[10px] font-bold uppercase tracking-wider text-[#565f89] block mb-2">Memory Allocation (MB)</label>
                     <input type="number" value={cacheMemory} onChange={(e) => setCacheMemory(parseInt(e.target.value))} className="w-full bg-[#050607] border border-theme-border rounded-[2px] px-3 py-2.5 text-[14px] text-white font-mono outline-none focus:border-theme-accent shadow-inner transition-colors" />
                     <div className="text-[9px] text-theme-text-s mt-2">Max limit for DRAM footprint. LRU evicted when full.</div>
                 </div>

                 <button className="w-full bg-theme-bg hover:bg-theme-danger/20 border border-theme-danger/50 text-theme-danger px-4 py-2.5 rounded-[2px] text-[11px] font-bold cursor-pointer transition-colors flex justify-center items-center gap-2">
                   <Trash size={14}/> Trigger Cache Flush
                 </button>
              </div>
           </div>

           <div className="bg-theme-surface border border-theme-border rounded-[4px] p-5 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                     <label className="text-[10px] font-bold uppercase tracking-wider text-[#565f89] block mb-2">Target Minimum TTL (Sec)</label>
                     <input type="number" value={minTtl} onChange={(e) => setMinTtl(parseInt(e.target.value))} className="w-full bg-[#050607] border border-theme-border rounded-[2px] px-3 py-2.5 text-[12px] text-white font-mono outline-none focus:border-theme-accent shadow-inner transition-colors" />
                     <div className="text-[9px] text-theme-text-s mt-2">Forces short TTL records to live longer in cache. High risk for dynamic CDNs.</div>
                  </div>
                  <div>
                     <label className="text-[10px] font-bold uppercase tracking-wider text-[#565f89] block mb-2">Maximum Permitted TTL (Sec)</label>
                     <input type="number" value={maxTtl} onChange={(e) => setMaxTtl(parseInt(e.target.value))} className="w-full bg-[#050607] border border-theme-border rounded-[2px] px-3 py-2.5 text-[12px] text-white font-mono outline-none focus:border-theme-accent shadow-inner transition-colors" />
                     <div className="text-[9px] text-theme-text-s mt-2">Limits long-lived records forcibly to ensure security rotation.</div>
                  </div>
              </div>
           </div>

        </motion.div>
      )}

      {activeTab === 'system_core' && (
        <motion.div key="system_core" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }} className="space-y-6">
           <div className="bg-theme-surface border border-theme-border p-5 rounded-[4px] shadow-sm">
              <h3 className="m-0 mb-6 text-[12px] text-theme-text-p uppercase tracking-widest font-bold border-b border-theme-border pb-4 flex items-center gap-2">
                <CloudLightning size={14} className="text-theme-accent" /> Node Environment execution
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold uppercase tracking-wider text-[#565f89] block">Server Concurrency (Workers)</label>
                   <input type="number" value={workerCount} onChange={(e) => setWorkerCount(parseInt(e.target.value))} className="w-full bg-[#050607] border border-theme-border rounded-[2px] px-3 py-2.5 text-[12px] text-white font-mono outline-none focus:border-theme-accent shadow-inner transition-colors" />
                   <div className="text-[9px] text-theme-text-s">Threads allocated to packet mutation.</div>
                </div>
                <div className="space-y-2 bg-theme-bg p-3 rounded-sm border border-theme-border/50">
                  <span className="block text-[10px] text-[#565f89] mb-1.5 uppercase font-bold tracking-wider">Interface Listen Port</span>
                  <span className="text-[14px] text-white font-mono">{dnsPort}</span>
                </div>
                <div className="space-y-2 bg-theme-bg p-3 rounded-sm border border-theme-border/50">
                  <span className="block text-[10px] text-[#565f89] mb-1.5 uppercase font-bold tracking-wider">Root IP Binding</span>
                  <span className="text-[14px] text-white font-mono">{localIp}</span>
                </div>
              </div>

              <h3 className="m-0 mb-5 text-[12px] text-theme-text-p uppercase tracking-widest font-bold border-b border-theme-border pb-4 flex items-center gap-2">
                <Activity size={14} className="text-theme-accent" /> Telemetry & Security Limits
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                 <div className="bg-theme-bg border border-theme-border rounded-[4px] p-4 flex justify-between items-center">
                    <div>
                        <div className="text-[11px] font-bold text-white uppercase tracking-wider mb-1">Prometheus Exporter (Port 9090)</div>
                        <div className="text-[9px] text-theme-text-s">Expose internal states /metrics for Grafana.</div>
                    </div>
                    <div className={`w-8 h-4 rounded-full flex items-center p-0.5 cursor-pointer ${prometheusEnabled ? 'bg-theme-success border border-theme-success/50' : 'bg-theme-border'}`} onClick={() => setPrometheusEnabled(!prometheusEnabled)}>
                      <div className={`w-3 h-3 rounded-full bg-black transition-transform ${prometheusEnabled ? 'translate-x-4' : 'bg-theme-text-s'}`}></div>
                    </div>
                 </div>
                 
                 <div className="bg-theme-bg border border-theme-border rounded-[4px] p-4">
                     <label className="text-[10px] font-bold uppercase tracking-wider text-[#565f89] flex justify-between mb-2">
                       Global Rate Limiting (Req/sec/IP)
                       <span className="text-white font-mono">{rateLimit}</span>
                     </label>
                     <input type="range" min="10" max="1000" step="10" value={rateLimit} onChange={(e) => setRateLimit(parseInt(e.target.value))} className="w-full accent-theme-accent" />
                 </div>
              </div>

              <div className="pt-6 border-t border-theme-border/50 flex justify-end gap-4">
                 <button className="bg-transparent border border-theme-danger/30 text-theme-danger hover:bg-theme-danger/10 px-[16px] py-[8px] rounded-[2px] text-[11px] font-bold cursor-pointer transition-colors uppercase tracking-wider">
                   Terminate Process
                 </button>
                 <button className="bg-theme-bg border border-theme-accent text-theme-accent hover:bg-theme-accent hover:text-black px-[16px] py-[8px] rounded-[2px] text-[11px] font-bold cursor-pointer transition-all flex items-center gap-2 uppercase tracking-wider">
                   <RefreshCw size={14}/> Reboot Subsystem
                 </button>
              </div>
           </div>
        </motion.div>
      )}

      {activeTab === 'networking' && (
        <motion.div key="networking" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }} className="space-y-6">
           <div className="bg-theme-surface border border-theme-border p-5 rounded-[4px] shadow-sm">
               <div className="text-center py-20 text-theme-text-s">
                  <Network size={32} className="mx-auto text-theme-border mb-4" />
                  <h4 className="m-0 text-[14px] font-bold text-white uppercase tracking-wider mb-2">BGP / OSPF Interoperability Offline</h4>
                  <p className="m-0 text-[11px] max-w-md mx-auto">Dynamic IP routing features require the Premium Enterprise license. Allows linking virtual topologies and custom ASN publishing across global nodes.</p>
               </div>
           </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Editor Modal */}
      {showProviderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-theme-bg border border-theme-border rounded-[4px] p-6 w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setShowProviderModal(false)} className="absolute top-4 right-4 text-theme-text-s hover:text-white bg-transparent border-none cursor-pointer p-1"><X size={16}/></button>
            <h3 className="m-0 text-[14px] uppercase tracking-[0.05em] font-bold text-theme-text-p mb-6 flex items-center gap-2">
               <Globe size={16} className="text-theme-accent"/> {editProviderContext.id ? 'Modify Resolver Node' : 'Initialize Resolver Node'}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-[10px] text-[#565f89] font-bold uppercase tracking-wider mb-1.5">Alias / Reference Name</label>
                   <input type="text" className="w-full bg-theme-surface border border-theme-border text-white text-[12px] px-3 py-2.5 rounded-[2px] font-mono outline-none focus:border-theme-accent shadow-inner" 
                     value={editProviderContext.name} onChange={(e) => setEditProviderContext({...editProviderContext, name: e.target.value})} placeholder="e.g. NextDNS Primary" />
                </div>
                <div>
                   <label className="block text-[10px] text-[#565f89] font-bold uppercase tracking-wider mb-1.5">Raw Interface IPs (v4/v6)</label>
                   <input type="text" className="w-full bg-theme-surface border border-theme-border text-white text-[12px] px-3 py-2.5 rounded-[2px] font-mono outline-none focus:border-theme-accent shadow-inner" 
                     value={editProviderContext.ips} onChange={(e) => setEditProviderContext({...editProviderContext, ips: e.target.value})} placeholder="1.1.1.1, 1.0.0.1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-[10px] text-[#565f89] font-bold uppercase tracking-wider mb-1.5">Transport Protocol</label>
                     <select className="w-full bg-theme-surface border border-theme-border text-white text-[12px] px-3 py-2.5 rounded-[2px] cursor-pointer outline-none focus:border-theme-accent font-bold" 
                       value={editProviderContext.protocol} onChange={(e) => setEditProviderContext({...editProviderContext, protocol: e.target.value})}>
                        <option value="DoH">DNS-over-HTTPS (DoH)</option>
                        <option value="DoT">DNS-over-TLS (DoT)</option>
                        <option value="DNSCrypt">DNSCrypt</option>
                        <option value="UDP/53">Standard UDP/53</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-[10px] text-[#565f89] font-bold uppercase tracking-wider mb-1.5">Endpoint Host URI</label>
                     <input type="text" className="w-full bg-theme-surface border border-theme-border text-white text-[12px] px-3 py-2.5 rounded-[2px] font-mono outline-none focus:border-theme-accent shadow-inner" 
                       value={editProviderContext.endpoint} onChange={(e) => setEditProviderContext({...editProviderContext, endpoint: e.target.value})} placeholder="https://cloudflare-dns.com/dns-query" />
                  </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-theme-border/50">
               <button onClick={() => setShowProviderModal(false)} className="text-[11px] font-bold uppercase tracking-wider text-theme-text-s hover:text-white bg-transparent border-none cursor-pointer px-4">Abort</button>
               <button onClick={handleSaveProvider} className="text-[11px] font-bold uppercase tracking-wider text-black bg-theme-accent hover:opacity-90 px-6 py-2.5 rounded-[2px] border-none cursor-pointer shadow-[0_0_15px_rgba(var(--theme-accent-rgb),0.5)]">
                 Provision Node
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

