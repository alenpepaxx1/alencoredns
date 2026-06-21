const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const wireguardReplacement = "      case 'vpn':\n        return (\n          <WireguardAdvanced t={t} />\n        );";

// Replace case 'vpn': up to case 'settings':
code = code.replace(/case 'vpn':[\s\S]*?case 'settings':/g, wireguardReplacement + "\n      case 'settings':");

const settingsReplacement = "      case 'settings':\n        return (\n          <SystemSettingsAdvanced t={t} providers={providers} setProviders={setProviders} dnsPort={dnsPort} localIp={localIp} autoRefresh={autoRefresh} setAutoRefresh={setAutoRefresh} />\n        );";

// Replace case 'settings': up to the end of the switch statement
code = code.replace(/case 'settings':[\s\S]*?(?=\s*default:)/g, settingsReplacement + "\n");

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx updated');
