import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

const startTarget = `        {showSyncModal && (`;
const endTarget = `        {toast && (\n          <div className="fixed bottom-6 right-6`;

const startIndex = code.indexOf(startTarget);
const endIndex = code.indexOf(endTarget);

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + code.substring(endIndex);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Removed old modals successfully!");
} else {
  console.log("Could not find targets");
}
