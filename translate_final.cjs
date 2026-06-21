const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Also inject into dictionaries string manipulations
code = code.replace("blocked: 'Blocked',", "blocked: 'Blocked',\n    total: 'Total',\n    localhost: 'Localhost',\n    dns_health_monitor: 'DNS Health Monitor',\n    provider_ip: 'Provider / IP',\n    latency: 'Latency',\n    pkt_loss: 'Pkt Loss',\n    recent_logs: 'Recent Logs',");
code = code.replace("blocked: 'Blockiert',", "blocked: 'Blockiert',\n    total: 'Gesamt',\n    localhost: 'Lokaler Host',\n    dns_health_monitor: 'DNS-Gesundheitsmonitor',\n    provider_ip: 'Anbieter / IP',\n    latency: 'Latenz',\n    pkt_loss: 'Pkt-Verlust',\n    recent_logs: 'Aktuelle Protokolle',");
code = code.replace("blocked: 'Bllokuar',", "blocked: 'Bllokuar',\n    total: 'Totali',\n    localhost: 'Lokale',\n    dns_health_monitor: 'Monitorimi i Shëndetit DNS',\n    provider_ip: 'Ofruesi / IP',\n    latency: 'Vonesa',\n    pkt_loss: 'Humbje Pkt',\n    recent_logs: 'Kërkimet e Fundit',");

const pairs = [
  ['Total', 'total'],
  ['Blocked', 'blocked'],
  ['Localhost', 'localhost'],
  ['DNS Health Monitor', 'dns_health_monitor'],
  ['Provider / IP', 'provider_ip'],
  ['Latency', 'latency'],
  ['Pkt Loss', 'pkt_loss'],
  ['Recent Logs', 'recent_logs']
];

for (const [en, key] of pairs) {
  code = code.replace(new RegExp(`>\\s*${en}\\s*<`, 'g'), `>{t('${key}')}<`);
  code = code.replace(new RegExp(`placeholder="${en}"`, 'g'), `placeholder={t('${key}')}`);
}

fs.writeFileSync('src/App.tsx', code);
console.log('Done the last few words!');
