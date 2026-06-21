import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

const startTarget = `      case 'clients':`;
const endTarget = `      case 'rules':`;

const startIndex = code.indexOf(startTarget);
const endIndex = code.indexOf(endTarget);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `      case 'clients':\n        return (\n          <ClientRegistryAdvanced t={t} clientsList={clientsList} setClientsList={setClientsList} />\n        );\n`;
  code = code.substring(0, startIndex) + replacement + code.substring(endIndex);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Replaced successfully!");
} else {
  console.log("Could not find targets");
}
