// Copyright Alen Pepa
import React, { useState, useEffect } from 'react';
import { Lock, FileText, Upload, Shield, Key, Network, Activity, Plus, Trash2, Edit3, Save, Download, Copy, RefreshCw, X, CheckCircle, Server, Globe, Smartphone, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const WireguardAdvanced = ({ t }: { t: any }) => {
  const [activeTab, setActiveTab] = useState('server');
  const [vpnEnabled, setVpnEnabled] = useState(true);

  // Server Settings
  const [serverConfig, setServerConfig] = useState({
    privateKey: 'yB/...',
    publicKey: 'A1b2c3d4e5f6g7h8i9j0A1b2c3d4e5f6g7h8i9j0=',
    listenPort: '51820',
    address: '10.0.0.1/24',
    mtu: '1420',
    postUp: 'iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE',
    postDown: 'iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE',
  });

  const [showPrivateKey, setShowPrivateKey] = useState(false);

  // Peers State
  const [peers, setPeers] = useState<any[]>([
    {
      id: '1',
      name: 'Martin-Mobile',
      publicKey: 'dGhpcyBpcyBhIGZha2UgcHVibGljIGtleSAxMjM0NQ==',
      allowedIPs: '10.0.0.2/32',
      endpoint: '192.168.1.100:43210',
      lastHandshake: '2 mins ago',
      tx: '14.5 MB',
      rx: '3.2 MB',
      active: true
    },
    {
      id: '2',
      name: 'Work-Laptop',
      publicKey: 'YW5vdGhlciBmaWN0aW9uYWwga2V5IGZvciB0ZXN0aW5n',
      allowedIPs: '10.0.0.3/32',
      endpoint: '203.0.113.50:51820',
      lastHandshake: '5 hours ago',
      tx: '2.1 GB',
      rx: '840 MB',
      active: true
    },
    {
      id: '3',
      name: 'Remote-NAS',
      publicKey: 'bmFzIGtleSBleGFtcGxlIGJhc2U2NCBzdHJpbmcg',
      allowedIPs: '10.0.0.4/32',
      endpoint: '-',
      lastHandshake: 'Never',
      tx: '0 B',
      rx: '0 B',
      active: false
    }
  ]);

  const [rawConfig, setRawConfig] = useState('');
  const [showRaw, setShowRaw] = useState(false);
  const [showPeerModal, setShowPeerModal] = useState(false);
  const [newPeer, setNewPeer] = useState({ name: '', publicKey: '', allowedIPs: '', endpoint: '', presharedKey: '', persistentKeepalive: '25' });
  // Upstream Client State
  const [upstreamEnabled, setUpstreamEnabled] = useState(false);
  const [upstreamConfig, setUpstreamConfig] = useState<any>({
     interfaceAddress: '',
     privateKey: '',
     dns: '',
     peerPublicKey: '',
     peerEndpoint: '',
     allowedIPs: '0.0.0.0/0, ::/0',
     presharedKey: ''
  });
  const [uploadText, setUploadText] = useState('');
  
  const handleParseUpstream = (text: string) => {
     const lines = text.split('\n');
     let config = { ...upstreamConfig };
     let currentSection = '';
     
     lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('#') || trimmed.length === 0) return;
        
        if (trimmed.startsWith('[')) {
           currentSection = trimmed.toLowerCase();
           return;
        }
        
        const [key, ...rest] = trimmed.split('=');
        if (!key || rest.length === 0) return;
        const value = rest.join('=').trim();
        const lowerKey = key.trim().toLowerCase();
        
        if (currentSection === '[interface]') {
           if (lowerKey === 'privatekey') config.privateKey = value;
           if (lowerKey === 'address') config.interfaceAddress = value;
           if (lowerKey === 'dns') config.dns = value;
        } else if (currentSection === '[peer]') {
           if (lowerKey === 'publickey') config.peerPublicKey = value;
           if (lowerKey === 'endpoint') config.peerEndpoint = value;
           if (lowerKey === 'allowedips') config.allowedIPs = value;
           if (lowerKey === 'presharedkey') config.presharedKey = value;
        }
     });
     
     setUpstreamConfig(config);
     setUpstreamEnabled(true);
     setUploadText('');
     alert('Upstream VPN Configuration Loaded! Traffic will be routed through this Gateway.');
  };


  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024, sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generateKeypair = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let key = '';
    for (let i=0; i<42; i++) key += chars.charAt(Math.floor(Math.random() * chars.length));
    key += '=';
    return key;
  };

  const handleGenerateServerKeys = () => {
    setServerConfig({
      ...serverConfig,
      privateKey: generateKeypair(),
      publicKey: generateKeypair()
    });
  };

  const handleAddPeer = () => {
    if (!newPeer.name || !newPeer.publicKey) return;
    setPeers([...peers, {
      id: Date.now().toString(),
      name: newPeer.name,
      publicKey: newPeer.publicKey,
      allowedIPs: newPeer.allowedIPs || '10.0.0.X/32',
      endpoint: newPeer.endpoint || '-',
      lastHandshake: 'Never',
      tx: '0 B',
      rx: '0 B',
      active: false
    }]);
    setShowPeerModal(false);
    setNewPeer({ name: '', publicKey: '', allowedIPs: '', endpoint: '', presharedKey: '', persistentKeepalive: '25' });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-end mb-4">
         <div>
           <h2 className="m-0 text-[14px] uppercase tracking-[0.05em] font-semibold text-theme-text-p flex items-center gap-2">
             <Shield size={16} className="text-theme-accent"/> Advanced WireGuard System
           </h2>
           <p className="text-[11px] text-theme-text-s mt-1 mb-0 max-w-2xl">
             Enterprise-grade cryptokey routing. Manage server interface, cryptographic identities, and connected peers.
           </p>
         </div>
         <div className="flex items-center gap-3">
             <span className={`text-[10px] font-bold uppercase tracking-widest ${vpnEnabled ? 'text-theme-success' : 'text-theme-text-s'}`}>
                 {vpnEnabled ? 'Wg0 Active' : 'Down'}
             </span>
             <div 
                 className={`w-10 h-5 rounded-full flex items-center p-1 cursor-pointer transition-colors ${
                     vpnEnabled ? 'bg-theme-accent border-[1px] border-theme-accent/50 shadow-[0_0_10px_rgba(var(--theme-accent-rgb),0.3)]' : 'bg-theme-bg border border-theme-border'
                 }`}
                 onClick={() => setVpnEnabled(!vpnEnabled)}
             >
                 <div className={`w-3.5 h-3.5 rounded-full transition-transform transform ${vpnEnabled ? 'bg-black translate-x-4' : 'bg-theme-text-s translate-x-0'}`}></div>
             </div>
         </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-8 border-b border-theme-border pb-0 mb-5 text-[12px] uppercase tracking-[0.05em] font-bold">
        <button 
          onClick={() => setActiveTab('server')}
          className={`pb-[12px] pt-[4px] border-b-[2px] transition-all cursor-pointer bg-transparent px-2 ${activeTab === 'server' ? 'border-theme-accent text-theme-accent' : 'border-transparent text-theme-text-s hover:text-white'}`}
        >
          <div className="flex items-center gap-2"><Server size={14}/> Server Interface (wg0)</div>
        </button>
        <button 
          onClick={() => setActiveTab('peers')}
          className={`pb-[12px] pt-[4px] border-b-[2px] transition-all cursor-pointer bg-transparent px-2 ${activeTab === 'peers' ? 'border-theme-accent text-theme-accent' : 'border-transparent text-theme-text-s hover:text-white'}`}
        >
          <div className="flex items-center gap-2"><Network size={14}/> Connected Peers ({peers.length})</div>
        </button>
        <button 
          onClick={() => setActiveTab('upstream')}
          className={`pb-[12px] pt-[4px] border-b-[2px] transition-all cursor-pointer bg-transparent px-2 ${activeTab === 'upstream' ? 'border-theme-accent text-theme-accent' : 'border-transparent text-theme-text-s hover:text-white'}`}
        >
          <div className="flex items-center gap-2"><Globe size={14}/> Global Gateway (Upstream)</div>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'server' ? (
          <motion.div key="server" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }} className="space-y-4">
             <div className="bg-theme-surface border border-theme-border rounded-[4px] p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-theme-accent/5 to-transparent pointer-events-none"></div>
                
                <div className="flex justify-between items-center mb-5 pb-4 border-b border-theme-border/50">
                  <div className="text-[12px] text-theme-accent uppercase font-bold tracking-widest flex items-center gap-2">
                    <Key size={14} /> Cryptographic Identity
                  </div>
                  <button onClick={handleGenerateServerKeys} className="bg-theme-bg border border-theme-border hover:border-theme-accent text-theme-text-s hover:text-white px-[12px] py-[6px] rounded-[2px] text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-2 uppercase tracking-wider">
                    <RefreshCw size={12} /> Regenerate Keys
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold text-[#565f89] tracking-wider flex justify-between">
                       Private Key
                       <span className="text-theme-danger flex items-center gap-1"><Shield size={10}/> Secret</span>
                     </label>
                     <div className="relative">
                       <input 
                         type={showPrivateKey ? "text" : "password"} 
                         value={serverConfig.privateKey}
                         readOnly
                         className="w-full bg-[#050607] border border-theme-border rounded-[2px] pl-3 pr-20 py-2.5 text-[12px] text-theme-danger font-mono outline-none shadow-inner"
                       />
                       <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                          <button onClick={() => setShowPrivateKey(!showPrivateKey)} className="p-1 text-theme-text-s hover:text-white bg-transparent border-none cursor-pointer"><Eye size={14}/></button>
                          <button onClick={() => handleCopy(serverConfig.privateKey)} className="p-1 text-theme-text-s hover:text-white bg-transparent border-none cursor-pointer"><Copy size={14}/></button>
                       </div>
                     </div>
                   </div>

                   <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold text-[#565f89] tracking-wider flex justify-between">
                       Public Key
                       <span className="text-theme-success flex items-center gap-1"><Globe size={10}/> Public</span>
                     </label>
                     <div className="relative">
                       <input 
                         type="text" 
                         value={serverConfig.publicKey}
                         readOnly
                         className="w-full bg-[#050607] border border-theme-border rounded-[2px] pl-3 pr-10 py-2.5 text-[12px] text-theme-accent font-mono outline-none shadow-inner"
                       />
                       <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <button onClick={() => handleCopy(serverConfig.publicKey)} className="p-1 text-theme-text-s hover:text-white bg-transparent border-none cursor-pointer"><Copy size={14}/></button>
                       </div>
                     </div>
                   </div>
                </div>
             </div>

             <div className="bg-theme-surface border border-theme-border rounded-[4px] p-5 shadow-sm">
                <div className="text-[12px] text-theme-text-p uppercase font-bold tracking-widest mb-5 pb-4 border-b border-theme-border/50 flex items-center gap-2">
                  <Activity size={14} className="text-theme-accent" /> Network Interface Configuration
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold text-[#565f89] tracking-wider">Interface Address</label>
                     <input type="text" value={serverConfig.address} onChange={(e) => setServerConfig({...serverConfig, address: e.target.value})} className="w-full bg-[#050607] border border-theme-border rounded-[2px] px-3 py-2.5 text-[12px] text-white font-mono outline-none focus:border-theme-accent transition-colors" placeholder="e.g. 10.0.0.1/24" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold text-[#565f89] tracking-wider">Listen Port</label>
                     <input type="text" value={serverConfig.listenPort} onChange={(e) => setServerConfig({...serverConfig, listenPort: e.target.value})} className="w-full bg-[#050607] border border-theme-border rounded-[2px] px-3 py-2.5 text-[12px] text-white font-mono outline-none focus:border-theme-accent transition-colors" placeholder="51820" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold text-[#565f89] tracking-wider">MTU (Optional)</label>
                     <input type="text" value={serverConfig.mtu} onChange={(e) => setServerConfig({...serverConfig, mtu: e.target.value})} className="w-full bg-[#050607] border border-theme-border rounded-[2px] px-3 py-2.5 text-[12px] text-white font-mono outline-none focus:border-theme-accent transition-colors" placeholder="1420" />
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold text-[#565f89] tracking-wider">PostUp Rules (iptables)</label>
                     <textarea value={serverConfig.postUp} onChange={(e) => setServerConfig({...serverConfig, postUp: e.target.value})} className="w-full bg-[#050607] border border-theme-border rounded-[2px] p-3 text-[11px] text-theme-text-s font-mono outline-none focus:border-theme-accent transition-colors resize-none h-[60px]" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase font-bold text-[#565f89] tracking-wider">PostDown Rules (iptables)</label>
                     <textarea value={serverConfig.postDown} onChange={(e) => setServerConfig({...serverConfig, postDown: e.target.value})} className="w-full bg-[#050607] border border-theme-border rounded-[2px] p-3 text-[11px] text-theme-text-s font-mono outline-none focus:border-theme-accent transition-colors resize-none h-[60px]" />
                   </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-theme-border/50">
                   <button className="bg-theme-accent text-black hover:opacity-90 px-[20px] py-[8px] rounded-[2px] text-[11px] font-bold cursor-pointer transition-all flex items-center gap-2 uppercase tracking-wider shadow-[0_0_15px_rgba(var(--theme-accent-rgb),0.4)] border-none">
                     <Save size={14} /> Update Interface
                   </button>
                </div>
             </div>
          </motion.div>
        ) : activeTab === 'peers' ? (
          <motion.div key="peers" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }} className="space-y-4">
             <div className="flex justify-between items-end mb-2">
                 <div className="text-[12px] text-theme-text-s max-w-lg">Manage connected client profiles. Generates configuration files for external devices to connect securely to this node.</div>
                 <button onClick={() => setShowPeerModal(true)} className="bg-theme-accent text-black border-none px-[12px] py-[6px] rounded-[2px] text-[11px] font-bold cursor-pointer flex items-center gap-2 hover:opacity-90 uppercase tracking-wider">
                   <Plus size={14}/> Add Peer
                 </button>
             </div>

             <div className="space-y-3">
               {peers.length === 0 ? (
                 <div className="bg-theme-surface border border-theme-border rounded-[4px] p-10 text-center text-theme-text-s uppercase tracking-widest text-[11px] font-bold">
                    No peers defined
                 </div>
               ) : peers.map(peer => (
                 <div key={peer.id} className="bg-theme-surface border border-theme-border rounded-[4px] p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:border-theme-border/80 transition-colors shadow-sm group">
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${peer.active ? 'bg-theme-success/10 text-theme-success shadow-[0_0_10px_rgba(0,230,118,0.2)]' : 'bg-theme-bg text-theme-text-s border border-theme-border'}`}>
                          <Smartphone size={18} />
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="m-0 text-[14px] font-semibold text-white tracking-wide">{peer.name}</h4>
                            <span className="text-[9px] bg-[#050607] border border-theme-border px-1.5 py-0.5 rounded-[2px] text-theme-text-s uppercase font-bold font-mono">
                                {peer.allowedIPs}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#565f89] font-mono tracking-widest truncate max-w-[200px] mb-1">
                            PUB: {peer.publicKey.substring(0, 16)}...
                          </div>
                          <div className="text-[10px] text-theme-text-s flex items-center gap-1.5 font-bold uppercase tracking-wider">
                             <Activity size={10} className={peer.active ? 'text-theme-success' : 'text-theme-text-s'}/>
                             {peer.active ? `Last Handshake: ${peer.lastHandshake}` : 'Offline'}
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-6 md:ml-auto">
                       <div className="hidden lg:flex gap-4 text-[10px] font-mono whitespace-nowrap">
                          <div className="flex flex-col border-r border-theme-border/50 pr-4">
                             <span className="text-[#565f89] uppercase tracking-widest mb-0.5">Endpoint IP</span>
                             <span className="text-white font-bold">{peer.endpoint}</span>
                          </div>
                          <div className="flex flex-col border-r border-theme-border/50 pr-4">
                             <span className="text-[#565f89] uppercase tracking-widest mb-0.5">Data Rx</span>
                             <span className="text-theme-accent font-bold">{peer.rx}</span>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[#565f89] uppercase tracking-widest mb-0.5">Data Tx</span>
                             <span className="text-theme-accent font-bold">{peer.tx}</span>
                          </div>
                       </div>
                       
                       <div className="flex gap-2">
                         <button className="h-8 w-8 rounded-[2px] bg-theme-bg border border-theme-border flex items-center justify-center text-theme-text-s hover:text-white hover:border-theme-accent cursor-pointer transition-colors" title="Download Config">
                            <Download size={14} />
                         </button>
                         <button className="h-8 w-8 rounded-[2px] bg-theme-bg border border-theme-border flex items-center justify-center text-theme-text-s hover:text-white hover:border-theme-accent cursor-pointer transition-colors" title="View Config / QR">
                            <FileText size={14} />
                         </button>
                         <button className="h-8 w-8 rounded-[2px] bg-theme-bg border border-theme-border flex items-center justify-center text-theme-danger/70 hover:text-theme-danger hover:border-theme-danger/50 cursor-pointer transition-colors" onClick={() => setPeers(peers.filter(p => p.id !== peer.id))}>
                            <Trash2 size={14} />
                         </button>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
          </motion.div>
        ) : activeTab === 'upstream' ? (
          <motion.div key="upstream" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }} className="space-y-6">
             <div className="bg-theme-surface border border-theme-border rounded-[4px] p-5 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-5 pb-4 border-b border-theme-border/50">
                  <div>
                    <div className="text-[12px] text-theme-accent uppercase font-bold tracking-widest flex items-center gap-2 mb-1">
                      <Globe size={14} /> Global Gateway Mode
                    </div>
                    <div className="text-[10px] text-theme-text-s">Route all network traffic from this node through a third-party WireGuard VPN provider (e.g. Mullvad, NordVPN, ProtonVPN).</div>
                  </div>
                  <div className={"flex items-center gap-3"}>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${upstreamEnabled ? 'text-theme-success' : 'text-theme-text-s'}`}>
                          {upstreamEnabled ? 'Gateway Active' : 'Bypassed'}
                      </span>
                      <div 
                          className={`w-10 h-5 rounded-full flex items-center p-1 cursor-pointer transition-colors ${
                              upstreamEnabled ? 'bg-theme-accent border-[1px] border-theme-accent/50 shadow-[0_0_10px_rgba(var(--theme-accent-rgb),0.3)]' : 'bg-theme-bg border border-theme-border'
                          }`}
                          onClick={() => setUpstreamEnabled(!upstreamEnabled)}
                      >
                          <div className={`w-3.5 h-3.5 rounded-full transition-transform transform ${upstreamEnabled ? 'bg-black translate-x-4' : 'bg-theme-text-s translate-x-0'}`}></div>
                      </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mb-6">
                   <div className="space-y-4">
                      
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-[#565f89] tracking-wider">Interface Address</label>
                        <input type="text" value={upstreamConfig.interfaceAddress} onChange={(e) => setUpstreamConfig({...upstreamConfig, interfaceAddress: e.target.value})} className="w-full bg-[#050607] border border-theme-border rounded-[2px] px-3 py-2.5 text-[12px] text-white font-mono outline-none focus:border-theme-accent shadow-inner transition-colors" placeholder="10.64.0.1/32" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-[#565f89] tracking-wider">DNS Server (Optional)</label>
                        <input type="text" value={upstreamConfig.dns} onChange={(e) => setUpstreamConfig({...upstreamConfig, dns: e.target.value})} className="w-full bg-[#050607] border border-theme-border rounded-[2px] px-3 py-2.5 text-[12px] text-white font-mono outline-none focus:border-theme-accent shadow-inner transition-colors" placeholder="1.1.1.1" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-[#565f89] tracking-wider flex justify-between">Private Key <span className="text-theme-danger flex items-center gap-1"><Shield size={10}/> Secret</span></label>
                        <input type="password" value={upstreamConfig.privateKey} onChange={(e) => setUpstreamConfig({...upstreamConfig, privateKey: e.target.value})} className="w-full bg-[#050607] border border-theme-border rounded-[2px] px-3 py-2.5 text-[12px] text-theme-danger font-mono outline-none focus:border-theme-accent shadow-inner transition-colors" />
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-[#565f89] tracking-wider">Provider Endpoint IP:Port</label>
                        <input type="text" value={upstreamConfig.peerEndpoint} onChange={(e) => setUpstreamConfig({...upstreamConfig, peerEndpoint: e.target.value})} className="w-full bg-[#050607] border border-theme-border rounded-[2px] px-3 py-2.5 text-[12px] text-theme-accent font-mono outline-none focus:border-theme-accent shadow-inner transition-colors" placeholder="198.51.100.1:51820" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-[#565f89] tracking-wider">Provider Public Key</label>
                        <input type="text" value={upstreamConfig.peerPublicKey} onChange={(e) => setUpstreamConfig({...upstreamConfig, peerPublicKey: e.target.value})} className="w-full bg-[#050607] border border-theme-border rounded-[2px] px-3 py-2.5 text-[12px] text-white font-mono outline-none focus:border-theme-accent shadow-inner transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-[#565f89] tracking-wider">Allowed IPs</label>
                        <input type="text" value={upstreamConfig.allowedIPs} onChange={(e) => setUpstreamConfig({...upstreamConfig, allowedIPs: e.target.value})} className="w-full bg-[#050607] border border-theme-border rounded-[2px] px-3 py-2.5 text-[12px] text-white font-mono outline-none focus:border-theme-accent shadow-inner transition-colors" placeholder="0.0.0.0/0, ::/0" />
                      </div>
                   </div>
                </div>

                <div className="bg-theme-bg border border-theme-border rounded-[4px] p-4 text-center mt-6">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-[#565f89] mb-3">Or Paste Raw Configuration</div>
                    <textarea 
                      value={uploadText}
                      onChange={(e) => setUploadText(e.target.value)}
                      className="w-full h-[120px] bg-[#050607] border border-theme-border rounded-[2px] p-3 text-[11px] text-theme-text-s font-mono outline-none focus:border-theme-accent transition-colors resize-none mb-3"
                      placeholder="[Interface]
PrivateKey = ...
Address = 10.64.0.1/32

[Peer]
PublicKey = ...
Endpoint = ..."
                    />
                    <div className="flex justify-between items-center">
                       <input 
                          type="file" 
                          id="wg-upload"
                          className="hidden" 
                          accept=".conf"
                          onChange={(e) => {
                             const file = e.target.files?.[0];
                             if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                   if (ev.target?.result) {
                                      handleParseUpstream(ev.target.result as string);
                                   }
                                };
                                reader.readAsText(file);
                             }
                          }}
                       />
                       <label htmlFor="wg-upload" className="bg-theme-surface border border-theme-border hover:border-theme-accent text-white px-[12px] py-[6px] rounded-[2px] text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-2 uppercase tracking-wider">
                         <Upload size={12}/> Select .conf File
                       </label>
                       
                       <button onClick={() => handleParseUpstream(uploadText)} disabled={!uploadText.trim()} className="bg-theme-accent text-black border-none hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed px-[16px] py-[8px] rounded-[2px] text-[10px] font-bold cursor-pointer transition-all flex items-center gap-2 uppercase tracking-wider shadow-[0_0_15px_rgba(var(--theme-accent-rgb),0.2)]">
                         Parse & Route
                       </button>
                    </div>
                </div>

             </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Add Peer Modal */}
      {showPeerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-theme-bg border border-theme-border rounded-[4px] p-6 w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setShowPeerModal(false)} className="absolute top-4 right-4 text-theme-text-s hover:text-white bg-transparent border-none cursor-pointer p-1"><X size={16}/></button>
            <h3 className="m-0 text-[14px] uppercase tracking-[0.05em] font-semibold text-theme-text-p mb-6 flex items-center gap-2">
               <Plus size={16} className="text-theme-accent"/> Add New Peer
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-[10px] text-[#565f89] font-bold uppercase tracking-wider mb-1.5">Profile Name</label>
                   <input type="text" className="w-full bg-theme-surface border border-theme-border text-white text-[12px] px-3 py-2.5 rounded-[2px] font-mono outline-none focus:border-theme-accent" 
                     value={newPeer.name} onChange={(e) => setNewPeer({...newPeer, name: e.target.value})} placeholder="e.g. My-iPhone" />
                </div>
                <div>
                   <label className="block text-[10px] text-[#565f89] font-bold uppercase tracking-wider mb-1.5">Allowed IPs (Internal)</label>
                   <input type="text" className="w-full bg-theme-surface border border-theme-border text-white text-[12px] px-3 py-2.5 rounded-[2px] font-mono outline-none focus:border-theme-accent" 
                     value={newPeer.allowedIPs} onChange={(e) => setNewPeer({...newPeer, allowedIPs: e.target.value})} placeholder="10.0.0.5/32" />
                </div>
              </div>

              <div>
                 <label className="block text-[10px] text-[#565f89] font-bold uppercase tracking-wider mb-1.5 flex justify-between">
                   Public Key
                   <button onClick={() => setNewPeer({...newPeer, publicKey: generateKeypair()})} className="bg-transparent border-none text-theme-accent cursor-pointer hover:underline text-[9px]">Generate</button>
                 </label>
                 <input type="text" className="w-full bg-theme-surface border border-theme-border text-theme-accent font-bold text-[12px] px-3 py-2.5 rounded-[2px] font-mono outline-none focus:border-theme-accent" 
                   value={newPeer.publicKey} onChange={(e) => setNewPeer({...newPeer, publicKey: e.target.value})} placeholder="Base64 Public Key..." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-[10px] text-[#565f89] font-bold uppercase tracking-wider mb-1.5">Preshared Key (Optional)</label>
                   <input type="text" className="w-full bg-theme-surface border border-theme-border text-white text-[12px] px-3 py-2.5 rounded-[2px] font-mono outline-none focus:border-theme-accent" 
                     value={newPeer.presharedKey} onChange={(e) => setNewPeer({...newPeer, presharedKey: e.target.value})} placeholder="" />
                </div>
                <div>
                   <label className="block text-[10px] text-[#565f89] font-bold uppercase tracking-wider mb-1.5">Persistent Keepalive</label>
                   <input type="text" className="w-full bg-theme-surface border border-theme-border text-white text-[12px] px-3 py-2.5 rounded-[2px] font-mono outline-none focus:border-theme-accent" 
                     value={newPeer.persistentKeepalive} onChange={(e) => setNewPeer({...newPeer, persistentKeepalive: e.target.value})} placeholder="25" />
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-theme-border/50">
               <button onClick={() => setShowPeerModal(false)} className="text-[11px] font-bold uppercase tracking-wider text-theme-text-s hover:text-white bg-transparent border-none cursor-pointer px-4">Cancel</button>
               <button onClick={handleAddPeer} className="text-[11px] font-bold uppercase tracking-wider text-black bg-theme-accent hover:opacity-90 px-6 py-2.5 rounded-[2px] border-none cursor-pointer shadow-[0_0_15px_rgba(var(--theme-accent-rgb),0.5)]">
                 Create Profile
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

