import React, { useState, useMemo } from 'react';
import { Plus, Search, Server, Monitor, Smartphone, Tv, Save, X, Activity, Filter, ArrowUpDown, Wifi, HardDrive, Shield } from 'lucide-react';

export const ClientRegistryAdvanced = ({ t, clientsList, setClientsList }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedClientForEdit, setSelectedClientForEdit] = useState<any>(null);

  const handleSaveClient = async (client: any) => {
    let newList = [];
    if (clientsList.find((c: any) => c.id === client.id)) {
      newList = clientsList.map((c: any) => c.id === client.id ? client : c);
    } else {
      newList = [...clientsList, client];
    }
    
    try {
      await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newList)
      });
    } catch (e) {}
    setClientsList(newList);
    setSelectedClientForEdit(null);
  };

  const handleDeleteClient = async (id: string) => {
    const newList = clientsList.filter((c: any) => c.id !== id);
    try {
      await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newList)
      });
    } catch (e) {}
    setClientsList(newList);
  };

  const filteredAndSortedClients = useMemo(() => {
    let filtered = clientsList.filter((c: any) => {
       const lowerQ = searchQuery.toLowerCase();
       return c.name.toLowerCase().includes(lowerQ) || 
              c.ip.toLowerCase().includes(lowerQ) || 
              c.mac.toLowerCase().includes(lowerQ) ||
              (c.tags && c.tags.some((tag: string) => tag.toLowerCase().includes(lowerQ)));
    });

    filtered.sort((a: any, b: any) => {
       let aVal = a[sortField];
       let bVal = b[sortField];
       
       if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
       }
       if (aVal < bVal) return sortAsc ? -1 : 1;
       if (aVal > bVal) return sortAsc ? 1 : -1;
       return 0;
    });

    return filtered;
  }, [clientsList, searchQuery, sortField, sortAsc]);

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-4 relative">
       <div className="flex justify-between items-end mb-3">
          <h2 className="m-0 text-[14px] uppercase tracking-[0.05em] font-semibold text-theme-text-p">{t('client_management')}</h2>
          <button 
             onClick={() => setSelectedClientForEdit({ id: Date.now().toString(), name: 'New Client', ip: '192.168.1.', mac: '', policy: 'Standard', active: true, tags: [], bandwidthLimit: 'None', policyOverride: false, dataQuotaGb: 0, dataUsedGb: 0 })}
             className="bg-theme-accent text-black px-[12px] py-[6px] rounded-[2px] font-bold text-[11px] uppercase tracking-wider flex items-center gap-2 border-none cursor-pointer hover:opacity-90 transition-opacity">
            <Plus size={14} /> Add Client
          </button>
       </div>

       <div className="flex gap-4 items-center bg-theme-surface p-3 border border-theme-border rounded-[2px]">
          <div className="relative flex-1">
             <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-text-s" />
             <input type="text"
               placeholder="Search by IP, MAC, Name, or Tags..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-theme-bg border border-theme-border rounded-[2px] px-3 py-2 pl-9 text-[12px] text-theme-text-p box-border outline-none focus:border-theme-accent transition-colors"
             />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-theme-text-s uppercase tracking-wider font-bold">Sort By</span>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="bg-theme-bg border border-theme-border rounded-[2px] px-2 py-2 text-[11px] font-bold uppercase tracking-wider text-theme-text-p box-border outline-none cursor-pointer focus:border-theme-accent transition-colors"
            >
              <option value="name">Name</option>
              <option value="ip">IP Address</option>
              <option value="policy">Policy</option>
              <option value="active">Status</option>
            </select>
            <button onClick={() => setSortAsc(!sortAsc)} className="bg-theme-bg border border-theme-border p-2 rounded-[2px] text-theme-text-s hover:text-white cursor-pointer transition-colors">
              <ArrowUpDown size={14} />
            </button>
          </div>
       </div>

       <table className="w-full border-collapse text-[12px] bg-theme-surface border border-theme-border">
         <thead>
           <tr>
             <th className="text-left py-[10px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal cursor-pointer hover:text-theme-text-p transition-colors" onClick={() => toggleSort('name')}>{t('client_identifier')}</th>
             <th className="text-left py-[10px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal cursor-pointer hover:text-theme-text-p transition-colors" onClick={() => toggleSort('ip')}>{t('local_ip')}</th>
             <th className="text-left py-[10px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal cursor-pointer hover:text-theme-text-p transition-colors" onClick={() => toggleSort('mac')}>{t('mac_address')}</th>
             <th className="text-left py-[10px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal cursor-pointer hover:text-theme-text-p transition-colors" onClick={() => toggleSort('policy')}>{t('assigned_policy')}</th>
              <th className="text-left py-[10px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal cursor-pointer hover:text-theme-text-p transition-colors" onClick={() => toggleSort('dataQuotaGb')}>Data Usage</th>
             <th className="text-left py-[10px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal cursor-pointer hover:text-theme-text-p transition-colors" onClick={() => toggleSort('active')}>{t('status')}</th>
             <th className="text-right py-[10px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal">{t('actions')}</th>
           </tr>
         </thead>
         <tbody>
           {filteredAndSortedClients.length === 0 ? (
             <tr>
               <td colSpan={7} className="py-[30px] text-center text-theme-text-s text-[11px] uppercase tracking-wider font-bold">
                 No clients found
               </td>
             </tr>
           ) : filteredAndSortedClients.map((client: any) => (
             <tr key={client.id} className="group hover:bg-theme-bg/50 transition-colors">
               <td className="py-[12px] px-[16px] border-b border-theme-border font-mono text-theme-text-p">
                 <div className="flex items-center gap-3">
                   <div className="bg-theme-bg border border-theme-border p-2 rounded-[2px] text-theme-text-s group-hover:text-theme-accent transition-colors">
                      {client.name.toLowerCase().includes('tv') ? <Tv size={16} /> :
                       client.name.toLowerCase().includes('iphone') || (client.tags && client.tags.includes('mobile')) ? <Smartphone size={16} /> :
                       client.name.toLowerCase().includes('server') || client.name.toLowerCase().includes('hub') ? <Server size={16} /> :
                       <Monitor size={16} />}
                   </div>
                   <div>
                     <div className="font-semibold text-[12px] tracking-wide text-white">{client.name}</div>
                     <div className="flex gap-1.5 mt-1.5 flex-wrap w-[200px]">
                       {(client.tags || []).map((tag: string, i: number) => (
                          <span key={i} className="text-[9px] bg-theme-bg px-1.5 py-0.5 rounded-[2px] border border-theme-border/50 text-[#565f89] uppercase tracking-wider font-bold truncate max-w-[80px]" title={tag}>{tag}</span>
                       ))}
                     </div>
                   </div>
                 </div>
               </td>
               <td className="py-[10px] px-[16px] border-b border-theme-border font-mono text-theme-accent font-bold tracking-wider">{client.ip}</td>
               <td className="py-[10px] px-[16px] border-b border-theme-border font-mono text-theme-text-s tracking-wider uppercase text-[10px]">{client.mac}</td>
               <td className="py-[10px] px-[16px] border-b border-theme-border font-mono">
                  <span className="bg-[#050607] border border-theme-border px-[6px] py-[3px] rounded-[2px] text-theme-text-p text-[10px] uppercase font-bold tracking-widest">{client.policy}</span>
                  {client.policyOverride && <span className="ml-2 px-[4px] py-[2px] rounded-[2px] text-theme-danger border border-theme-danger text-[9px] uppercase font-bold tracking-wider">Override</span>}
                  {client.bandwidthLimit !== 'None' && <span className="block mt-2 text-[10px] text-theme-text-s font-bold">L: {client.bandwidthLimit}</span>}
               </td>
               <td className="py-[10px] px-[16px] border-b border-theme-border font-mono">
                 <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${client.active ? 'bg-theme-success shadow-[0_0_8px_rgba(0,230,118,0.5)]' : 'bg-theme-text-s'}`}></div>
                   <span className={`text-[10px] font-bold uppercase tracking-widest ${client.active ? 'text-theme-success' : 'text-theme-text-s'}`}>
                     {client.active ? t('active') : t('idle')}
                   </span>
                 </div>
               </td>
               <td className="py-[10px] px-[16px] border-b border-theme-border text-right space-x-3">
                 <button onClick={() => setSelectedClientForEdit(client)} className="text-theme-text-s hover:text-white transition-colors text-[11px] font-bold uppercase cursor-pointer bg-transparent border-none tracking-widest">{t('edit')}</button>
                 <button onClick={() => handleDeleteClient(client.id)} className="text-theme-danger/70 hover:text-theme-danger transition-colors text-[11px] font-bold uppercase cursor-pointer bg-transparent border-none tracking-widest">Del</button>
               </td>
             </tr>
           ))}
         </tbody>
       </table>

       {selectedClientForEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-theme-bg border border-theme-border rounded-[4px] w-full max-w-lg p-5 min-w-[320px] shadow-2xl relative">
            <button onClick={() => setSelectedClientForEdit(null)} className="absolute top-4 right-4 bg-transparent border-none text-theme-text-s hover:text-white cursor-pointer transition-colors p-1">
              <X size={16} />
            </button>
            <h3 className="m-0 text-[14px] font-semibold text-theme-text-p uppercase tracking-[0.05em] mb-6 flex items-center gap-2">
              <Activity size={16} className="text-theme-accent" />
              {selectedClientForEdit.id.length > 10 ? 'Register New Device' : 'Device Configuration'}
            </h3>
            
            <div className="space-y-5">
               <div>
                 <label className="block text-[10px] uppercase font-bold text-[#565f89] mb-2 tracking-wider">Device Name / Alias</label>
                 <input type="text" className="w-full bg-theme-surface border border-theme-border rounded-[2px] px-3 py-2.5 text-[13px] text-theme-text-p box-border outline-none focus:border-theme-accent transition-colors shadow-inner" 
                    value={selectedClientForEdit.name} onChange={(e) => setSelectedClientForEdit({...selectedClientForEdit, name: e.target.value})} placeholder="e.g. Work Laptop, Living Room TV" />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-[10px] uppercase font-bold text-[#565f89] mb-2 tracking-wider flex items-center gap-1.5"><Wifi size={12}/> IP Address</label>
                   <input type="text" className="w-full bg-theme-surface border border-theme-border rounded-[2px] px-3 py-2.5 font-mono text-[12px] text-theme-accent font-bold tracking-wider box-border outline-none focus:border-theme-accent transition-colors shadow-inner" 
                      value={selectedClientForEdit.ip} onChange={(e) => setSelectedClientForEdit({...selectedClientForEdit, ip: e.target.value})} placeholder="192.168..." />
                 </div>
                 <div>
                   <label className="block text-[10px] uppercase font-bold text-[#565f89] mb-2 tracking-wider flex items-center gap-1.5"><HardDrive size={12}/> MAC Address (Optional)</label>
                   <input type="text" className="w-full bg-theme-surface border border-theme-border rounded-[2px] px-3 py-2.5 font-mono text-[12px] text-theme-text-s uppercase tracking-wider box-border outline-none focus:border-theme-accent transition-colors shadow-inner" 
                      value={selectedClientForEdit.mac} onChange={(e) => setSelectedClientForEdit({...selectedClientForEdit, mac: e.target.value})} placeholder="00:00:00:00:00:00" />
                 </div>
               </div>

               <div>
                 <label className="block text-[10px] uppercase font-bold text-[#565f89] mb-2 tracking-wider">Tags (comma separated)</label>
                 <input type="text" className="w-full bg-theme-surface border border-theme-border rounded-[2px] px-3 py-2.5 text-[12px] text-theme-text-p box-border outline-none focus:border-theme-accent transition-colors shadow-inner" 
                    value={(selectedClientForEdit.tags || []).join(', ')} 
                    onChange={(e) => setSelectedClientForEdit({...selectedClientForEdit, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})} 
                    placeholder="e.g. mobile, work, trusted" />
                 <p className="mt-1.5 text-[10px] text-theme-text-s">Tags are used for grouping and bulk operations.</p>
               </div>

               <div className="grid grid-cols-2 gap-4 pt-2">
                 <div>
                   <label className="block text-[10px] uppercase font-bold text-[#565f89] mb-2 tracking-wider flex items-center gap-1.5"><Shield size={12}/> Policy Assignment</label>
                   <select className="w-full bg-theme-surface border border-theme-border rounded-[2px] px-3 py-2.5 text-[12px] text-theme-text-p box-border outline-none focus:border-theme-accent transition-colors uppercase tracking-wider font-bold cursor-pointer"
                     value={selectedClientForEdit.policy} onChange={(e) => setSelectedClientForEdit({...selectedClientForEdit, policy: e.target.value})}>
                      <option value="Total Monitoring">Total Monitoring</option>
                      <option value="Strict">Strict Base</option>
                      <option value="Standard">Standard Base</option>
                      <option value="Relaxed">Relaxed Base</option>
                      <option value="Ad-Block Only">Ad-Block Only</option>
                      <option value="Bypass">Bypass Filters</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-[10px] uppercase font-bold text-[#565f89] mb-2 tracking-wider flex items-center gap-1.5"><Activity size={12}/> Bandwidth Limit</label>
                   <select className="w-full bg-theme-surface border border-theme-border rounded-[2px] px-3 py-2.5 text-[12px] text-theme-text-p box-border outline-none focus:border-theme-accent transition-colors font-bold cursor-pointer"
                     value={selectedClientForEdit.bandwidthLimit} onChange={(e) => setSelectedClientForEdit({...selectedClientForEdit, bandwidthLimit: e.target.value})}>
                      <option value="None">None (Unlimited)</option>
                      <option value="5 Mbps">5 Mbps</option>
                      <option value="15 Mbps">15 Mbps</option>
                      <option value="50 Mbps">50 Mbps</option>
                      <option value="100 Mbps">100 Mbps</option>
                   </select>
                 </div>
               </div>

                               <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#565f89] mb-2 tracking-wider flex items-center gap-1.5"><Activity size={12}/> Monthly Data Quota (GB)</label>
                    <input type="number" className="w-full bg-theme-surface border border-theme-border rounded-[2px] px-3 py-2.5 text-[12px] text-theme-text-p font-mono box-border outline-none focus:border-theme-accent transition-colors shadow-inner" 
                       value={selectedClientForEdit.dataQuotaGb || 0} onChange={(e) => setSelectedClientForEdit({...selectedClientForEdit, dataQuotaGb: parseFloat(e.target.value) || 0})} placeholder="0 for Unlimited" min="0" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#565f89] mb-2 tracking-wider flex items-center gap-1.5"><HardDrive size={12}/> Data Used (GB)</label>
                    <input type="number" className="w-full bg-theme-surface border border-theme-border rounded-[2px] px-3 py-2.5 text-[12px] text-theme-accent font-mono font-bold box-border outline-none focus:border-theme-accent transition-colors shadow-inner" 
                       value={selectedClientForEdit.dataUsedGb || 0} onChange={(e) => setSelectedClientForEdit({...selectedClientForEdit, dataUsedGb: parseFloat(e.target.value) || 0})} placeholder="0" min="0" step="0.1" />
                  </div>
                </div>

                <div className="bg-theme-surface border border-theme-border rounded-[2px] p-4 mt-2 grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" checked={selectedClientForEdit.policyOverride} onChange={(e) => setSelectedClientForEdit({...selectedClientForEdit, policyOverride: e.target.checked})} className="sr-only" />
                      <div className={`w-8 h-4 rounded-full transition-colors ${selectedClientForEdit.policyOverride ? 'bg-theme-danger border-[1px] border-theme-danger/50' : 'bg-theme-bg border border-theme-border'}`}>
                         <div className={`w-3 h-3 rounded-full bg-white transition-transform transform mt-0.5 ml-0.5 ${selectedClientForEdit.policyOverride ? 'translate-x-4 bg-black' : ''}`}></div>
                      </div>
                    </div>
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-theme-text-p group-hover:text-white transition-colors text-theme-danger">Force Override</div>
                        <div className="text-[9px] text-[#565f89] mt-0.5">Bypass group policies</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" checked={selectedClientForEdit.active} onChange={(e) => setSelectedClientForEdit({...selectedClientForEdit, active: e.target.checked})} className="sr-only" />
                      <div className={`w-8 h-4 rounded-full transition-colors ${selectedClientForEdit.active ? 'bg-theme-success border-[1px] border-theme-success/50' : 'bg-theme-bg border border-theme-border'}`}>
                         <div className={`w-3 h-3 rounded-full transition-transform transform mt-0.5 ml-0.5 ${selectedClientForEdit.active ? 'translate-x-4 bg-black' : 'bg-theme-text-s'}`}></div>
                      </div>
                    </div>
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-theme-text-p group-hover:text-white transition-colors">Active Client</div>
                        <div className="text-[9px] text-[#565f89] mt-0.5">Allow connection</div>
                    </div>
                  </label>
               </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-theme-border/50">
               <button onClick={() => setSelectedClientForEdit(null)} className="text-[11px] font-bold uppercase tracking-wider text-theme-text-s hover:text-white bg-transparent border border-transparent hover:border-theme-border px-4 py-2 rounded-[2px] cursor-pointer transition-all">Cancel</button>
               <button onClick={() => handleSaveClient(selectedClientForEdit)} className="text-[11px] font-bold uppercase tracking-wider text-black bg-theme-accent hover:opacity-90 px-6 py-2 rounded-[2px] border-none cursor-pointer flex items-center gap-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                 <Save size={14} /> Save Device
               </button>
            </div>
          </div>
        </div>
       )}
    </div>
  );
};
