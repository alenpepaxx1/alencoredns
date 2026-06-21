import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/  const \[activeSecurityTab, setActiveSecurityTab\] = useState\('filtering'\);\n/g, '');
code = code.replace(/  const \[dpiEnabled, setDpiEnabled\] = useState\(true\);\n/g, '');
code = code.replace(/  const \[showSyncModal, setShowSyncModal\] = useState\(false\);\n/g, '');
code = code.replace(/  const \[blocklistUrl, setBlocklistUrl\] = useState\(''\);\n/g, '');
code = code.replace(/  const \[isSyncing, setIsSyncing\] = useState\(false\);\n/g, '');
code = code.replace(/  const \[showCreateRuleModal, setShowCreateRuleModal\] = useState\(false\);\n/g, '');
code = code.replace(/  const \[newRuleData, setNewRuleData\] = useState[\s\S]*?\);\n/g, '');
code = code.replace(/  const \[showAddRegionModal, setShowAddRegionModal\] = useState\(false\);\n/g, '');
code = code.replace(/  const \[newRegionData, setNewRegionData\] = useState[\s\S]*?\);\n/g, '');
code = code.replace(/  const \[selectedClientForEdit, setSelectedClientForEdit\] = useState<any>\(null\);\n/g, '');


fs.writeFileSync('src/App.tsx', code);
console.log("Cleaned states");
