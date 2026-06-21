// Copyright Alen Pepa
import React, { useState, useMemo } from 'react';
import { BookOpen, Plus, Search, Edit3, Trash, Save, X, Server, ArrowUpDown, ShieldAlert, Tag as TagIcon, LayoutList, Network } from 'lucide-react';

export const CustomDNSAdvanced = ({ t, customRecordsList, setCustomRecordsList }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('domain');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedRecordForEdit, setSelectedRecordForEdit] = useState<any>(null);

  const handleSaveRecord = async (record: any) => {
    let newList = [];
    if (customRecordsList.find((r: any) => r.id === record.id)) {
      newList = customRecordsList.map((r: any) => r.id === record.id ? record : r);
    } else {
      newList = [...customRecordsList, record];
    }
    
    try {
      await fetch('/api/custom-dns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newList)
      });
    } catch (e) {}
    setCustomRecordsList(newList);
    setSelectedRecordForEdit(null);
  };

  const handleDeleteRecord = async (id: string) => {
    const newList = customRecordsList.filter((r: any) => r.id !== id);
    try {
      await fetch('/api/custom-dns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newList)
      });
    } catch (e) {}
    setCustomRecordsList(newList);
  };

  const filteredAndSortedRecords = useMemo(() => {
    let filtered = customRecordsList.filter((r: any) => {
       const lowerQ = searchTerm.toLowerCase();
       return r.domain.toLowerCase().includes(lowerQ) || 
              r.target.toLowerCase().includes(lowerQ) || 
              (r.description && r.description.toLowerCase().includes(lowerQ)) ||
              (r.tags && r.tags.some((tag: string) => tag.toLowerCase().includes(lowerQ)));
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
  }, [customRecordsList, searchTerm, sortField, sortAsc]);

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
          <div>
            <h2 className="m-0 text-[14px] uppercase tracking-[0.05em] font-semibold text-theme-text-p flex items-center gap-2 block">
              <BookOpen size={16} className="text-theme-accent"/> Custom DNS Records
            </h2>
            <p className="text-[11px] text-theme-text-s mt-1 mb-0">Local DNS rewrites and advanced static routing configurations.</p>
          </div>
          <button 
             onClick={() => setSelectedRecordForEdit({ id: Date.now().toString(), domain: '', target: '', type: 'A', client: 'All Nodes', active: true, tags: [], description: '' })}
             className="bg-theme-accent text-black px-[12px] py-[6px] rounded-[2px] font-bold text-[11px] uppercase tracking-wider flex items-center gap-2 border-none cursor-pointer hover:opacity-90 transition-opacity">
            <Plus size={14} /> Add Record
          </button>
       </div>

       <div className="flex gap-4 items-center bg-theme-surface p-3 border border-theme-border rounded-[2px]">
          <div className="relative flex-1">
             <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-text-s" />
             <input type="text"
               placeholder="Search by Domain, Target IP, Description, or Tags..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
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
              <option value="domain">Domain Name</option>
              <option value="target">Target Answer</option>
              <option value="type">Record Type</option>
              <option value="active">Status</option>
            </select>
            <button onClick={() => setSortAsc(!sortAsc)} className="bg-theme-bg border border-theme-border p-2 rounded-[2px] text-theme-text-s hover:text-white cursor-pointer transition-colors">
              <ArrowUpDown size={14} />
            </button>
          </div>
       </div>

       <table className="w-full border-collapse text-[12px] bg-theme-surface border border-theme-border rounded-[4px] overflow-hidden">
         <thead>
           <tr>
             <th className="text-left py-[10px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal cursor-pointer hover:text-theme-text-p transition-colors" onClick={() => toggleSort('domain')}>Intercept Domain</th>
             <th className="text-left py-[10px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal cursor-pointer hover:text-theme-text-p transition-colors" onClick={() => toggleSort('type')}>Type</th>
             <th className="text-left py-[10px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal cursor-pointer hover:text-theme-text-p transition-colors" onClick={() => toggleSort('target')}>Answer / Target</th>
             <th className="text-left py-[10px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal">Tags & Rules</th>
             <th className="text-left py-[10px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal cursor-pointer hover:text-theme-text-p transition-colors" onClick={() => toggleSort('active')}>Status</th>
             <th className="text-right py-[10px] px-[16px] border-b border-theme-border text-theme-text-s uppercase text-[10px] tracking-[0.05em] font-normal">Actions</th>
           </tr>
         </thead>
         <tbody>
           {filteredAndSortedRecords.length === 0 ? (
             <tr>
               <td colSpan={6} className="py-[30px] text-center text-theme-text-s text-[11px] uppercase tracking-wider font-bold">
                 No custom DNS records found
               </td>
             </tr>
           ) : filteredAndSortedRecords.map((record: any) => (
             <tr key={record.id} className={`group hover:bg-theme-bg/50 transition-colors ${!record.active ? 'opacity-50 hover:opacity-100' : ''}`}>
               <td className="py-[12px] px-[16px] border-b border-theme-border/50 text-theme-text-p">
                 <div className="font-semibold text-[13px] tracking-wide text-white font-mono break-all line-clamp-1 flex items-center gap-2">
                     <span className={record.target === '0.0.0.0' ? 'text-theme-danger' : 'text-white'}>{record.domain}</span>
                 </div>
                 {record.description && <div className="text-[10px] text-theme-text-s mt-1 line-clamp-1">{record.description}</div>}
               </td>
               <td className="py-[10px] px-[16px] border-b border-theme-border/50 font-mono">
                  <span className={`px-[6px] py-[3px] rounded-[2px] text-[10px] uppercase font-bold tracking-widest border ${
                      record.type === 'A' ? 'bg-[#1e1e2e]/50 text-[#7aa2f7] border-[#7aa2f7]/30' :
                      record.type === 'AAAA' ? 'bg-[#1e1e2e]/50 text-[#bb9af7] border-[#bb9af7]/30' :
                      record.type === 'CNAME' ? 'bg-[#1e1e2e]/50 text-[#e0af68] border-[#e0af68]/30' :
                      record.type === 'TXT' ? 'bg-[#1e1e2e]/50 text-[#9ece6a] border-[#9ece6a]/30' :
                      'bg-[#1e1e2e]/50 text-white border-white/30'
                  }`}>
                      {record.type}
                  </span>
               </td>
               <td className="py-[10px] px-[16px] border-b border-theme-border/50 font-mono">
                  <span className={`text-[12px] tracking-wider font-bold break-all line-clamp-2 ${record.target === '0.0.0.0' ? 'text-theme-danger' : 'text-theme-accent'}`}>
                      {record.target}
                  </span>
               </td>
               <td className="py-[10px] px-[16px] border-b border-theme-border/50">
                  <div className="flex gap-1.5 flex-wrap">
                     <span className="text-[9px] bg-[#050607] border border-theme-border px-1.5 py-0.5 rounded-[2px] text-theme-text-p uppercase font-bold flex items-center gap-1">
                         <Network size={9}/> {record.client}
                     </span>
                     {(record.tags || []).map((tag: string, i: number) => (
                        <span key={i} className="text-[9px] bg-theme-bg px-1.5 py-0.5 rounded-[2px] border border-theme-border/50 text-[#565f89] uppercase tracking-wider font-bold truncate max-w-[80px]" title={tag}>{tag}</span>
                     ))}
                  </div>
               </td>
               <td className="py-[10px] px-[16px] border-b border-theme-border/50 font-mono">
                 <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${record.active ? 'bg-theme-success shadow-[0_0_8px_rgba(0,230,118,0.5)]' : 'bg-theme-danger shadow-[0_0_8px_rgba(247,118,142,0.5)]'}`}></div>
                   <span className={`text-[10px] font-bold uppercase tracking-widest ${record.active ? 'text-theme-success' : 'text-theme-danger'}`}>
                     {record.active ? 'Active' : 'Disabled'}
                   </span>
                 </div>
               </td>
               <td className="py-[10px] px-[16px] border-b border-theme-border/50 text-right space-x-3">
                 <button onClick={() => setSelectedRecordForEdit(record)} className="text-theme-text-s opacity-0 group-hover:opacity-100 hover:text-white transition-opacity text-[11px] font-bold uppercase cursor-pointer bg-transparent border-none tracking-widest">{t('edit')}</button>
                 <button onClick={() => handleDeleteRecord(record.id)} className="text-theme-danger/70 opacity-0 group-hover:opacity-100 hover:text-theme-danger transition-opacity text-[11px] font-bold uppercase cursor-pointer bg-transparent border-none tracking-widest"><Trash size={12}/></button>
               </td>
             </tr>
           ))}
         </tbody>
       </table>

       {selectedRecordForEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-theme-bg border border-theme-border rounded-[4px] w-full max-w-lg p-5 min-w-[320px] shadow-2xl relative">
            <button onClick={() => setSelectedRecordForEdit(null)} className="absolute top-4 right-4 bg-transparent border-none text-theme-text-s hover:text-white cursor-pointer transition-colors p-1">
              <X size={16} />
            </button>
            <h3 className="m-0 text-[14px] font-semibold text-theme-text-p uppercase tracking-[0.05em] mb-6 flex items-center gap-2">
              <Server size={16} className="text-theme-accent" />
              {selectedRecordForEdit.id.length > 10 ? 'Create DNS Record' : 'Edit DNS Record'}
            </h3>
            
            <div className="space-y-5">
               <div className="grid grid-cols-[2fr_1fr] gap-4">
                 <div>
                   <label className="block text-[10px] uppercase font-bold text-[#565f89] mb-2 tracking-wider">Intercept Domain</label>
                   <input type="text" className="w-full bg-theme-surface border border-theme-border rounded-[2px] px-3 py-2.5 font-mono text-[12px] text-white box-border outline-none focus:border-theme-accent transition-colors shadow-inner" 
                      value={selectedRecordForEdit.domain} onChange={(e) => setSelectedRecordForEdit({...selectedRecordForEdit, domain: e.target.value.toLowerCase()})} placeholder="e.g. ad.server.com" />
                 </div>
                 <div>
                   <label className="block text-[10px] uppercase font-bold text-[#565f89] mb-2 tracking-wider">Record Type</label>
                   <select className="w-full bg-theme-surface border border-theme-border rounded-[2px] px-3 py-2.5 text-[12px] font-mono font-bold text-theme-text-p box-border outline-none focus:border-theme-accent transition-colors cursor-pointer"
                     value={selectedRecordForEdit.type} onChange={(e) => setSelectedRecordForEdit({...selectedRecordForEdit, type: e.target.value})}>
                      <option value="A">A (IPv4)</option>
                      <option value="AAAA">AAAA (IPv6)</option>
                      <option value="CNAME">CNAME (Alias)</option>
                      <option value="TXT">TXT (Text)</option>
                      <option value="MX">MX (Mail)</option>
                   </select>
                 </div>
               </div>
               
               <div>
                 <label className="block text-[10px] uppercase font-bold text-[#565f89] mb-2 tracking-wider">Target Answer / Destination</label>
                 <input type="text" className="w-full bg-theme-surface border border-theme-border rounded-[2px] px-3 py-2.5 font-mono text-[12px] text-theme-accent font-bold tracking-wider box-border outline-none focus:border-theme-accent transition-colors shadow-inner" 
                    value={selectedRecordForEdit.target} onChange={(e) => setSelectedRecordForEdit({...selectedRecordForEdit, target: e.target.value})} placeholder={selectedRecordForEdit.type === 'A' ? "e.g. 192.168.1.50 or 0.0.0.0" : selectedRecordForEdit.type === 'CNAME' ? "e.g. other-domain.com" : "Value..."} />
                 <p className="mt-1.5 text-[10px] text-theme-text-s">The value to return to the client. Set an A record to 0.0.0.0 to effectively block the domain locally.</p>
               </div>

               <div>
                 <label className="block text-[10px] uppercase font-bold text-[#565f89] mb-2 tracking-wider flex items-center gap-1.5"><LayoutList size={12}/> Description / Note</label>
                 <input type="text" className="w-full bg-theme-surface border border-theme-border rounded-[2px] px-3 py-2.5 text-[12px] text-theme-text-p box-border outline-none focus:border-theme-accent transition-colors shadow-inner" 
                    value={selectedRecordForEdit.description || ''} onChange={(e) => setSelectedRecordForEdit({...selectedRecordForEdit, description: e.target.value})} placeholder="Optional context..." />
               </div>

               <div className="grid grid-cols-[1.5fr_1fr] gap-4 pt-2">
                 <div>
                   <label className="block text-[10px] uppercase font-bold text-[#565f89] mb-2 tracking-wider flex items-center gap-1.5"><TagIcon size={12}/> Tags (comma separated)</label>
                   <input type="text" className="w-full bg-theme-surface border border-theme-border rounded-[2px] px-3 py-2.5 text-[12px] text-theme-text-p box-border outline-none focus:border-theme-accent transition-colors shadow-inner" 
                      value={(selectedRecordForEdit.tags || []).join(', ')} 
                      onChange={(e) => setSelectedRecordForEdit({...selectedRecordForEdit, tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean)})} 
                      placeholder="e.g. prod, blocked" />
                 </div>
                 <div>
                   <label className="block text-[10px] uppercase font-bold text-[#565f89] mb-2 tracking-wider flex items-center gap-1.5"><Network size={12}/> Target Clients</label>
                   <select className="w-full bg-theme-surface border border-theme-border rounded-[2px] px-3 py-2.5 text-[12px] text-theme-text-p box-border outline-none focus:border-theme-accent transition-colors font-bold cursor-pointer"
                     value={selectedRecordForEdit.client || 'All Nodes'} onChange={(e) => setSelectedRecordForEdit({...selectedRecordForEdit, client: e.target.value})}>
                      <option value="All Nodes">All Nodes (Global)</option>
                      <option value="Group: Internal">Group: Internal Nodes</option>
                      <option value="Group: Guest">Group: Guest Network</option>
                      <option value="Tag: mobile">Clients Tagged: mobile</option>
                   </select>
                 </div>
               </div>

               <div className="bg-theme-surface border border-theme-border rounded-[2px] p-4 mt-2">
                  <label className="flex items-center gap-3 cursor-pointer group w-fit">
                    <div className="relative">
                      <input type="checkbox" checked={selectedRecordForEdit.active !== false} onChange={(e) => setSelectedRecordForEdit({...selectedRecordForEdit, active: e.target.checked})} className="sr-only" />
                      <div className={`w-8 h-4 rounded-full transition-colors ${selectedRecordForEdit.active !== false ? 'bg-theme-success border-[1px] border-theme-success/50' : 'bg-theme-bg border border-theme-border'}`}>
                         <div className={`w-3 h-3 rounded-full transition-transform transform mt-0.5 ml-0.5 ${selectedRecordForEdit.active !== false ? 'translate-x-4 bg-black' : 'bg-theme-text-s'}`}></div>
                      </div>
                    </div>
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-theme-text-p group-hover:text-white transition-colors">Record Active</div>
                    </div>
                  </label>
               </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-theme-border/50">
               <button onClick={() => setSelectedRecordForEdit(null)} className="text-[11px] font-bold uppercase tracking-wider text-theme-text-s hover:text-white bg-transparent border border-transparent hover:border-theme-border px-4 py-2 rounded-[2px] cursor-pointer transition-all">Cancel</button>
               <button onClick={() => handleSaveRecord(selectedRecordForEdit)} className="text-[11px] font-bold uppercase tracking-wider text-black bg-theme-accent hover:opacity-90 px-6 py-2 rounded-[2px] border-none cursor-pointer flex items-center gap-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                 <Save size={14} /> Save Record
               </button>
            </div>
          </div>
        </div>
       )}
    </div>
  );
};
