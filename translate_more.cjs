const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const pairs = [
  ['Client Management', 'client_management'],
  ['Client Identifier', 'client_identifier'],
  ['Local IP', 'local_ip'],
  ['MAC Address', 'mac_address'],
  ['Assigned Policy', 'assigned_policy'],
  ['Status', 'status'],
  ['Add Client', 'add_client'],
  ['Client Name', 'client_name'],
  ['IP Address / MAC', 'ip_mac'],
  ['Upstream Target', 'upstream_target'],
  ['Bandwidth Limit', 'bandwidth_limit'],
  ['Edit', 'edit'],
  ['Time', 'time'],
  ['Client', 'client'],
  ['Domain', 'domain'],
  ['Type', 'type']
];

for (const [en, key] of pairs) {
  // simple replace for >text< inside JSX
  code = code.replace(new RegExp(`>\\s*${en}\\s*<`, 'g'), `>{t('${key}')}<`);
  
  // also handle placeholders
  code = code.replace(new RegExp(`placeholder="${en}"`, 'g'), `placeholder={t('${key}')}`);
}

fs.writeFileSync('src/App.tsx', code);
console.log('Done additional!');
