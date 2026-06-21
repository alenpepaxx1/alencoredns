import React, { useState } from 'react';
import { Shield, ShieldAlert, CheckCircle, Globe, Plus, Trash2, Edit3, X, Activity, Filter, MapPin, Database, ArrowUpDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SecurityPoliciesAdvanced = ({ t, filteringRules, setFilteringRules, geoBlockingRules, setGeoBlockingRules }: any) => {
  const [activeTab, setActiveTab] = useState('filtering');
  const [dpiEnabled, setDpiEnabled] = useState(true);

  // Search & Sort states
  const [filterSearch, setFilterSearch] = useState('');
  const [geoSearch, setGeoSearch] = useState('');
  
  // Modals
  const [showCreateRuleModal, setShowCreateRuleModal] = useState(false);
  const [newRuleData, setNewRuleData] = useState<any>({ target: '', type: 'Domain Regex', action: 'Block', client: 'All Nodes', status: true });
  const [showAddRegionModal, setShowAddRegionModal] = useState(false);
  const [newRegionData, setNewRegionData] = useState<any>({ region: '', type: 'Country', action: 'Block', mappedIPs: '~0', status: true });
  const [showSyncModal, setShowSyncModal] = useState(false);

  const handleSaveFilterRule = async (rule: any) => {
     let newList = [];
     if (rule.id) {
        newList = filteringRules.map((r: any) => r.id === rule.id ? rule : r);
     } else {
        newList = [...filteringRules, { ...rule, id: Date.now().toString() }];
     }
     try {
       await fetch('/api/filtering-rules', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(newList)
       });
     } catch (e) {}
     setFilteringRules(newList);
     setShowCreateRuleModal(false);
  };

  const handleDeleteFilterRule = async (id: string) => {
     const newList = filteringRules.filter((r: any) => r.id !== id);
     try {
       await fetch('/api/filtering-rules', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(newList)
       });
     } catch (e) {}
     setFilteringRules(newList);
  };
  
  const handleToggleFilterRule = async (id: string) => {
     const newList = filteringRules.map((r: any) => r.id === id ? { ...r, status: !r.status } : r);
     try {
       await fetch('/api/filtering-rules', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(newList)
       });
     } catch (e) {}
     setFilteringRules(newList);
  };

  const handleSaveGeoRule = async (rule: any) => {
     let newList = [];
     if (rule.id) {
        newList = geoBlockingRules.map((r: any) => r.id === rule.id ? rule : r);
     } else {
        newList = [...geoBlockingRules, { ...rule, id: Date.now().toString() }];
     }
     try {
       await fetch('/api/geo-blocking-rules', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(newList)
       });
     } catch (e) {}
     setGeoBlockingRules(newList);
     setShowAddRegionModal(false);
  };

  const handleDeleteGeoRule = async (id: string) => {
     const newList = geoBlockingRules.filter((r: any) => r.id !== id);
     try {
       await fetch('/api/geo-blocking-rules', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(newList)
       });
     } catch (e) {}
     setGeoBlockingRules(newList);
  };
  
  const handleToggleGeoRule = async (id: string) => {
     const newList = geoBlockingRules.map((r: any) => r.id === id ? { ...r, status: !r.status } : r);
     try {
       await fetch('/api/geo-blocking-rules', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(newList)
       });
     } catch (e) {}
     setGeoBlockingRules(newList);
  };
  
  const resetGeoDefaults = async () => {
      const newList = [
          { id: '1', region: 'Russia (RU)', type: 'Country', action: 'Block', mappedIPs: '~45.2M', status: true },
          { id: '2', region: 'China (CN)', type: 'Country', action: 'Block', mappedIPs: '~339.8M', status: true },
          { id: '3', region: 'North Korea (KP)', type: 'Country', action: 'Block', mappedIPs: '~1.0M', status: true },
          { id: '4', region: 'Antarctica (AQ)', type: 'Continent', action: 'Block', mappedIPs: '~10K', status: false },
      ];
      try {
        await fetch('/api/geo-blocking-rules', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newList)
        });
      } catch (e) {}
      setGeoBlockingRules(newList);
  };

  const filteredFilteringRules = filteringRules.filter((r: any) => 
     r.target.toLowerCase().includes(filterSearch.toLowerCase()) || 
     r.type.toLowerCase().includes(filterSearch.toLowerCase()) ||
     r.client.toLowerCase().includes(filterSearch.toLowerCase())
  );
  
  const filteredGeoRules = geoBlockingRules.filter((r: any) => 
     r.region.toLowerCase().includes(geoSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* DPI Status Bar */}
      <div className="bg-theme-surface border border-theme-border rounded-[4px] p-5 flex justify-between items-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-theme-accent/5 to-transparent pointer-events-none"></div>
          <div>
              <div className="text-[13px] font-semibold text-white flex items-center gap-2 tracking-wide">
                  <ShieldAlert size={16} className={dpiEnabled ? "text-theme-accent" : "text-theme-text-s"}/>
                  {t('dpi_title')} (Layer 7 Inspection)
              </div>
              <div className="text-[11px] text-theme-text-s mt-1.5 max-w-xl">{t('dpi_desc')}. Enables deep packet inspection for unencrypted payloads, protocol matching, and accurate application categorization. Heavy CPU usage.</div>
          </div>
          <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${dpiEnabled ? 'text-theme-success' : 'text-theme-text-s'}`}>
                  {dpiEnabled ? 'Active' : 'Disabled'}
              </span>
              <div 
                  className={`w-10 h-5 rounded-full flex items-center p-1 cursor-pointer transition-colors ${
                      dpiEnabled ? 'bg-theme-accent border-[1px] border-theme-accent/50 shadow-[0_0_10px_rgba(var(--theme-accent-rgb),0.3)]' : 'bg-theme-bg border border-theme-border'
                  }`}
                  onClick={() => setDpiEnabled(!dpiEnabled)}
              >
                  <div className={`w-3.5 h-3.5 rounded-full transition-transform transform ${dpiEnabled ? 'bg-black translate-x-4' : 'bg-theme-text-s translate-x-0'}`}></div>
              </div>
          </div>
      </div>

      <div className="flex items-center gap-8 border-b border-theme-border pb-0 mb-5 text-[12px] uppercase tracking-[0.05em] font-bold">
        <button 
          onClick={() => setActiveTab('filtering')}
          className={`pb-[12px] pt-[4px] border-b-[2px] transition-all cursor-pointer bg-transparent px-2 ${activeTab === 'filtering' ? 'border-theme-accent text-theme-accent' : 'border-transparent text-theme-text-s hover:text-white'}`}
        >
          <div className="flex items-center gap-2"><Filter size={14}/> {t('traffic_filtering')}</div>
        </button>
        <button 
          onClick={() => setActiveTab('geo')}
          className={`pb-[12px] pt-[4px] border-b-[2px] transition-all cursor-pointer bg-transparent px-2 ${activeTab === 'geo' ? 'border-theme-accent text-theme-accent' : 'border-transparent text-theme-text-s hover:text-white'}`}
        >
          <div className="flex items-center gap-2"><MapPin size={14}/> {t('geo_blocking')}</div>
        </button>
      </div>

      <AnimatePresence mode="wait">
      {activeTab === 'filtering' ? (
        <motion.div key="filtering" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }} className="space-y-4">
          <div className="flex justify-between items-end mb-2">
             <div className="flex-1 max-w-sm relative">
                <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-text-s" />
                <input type="text" placeholder="Search rules, targets, clients..." value={filterSearch} onChange={(e) => setFilterSearch(e.target.value)}
                   className="w-full bg-theme-surface border border-theme-border rounded-[2px] px-3 py-2 pl-9 text-[12px] text-white box-border outline-none focus:border-theme-accent transition-colors" />
             </div>
             <div className="flex gap-3">
               <button onClick={() => setShowSyncModal(true)} className="bg-theme-surface text-theme-text-s border border-theme-border hover:text-white px-[12px] py-[6px] rounded-[2px] text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-2">
                 <Database size={12} /> {t('sync_blocklists')}
               </button>
               <button onClick={() => { setNewRuleData({ target: '', type: 'Domain Regex', action: 'Block', client: 'All Nodes', status: true }); setShowCreateRuleModal(true); }} className="bg-theme-accent text-black border-none px-[12px] py-[6px] rounded-[2px] text-[11px] font-bold cursor-pointer flex items-center gap-2 hover:opacity-90">
                 <Plus size={12}/> Create Rule
               </button>
             </div>
          </div>

          <table className="w-full border-collapse text-[12px] bg-theme-surface border border-theme-border rounded-[4px] overflow-hidden">
            <thead>
              <tr>
                <th className="text-left py-[12px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal">Target Pattern</th>
                <th className="text-left py-[12px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal">Match Type</th>
                <th className="text-left py-[12px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal">{t('action')}</th>
                <th className="text-left py-[12px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal">Assigned Client</th>
                <th className="text-right py-[12px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal">{t('status')} & Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFilteringRules.length === 0 ? (
                <tr><td colSpan={5} className="py-[30px] text-center text-theme-text-s text-[11px] font-bold uppercase tracking-wider">No filtering rules found</td></tr>
              ) : filteredFilteringRules.map((rule: any) => (
                <tr key={rule.id} className={`group hover:bg-theme-bg/50 transition-colors ${!rule.status ? 'opacity-50 hover:opacity-100' : ''}`}>
                  <td className="py-[12px] px-[16px] border-b border-theme-border/50 font-mono text-theme-text-p font-semibold">{rule.target}</td>
                  <td className="py-[12px] px-[16px] border-b border-theme-border/50 font-mono">
                    <span className={`text-[10px] px-[6px] py-[2px] rounded-[2px] border ${rule.type === 'Community List' ? 'bg-[#e0af68]/10 text-[#e0af68] border-[#e0af68]/30' : 'bg-theme-bg text-theme-text-s border-theme-border'}`}>{rule.type}</span>
                  </td>
                  <td className="py-[12px] px-[16px] border-b border-theme-border/50 font-mono">
                    <span className={`px-[8px] py-[3px] rounded-[2px] text-[10px] font-bold uppercase tracking-wider flex items-center w-fit gap-1.5 ${
                      rule.action === 'Allow' ? 'text-theme-success bg-theme-success/10 border border-theme-success/20' : 'text-theme-danger bg-theme-danger/10 border border-theme-danger/20'
                    }`}>
                      {rule.action === 'Allow' ? <CheckCircle size={10}/> : <ShieldAlert size={10}/>} {rule.action}
                    </span>
                  </td>
                  <td className="py-[12px] px-[16px] border-b border-theme-border/50 font-mono text-[11px]">
                     <span className="bg-[#050607] border border-theme-border px-[6px] py-[3px] rounded-[2px] text-white font-bold">{rule.client}</span>
                  </td>
                  <td className="py-[12px] px-[16px] border-b border-theme-border/50 text-right">
                     <div className="flex justify-end gap-3 items-center">
                       <button onClick={() => { setNewRuleData({ ...rule }); setShowCreateRuleModal(true); }} className="text-theme-text-s hover:text-white transition-opacity opacity-0 group-hover:opacity-100 bg-transparent border-none cursor-pointer"><Edit3 size={14}/></button>
                       <button onClick={() => handleDeleteFilterRule(rule.id)} className="text-theme-danger/70 hover:text-theme-danger transition-opacity opacity-0 group-hover:opacity-100 bg-transparent border-none cursor-pointer"><Trash2 size={14}/></button>
                       <div className="w-[1px] h-4 bg-theme-border mx-1"></div>
                       <div className={`w-8 h-4 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${ rule.status ? 'bg-theme-success border border-theme-success/50' : 'bg-theme-border' }`} onClick={() => handleToggleFilterRule(rule.id)}>
                         <div className={`w-3 h-3 rounded-full bg-black transition-transform ${rule.status ? 'translate-x-4' : 'bg-theme-text-s'}`}></div>
                       </div>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      ) : (
        <motion.div key="geo" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }} className="space-y-4">
          <div className="flex justify-between items-end mb-2">
             <div className="flex-1 max-w-sm relative">
                <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-text-s" />
                <input type="text" placeholder="Search regions..." value={geoSearch} onChange={(e) => setGeoSearch(e.target.value)}
                   className="w-full bg-theme-surface border border-theme-border rounded-[2px] px-3 py-2 pl-9 text-[12px] text-white box-border outline-none focus:border-theme-accent transition-colors" />
             </div>
             <div className="flex gap-3">
               <button onClick={resetGeoDefaults} className="bg-theme-surface text-theme-text-s border border-theme-border hover:text-white px-[12px] py-[6px] rounded-[2px] text-[11px] font-bold cursor-pointer transition-colors">
                 RESET DEFAULTS
               </button>
               <button onClick={() => { setNewRegionData({ region: '', type: 'Country', action: 'Block', mappedIPs: '~0', status: true }); setShowAddRegionModal(true); }} className="bg-theme-accent text-black border-none px-[12px] py-[6px] rounded-[2px] text-[11px] font-bold cursor-pointer flex items-center gap-2 hover:opacity-90">
                 <Plus size={12}/> Add Region
               </button>
             </div>
          </div>

          <table className="w-full border-collapse text-[12px] bg-theme-surface border border-theme-border rounded-[4px] overflow-hidden">
            <thead>
              <tr>
                <th className="text-left py-[12px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal">Region Name / Code</th>
                <th className="text-left py-[12px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal">Data Level</th>
                <th className="text-left py-[12px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal">Mapped IPs</th>
                <th className="text-left py-[12px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal">{t('action')}</th>
                <th className="text-right py-[12px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal">{t('status')} & Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGeoRules.length === 0 ? (
                <tr><td colSpan={5} className="py-[30px] text-center text-theme-text-s text-[11px] font-bold uppercase tracking-wider">No geolocation rules found</td></tr>
              ) : filteredGeoRules.map((rule: any) => (
                <tr key={rule.id} className={`group hover:bg-theme-bg/50 transition-colors ${!rule.status ? 'opacity-50 hover:opacity-100' : ''}`}>
                  <td className="py-[12px] px-[16px] border-b border-theme-border/50 font-mono text-white font-semibold flex items-center gap-2">
                     <Globe size={14} className="text-theme-accent"/> {rule.region}
                  </td>
                  <td className="py-[12px] px-[16px] border-b border-theme-border/50 font-mono text-[10px] uppercase text-theme-text-s tracking-widest">{rule.type}</td>
                  <td className="py-[12px] px-[16px] border-b border-theme-border/50 font-mono text-theme-text-s">{rule.mappedIPs}</td>
                  <td className="py-[12px] px-[16px] border-b border-theme-border/50 font-mono">
                    <span className={`px-[8px] py-[3px] rounded-[2px] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${
                      rule.action === 'Allow' ? 'text-theme-success bg-theme-success/10 border border-theme-success/20' : 'text-theme-danger bg-theme-danger/10 border border-theme-danger/20'
                    }`}>
                      {rule.action === 'Allow' ? <CheckCircle size={10}/> : <ShieldAlert size={10}/>} {rule.action}
                    </span>
                  </td>
                  <td className="py-[12px] px-[16px] border-b border-theme-border/50 text-right">
                     <div className="flex justify-end gap-3 items-center">
                       <button onClick={() => { setNewRegionData({ ...rule }); setShowAddRegionModal(true); }} className="text-theme-text-s hover:text-white transition-opacity opacity-0 group-hover:opacity-100 bg-transparent border-none cursor-pointer"><Edit3 size={14}/></button>
                       <button onClick={() => handleDeleteGeoRule(rule.id)} className="text-theme-danger/70 hover:text-theme-danger transition-opacity opacity-0 group-hover:opacity-100 bg-transparent border-none cursor-pointer"><Trash2 size={14}/></button>
                       <div className="w-[1px] h-4 bg-theme-border mx-1"></div>
                       <div className={`w-8 h-4 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${ rule.status ? 'bg-theme-success border border-theme-success/50' : 'bg-theme-border' }`} onClick={() => handleToggleGeoRule(rule.id)}>
                         <div className={`w-3 h-3 rounded-full bg-black transition-transform ${rule.status ? 'translate-x-4' : 'bg-theme-text-s'}`}></div>
                       </div>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
      </AnimatePresence>
      
      {/* Modals */}
      {showCreateRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-theme-bg border border-theme-border rounded-[4px] p-5 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowCreateRuleModal(false)} className="absolute top-4 right-4 text-theme-text-s hover:text-white bg-transparent border-none cursor-pointer p-1"><X size={16}/></button>
            <h3 className="m-0 text-[14px] uppercase tracking-[0.05em] font-semibold text-theme-text-p mb-5 flex items-center gap-2">
               <Shield size={16} className="text-theme-accent"/> {newRuleData.id ? 'Edit Filter Rule' : 'Create Filter Rule'}
            </h3>
            
            <div className="space-y-4">
              <div>
                 <label className="block text-[10px] text-[#565f89] font-bold uppercase tracking-wider mb-1.5">Target Pattern / Domain</label>
                 <input type="text" className="w-full bg-theme-surface border border-theme-border text-white text-[12px] px-3 py-2.5 rounded-[2px] font-mono focus:outline-none focus:border-theme-accent" 
                   value={newRuleData.target} onChange={(e) => setNewRuleData({...newRuleData, target: e.target.value})} placeholder="e.g. *.ads.com, tracker.net" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-[10px] text-[#565f89] font-bold uppercase tracking-wider mb-1.5">Match Type</label>
                     <select className="w-full bg-theme-surface border border-theme-border text-white text-[12px] px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-theme-accent cursor-pointer" 
                       value={newRuleData.type} onChange={(e) => setNewRuleData({...newRuleData, type: e.target.value})}>
                        <option value="Domain Regex">Domain Regex</option>
                        <option value="Exact Match">Exact Match</option>
                        <option value="Wildcard">Wildcard</option>
                        <option value="Community List">Community List</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-[10px] text-[#565f89] font-bold uppercase tracking-wider mb-1.5">Action</label>
                     <select className="w-full bg-theme-surface border border-theme-border text-white text-[12px] px-3 py-2.5 rounded-[2px] font-bold focus:outline-none focus:border-theme-accent cursor-pointer" 
                       value={newRuleData.action} onChange={(e) => setNewRuleData({...newRuleData, action: e.target.value})}>
                        <option value="Block">Block Connection</option>
                        <option value="Allow">Allow (Whitelist)</option>
                     </select>
                  </div>
              </div>
              <div>
                 <label className="block text-[10px] text-[#565f89] font-bold uppercase tracking-wider mb-1.5">Target Client / Group</label>
                 <select className="w-full bg-theme-surface border border-theme-border text-white text-[12px] px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-theme-accent cursor-pointer" 
                   value={newRuleData.client} onChange={(e) => setNewRuleData({...newRuleData, client: e.target.value})}>
                    <option value="All Nodes">All Nodes (Global)</option>
                    <option value="Guest Network">Guest Network</option>
                    <option value="IoT Devices">IoT Devices</option>
                 </select>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-theme-border/50">
               <button onClick={() => setShowCreateRuleModal(false)} className="text-[11px] font-bold uppercase tracking-wider text-theme-text-s hover:text-white bg-transparent border-none cursor-pointer px-4">Cancel</button>
               <button onClick={() => handleSaveFilterRule(newRuleData)} className="text-[11px] font-bold uppercase tracking-wider text-black bg-theme-accent hover:opacity-90 px-6 py-2.5 rounded-[2px] border-none cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                 Save Rule
               </button>
            </div>
          </div>
        </div>
      )}

      {showAddRegionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-theme-bg border border-theme-border rounded-[4px] p-5 w-full max-w-sm shadow-2xl relative">
            <button onClick={() => setShowAddRegionModal(false)} className="absolute top-4 right-4 text-theme-text-s hover:text-white bg-transparent border-none cursor-pointer p-1"><X size={16}/></button>
            <h3 className="m-0 text-[14px] uppercase tracking-[0.05em] font-semibold text-theme-text-p mb-5 flex items-center gap-2">
               <MapPin size={16} className="text-theme-accent"/> {newRegionData.id ? 'Edit Region' : 'Add Region'}
            </h3>
            
            <div className="space-y-4">
              <div>
                 <label className="block text-[10px] text-[#565f89] font-bold uppercase tracking-wider mb-1.5">Region Name (e.g. Russia, CN)</label>
                 <input type="text" className="w-full bg-theme-surface border border-theme-border text-white text-[12px] px-3 py-2.5 rounded-[2px] font-mono focus:outline-none focus:border-theme-accent" 
                   value={newRegionData.region} onChange={(e) => setNewRegionData({...newRegionData, region: e.target.value})} placeholder="Country or Country Code" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-[10px] text-[#565f89] font-bold uppercase tracking-wider mb-1.5">Level</label>
                     <select className="w-full bg-theme-surface border border-theme-border text-white text-[12px] px-3 py-2.5 rounded-[2px] focus:outline-none focus:border-theme-accent cursor-pointer" 
                       value={newRegionData.type} onChange={(e) => setNewRegionData({...newRegionData, type: e.target.value})}>
                        <option value="Country">Country</option>
                        <option value="Continent">Continent</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-[10px] text-[#565f89] font-bold uppercase tracking-wider mb-1.5">Action</label>
                     <select className="w-full bg-theme-surface border border-theme-border text-white text-[12px] px-3 py-2.5 rounded-[2px] font-bold focus:outline-none focus:border-theme-accent cursor-pointer" 
                       value={newRegionData.action} onChange={(e) => setNewRegionData({...newRegionData, action: e.target.value})}>
                        <option value="Block">Block</option>
                        <option value="Allow">Allow</option>
                     </select>
                  </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-theme-border/50">
               <button onClick={() => setShowAddRegionModal(false)} className="text-[11px] font-bold uppercase tracking-wider text-theme-text-s hover:text-white bg-transparent border-none cursor-pointer px-4">Cancel</button>
               <button onClick={() => handleSaveGeoRule(newRegionData)} className="text-[11px] font-bold uppercase tracking-wider text-black bg-theme-accent hover:opacity-90 px-6 py-2.5 rounded-[2px] border-none cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                 Apply Region
               </button>
            </div>
          </div>
        </div>
      )}

      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-theme-bg border border-theme-border rounded-[4px] p-6 w-full max-w-sm shadow-2xl text-center">
             <Database size={32} className="text-theme-accent mx-auto mb-4 animate-pulse" />
             <h3 className="m-0 text-[16px] uppercase tracking-wider font-bold text-white mb-2">Syncing Blocklists</h3>
             <p className="text-[12px] text-theme-text-s mb-6">Updating community lists, malware domains, and telemetry definitions from global sources...</p>
             <div className="w-full bg-theme-surface rounded-full h-1.5 mb-4 overflow-hidden">
                <div className="bg-theme-accent h-1.5 rounded-full animate-[w-full_2s_ease-in-out_infinite]" style={{ width: '45%' }}></div>
             </div>
             <button onClick={() => setShowSyncModal(false)} className="text-[11px] font-bold uppercase tracking-wider text-theme-text-s hover:text-white bg-transparent border border-theme-border px-6 py-2 rounded-[2px] cursor-pointer w-full">Run In Background</button>
          </div>
        </div>
      )}
    </div>
  );
};
