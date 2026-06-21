const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const dnsBlockStart = code.indexOf("case 'dns':");
const dnsBlockEnd = code.indexOf("case 'logs':", dnsBlockStart);

if (dnsBlockStart !== -1 && dnsBlockEnd !== -1) {
  const dnsReplacement = "case 'dns':\n        return (\n          <CustomDNSAdvanced t={t} customRecordsList={customRecordsList} setCustomRecordsList={setCustomRecordsList} />\n        );\n      ";
  code = code.substring(0, dnsBlockStart) + dnsReplacement + code.substring(dnsBlockEnd);
  
  // Also add the import to the top
  const importStatement = "import { CustomDNSAdvanced } from './components/CustomDNSAdvanced';\n";
  code = code.replace("import { SystemSettingsAdvanced } from './components/SystemSettingsAdvanced';", "import { SystemSettingsAdvanced } from './components/SystemSettingsAdvanced';\n" + importStatement);
  
  fs.writeFileSync('src/App.tsx', code);
  console.log('App.tsx DNS updated');
} else {
  console.error("Could not find bounds of case 'dns':");
}
