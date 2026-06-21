import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, List, Lock, RefreshCw, Plus, Edit3, Trash, Activity, Globe, Monitor, Search, ChevronRight, SearchCode, Database, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdBlockControlProps {
  t: (key: any) => string;
}

export const AdBlockControlAdvanced: React.FC<AdBlockControlProps> = ({ t }) => {
  const [activeTab, setActiveTab] = useState<'lists' | 'parental' | 'manual'>('lists');
  const [settings, setSettings] = useState<any>(null);
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  useEffect(() => {
    fetch('/api/adblock').then(r => r.json()).then(data => {
      setSettings(data);
    }).catch(e => console.error(e));
  }, []);

  const saveSettings = async (newSettings: any) => {
    setSettings({ ...newSettings });
    try {
      await fetch('/api/adblock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
    } catch(e) {}
  };

  const handleToggleList = (id: string, active: boolean) => {
    if(!settings) return;
    const newSettings = {...settings};
    const list = newSettings.lists.find((l:any) => l.id === id);
    if(list) list.active = active;
    saveSettings(newSettings);
  };

  const handleToggleParentalCategory = (id: string, active: boolean) => {
    if(!settings) return;
    const newSettings = {...settings};
    const cat = newSettings.parental.categories.find((c:any) => c.id === id);
    if(cat) cat.active = active;
    saveSettings(newSettings);
  };

  const handleSyncLists = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if(prev >= 100) {
           clearInterval(interval);
           setIsSyncing(false);
           if(settings) {
             const newSettings = {...settings};
             newSettings.lists = newSettings.lists.map((l:any) => ({...l, lastUpdate: 'Just now'}));
             saveSettings(newSettings);
           }
           return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  if(!settings) return <div className="p-8 text-theme-text-s">Loading Advanced AdBlock Engine...</div>;

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-[20px] font-semibold text-white m-0 mb-1 tracking-tight flex items-center gap-2">
            <ShieldAlert className="text-theme-danger" size={20} /> 
            AdBlock & Parental Control
          </h1>
          <p className="text-[12px] text-theme-text-s m-0 max-w-2xl">
            Super-advanced traffic interception engine. Combine automated community lists, aggressive parental filters, and raw regex rules to sanitize your network.
          </p>
        </div>
        
        <div className="flex gap-3">
          {activeTab === 'lists' && (
            <button 
              onClick={handleSyncLists} 
              disabled={isSyncing}
              className="bg-theme-bg border border-theme-border hover:border-theme-accent text-white px-[16px] py-[8px] rounded-[2px] text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-2 uppercase tracking-wider relative overflow-hidden"
            >
              {isSyncing && (
                <div className="absolute inset-0 bg-theme-accent/20" style={{ width: `${Math.floor(syncProgress)}%` }}></div>
              )}
              <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} /> 
              {isSyncing ? `SYNCING (${Math.floor(syncProgress)}%)` : 'SYNC BLOCKLISTS'}
            </button>
          )}
          <button className="bg-theme-accent text-black border-none hover:opacity-90 px-[16px] py-[8px] rounded-[2px] text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-2 uppercase tracking-wider shadow-[0_0_15px_rgba(var(--theme-accent-rgb),0.2)]">
            <Plus size={14}/> {activeTab === 'manual' ? 'Add Rule' : 'Add Custom'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-8 border-b border-theme-border pb-0 text-[12px] uppercase tracking-[0.05em] font-bold">
        <button 
          onClick={() => setActiveTab('lists')}
          className={`pb-[12px] pt-[4px] border-b-[2px] transition-all cursor-pointer bg-transparent px-2 ${activeTab === 'lists' ? 'border-theme-accent text-theme-accent' : 'border-transparent text-theme-text-s hover:text-white'}`}
        >
          <div className="flex items-center gap-2"><List size={14}/> Subscription Lists</div>
        </button>
        <button 
          onClick={() => setActiveTab('parental')}
          className={`pb-[12px] pt-[4px] border-b-[2px] transition-all cursor-pointer bg-transparent px-2 ${activeTab === 'parental' ? 'border-[#F5A623] text-[#F5A623]' : 'border-transparent text-theme-text-s hover:text-white'}`}
        >
          <div className="flex items-center gap-2"><Lock size={14}/> Parental Control</div>
        </button>
        <button 
          onClick={() => setActiveTab('manual')}
          className={`pb-[12px] pt-[4px] border-b-[2px] transition-all cursor-pointer bg-transparent px-2 ${activeTab === 'manual' ? 'border-theme-danger text-theme-danger' : 'border-transparent text-theme-text-s hover:text-white'}`}
        >
          <div className="flex items-center gap-2"><SearchCode size={14}/> Manual / Regex</div>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'lists' && (
          <motion.div key="lists" initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}} timeout={150} className="space-y-4">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
               {settings.lists.map((l:any) => (
                 <div key={l.id} className="bg-theme-surface border border-theme-border rounded-[4px] p-4 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                         <div className="flex items-center gap-2 mb-1">
                           <Database size={14} className={l.active ? "text-theme-accent" : "text-theme-text-s"} />
                           <h3 className="text-white text-[13px] font-bold m-0">{l.name}</h3>
                         </div>
                         <div className="text-[10px] uppercase font-bold tracking-widest text-[#565f89]">{l.category} • {l.count.toLocaleString()} domains</div>
                      </div>
                      <div 
                          className={`w-10 h-5 rounded-full flex items-center p-1 cursor-pointer transition-colors shrink-0 shadow-inner ${
                              l.active ? 'bg-theme-accent border-[1px] border-theme-accent/50 shadow-[0_0_10px_rgba(var(--theme-accent-rgb),0.3)]' : 'bg-theme-bg border border-theme-border'
                          }`}
                          onClick={() => handleToggleList(l.id, !l.active)}
                      >
                          <div className={`w-3.5 h-3.5 rounded-full transition-transform transform ${l.active ? 'bg-black translate-x-4' : 'bg-theme-text-s translate-x-0'}`}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-end border-t border-theme-border/50 pt-3">
                       <span className="text-[10px] text-theme-text-s font-mono max-w-[200px] truncate" title={l.url}>{l.url}</span>
                       <span className="text-[9px] uppercase font-bold tracking-widest text-theme-text-s flex items-center gap-1">
                         <Activity size={10} /> {l.lastUpdate}
                       </span>
                    </div>
                 </div>
               ))}
             </div>
          </motion.div>
        )}

        {activeTab === 'parental' && (
          <motion.div key="parental" initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}} className="space-y-6">
             <div className="bg-[#050607] border border-[#F5A623]/30 rounded-[4px] p-5 relative overflow-hidden flex flex-col md:flex-row gap-6 items-center">
                 <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-[#F5A623]/10 to-transparent pointer-events-none"></div>
                 <div className="flex-1 space-y-2 relative z-10">
                    <h3 className="text-[#F5A623] text-[14px] font-bold uppercase tracking-wider m-0 flex items-center gap-2"><GlobalSearchIcon /> Enforce Safe Search</h3>
                    <p className="text-[11px] text-theme-text-s m-0 max-w-md leading-relaxed">
                       Automatically rewrite search engine queries (Google, Bing, DuckDuckGo) to their "Safe" localized addresses, and force YouTube Restricted Mode across resolving networks.
                    </p>
                 </div>
                 <div className="flex gap-4 relative z-10">
                    <label className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-white cursor-pointer">
                      <input type="checkbox" className="accent-[#F5A623] scale-110" checked={settings.parental.strictSearch} onChange={(e) => saveSettings({...settings, parental: {...settings.parental, strictSearch: e.target.checked}})} />
                      Safe Search Engine
                    </label>
                    <label className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-white cursor-pointer">
                      <input type="checkbox" className="accent-[#F5A623] scale-110" checked={settings.parental.youtubeRestricted} onChange={(e) => saveSettings({...settings, parental: {...settings.parental, youtubeRestricted: e.target.checked}})} />
                      YouTube Restricted
                    </label>
                 </div>
             </div>

             <div className="bg-theme-surface border border-theme-border rounded-[4px] p-5 shadow-sm">
                <h3 className="text-white text-[12px] font-bold uppercase tracking-widest m-0 mb-4 border-b border-theme-border/50 pb-3 flex items-center gap-2">
                   <Lock size={14} className="text-[#F5A623]"/> Category Blockers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                   {settings.parental.categories.map((c:any) => (
                      <div key={c.id} className={`border rounded-[4px] p-4 transition-colors ${c.active ? 'bg-[#F5A623]/5 border-[#F5A623]/50 shadow-[0_0_15px_rgba(245,166,35,0.05)]' : 'bg-theme-bg border-theme-border'}`}>
                         <div className="flex justify-between items-start mb-3">
                           <div className="font-bold text-[13px] text-white flex items-center gap-2">
                              {c.active && <Check size={14} className="text-[#F5A623]"/>}
                              {c.name}
                           </div>
                           <div 
                              className={`w-8 h-4 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${
                                  c.active ? 'bg-[#F5A623]' : 'bg-theme-surface border border-theme-border'
                              }`}
                              onClick={() => handleToggleParentalCategory(c.id, !c.active)}
                           >
                              <div className={`w-3 h-3 rounded-full bg-white transition-transform transform ${c.active ? 'translate-x-4' : 'translate-x-0'}`}></div>
                           </div>
                         </div>
                         <div className="text-[10px] font-bold uppercase tracking-widest text-theme-text-s mb-2 border-b border-theme-border/50 pb-2">
                            {c.count.toLocaleString()} signatures
                         </div>
                         <div className="space-y-1">
                            {c.domains.slice(0,3).map((d:string, i:number) => (
                               <div key={i} className="text-[9px] font-mono text-theme-text-s">- {d}</div>
                            ))}
                            {c.domains.length > 3 && <div className="text-[9px] font-mono text-[#565f89] italic">...and more</div>}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'manual' && (
          <motion.div key="manual" initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-5}} className="space-y-4">
             <div className="bg-theme-surface border border-theme-border rounded-[4px] shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-theme-border bg-theme-bg/50">
                       <th className="py-3 px-4 text-[10px] uppercase font-bold tracking-widest text-[#565f89]">Pattern / Expression</th>
                       <th className="py-3 px-4 text-[10px] uppercase font-bold tracking-widest text-[#565f89] w-[150px]">Match Type</th>
                       <th className="py-3 px-4 text-[10px] uppercase font-bold tracking-widest text-[#565f89] w-[120px]">Action</th>
                       <th className="py-3 px-4 text-[10px] uppercase font-bold tracking-widest text-[#565f89] w-[80px] text-right">Controls</th>
                     </tr>
                  </thead>
                  <tbody>
                     {settings.manual.map((m:any) => (
                       <tr key={m.id} className="border-b border-theme-border/50 hover:bg-theme-bg transition-colors">
                         <td className="py-3 px-4 font-mono text-[12px] text-white break-all">{m.value}</td>
                         <td className="py-3 px-4">
                           <span className="px-2 py-0.5 bg-[#050607] border border-theme-border shadow-inner rounded-sm text-[9px] font-bold uppercase tracking-wider text-theme-text-s">
                             {m.type}
                           </span>
                         </td>
                         <td className="py-3 px-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-theme-danger flex items-center gap-1.5">
                               <ShieldAlert size={12}/> {m.action}
                            </span>
                         </td>
                         <td className="py-3 px-4 text-right flex justify-end gap-2">
                           <button className="bg-transparent border-none text-[#565f89] hover:text-white cursor-pointer transition-colors p-1"><Edit3 size={14}/></button>
                           <button onClick={(e) => {
                             const newManual = settings.manual.filter((x:any) => x.id !== m.id);
                             saveSettings({...settings, manual: newManual});
                           }} className="bg-transparent border-none text-theme-danger/70 hover:text-theme-danger cursor-pointer transition-colors p-1"><Trash size={14}/></button>
                         </td>
                       </tr>
                     ))}
                     {settings.manual.length === 0 && (
                        <tr>
                           <td colSpan={4} className="py-8 text-center text-theme-text-s text-[11px] uppercase tracking-widest font-bold">
                              No manual rules loaded
                           </td>
                        </tr>
                     )}
                  </tbody>
                </table>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GlobalSearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
