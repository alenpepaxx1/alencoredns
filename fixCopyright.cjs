const fs = require('fs');

['src/components/CustomDNSAdvanced.tsx', 'src/components/SystemSettingsAdvanced.tsx', 'src/components/WireguardAdvanced.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('Copyright Alen Pepa')) {
    content = '// Copyright Alen Pepa\n' + content;
    fs.writeFileSync(file, content);
  }
});
