const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const pairs = [
  ['\\+ PROVISION NEW CLIENT', 'provision_new'],
  ['Active', 'active'],
  ['Idle', 'idle'],
];

for (const [en, key] of pairs) {
  // simple replace for >text< inside JSX
  code = code.replace(new RegExp(`>\\s*${en}\\s*<`, 'g'), `>{t('${key}')}<`);
  
  // also handle placeholders
  code = code.replace(new RegExp(`placeholder="${en}"`, 'g'), `placeholder={t('${key}')}`);
}

// Special check:
code = code.replace('>{client.active ? \'Active\' : \'Idle\'}<', `>{client.active ? t('active') : t('idle')}<`);
code = code.replace('>{log.status === \'Lejuar\' ? \'Active\' : \'Blocked\'}<', `>{log.status === 'Lejuar' ? t('active') : t('blocked')}<`);

fs.writeFileSync('src/App.tsx', code);
console.log('Done even more!');
