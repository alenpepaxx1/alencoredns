const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const settingsBlockStart = code.indexOf("case 'settings':");
const settingsBlockEnd = code.indexOf("    }\n  };\n\n  return (");

if (settingsBlockStart !== -1 && settingsBlockEnd !== -1) {
  const settingsReplacement = "case 'settings':\n        return (\n          <SystemSettingsAdvanced t={t} providers={providers} setProviders={setProviders} dnsPort={dnsPort} localIp={localIp} autoRefresh={autoRefresh} setAutoRefresh={setAutoRefresh} />\n        );\n";
  code = code.substring(0, settingsBlockStart) + settingsReplacement + code.substring(settingsBlockEnd);
  fs.writeFileSync('src/App.tsx', code);
  console.log('App.tsx settings updated');
} else {
  console.error("Could not find bounds of case 'settings':", settingsBlockStart, settingsBlockEnd);
}
