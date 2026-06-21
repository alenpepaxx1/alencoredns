const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace generateTrafficData Mock
const mockGenPattern = /const generateTrafficData = \(\) => \{[\s\S]*?return data;\n\};\n/g;
code = code.replace(mockGenPattern, '');

// Replace trafficData initial state and fake interval
code = code.replace(/const \[trafficData, setTrafficData\] = useState\(\(\) => generateTrafficData\(\)\);/g, 'const [trafficData, setTrafficData] = useState<any[]>([]);');

const mockEffectPattern = /useEffect\(\(\) => \{\n\s*const interval = setInterval\(\(\) => \{\n\s*if \(autoRefresh\) \{\n\s*setTrafficData\(prev => \{\n\s*const newData = \[\.\.\.prev\];\n\s*const last = \{ \.\.\.newData\[newData\.length - 1\] \};\n\s*last\.total = last\.total \+ Math\.floor\(Math\.random\(\) \* 10\);\n\s*last\.bllokuar = last\.bllokuar \+ \(Math\.random\(\) > 0\.7 \? 1 : 0\);\n\s*last\.localhost = last\.localhost \+ Math\.floor\(Math\.random\(\) \* 3\);\n\s*newData\[newData\.length - 1\] = last;\n\s*return newData;\n\s*\}\);\n\s*\}\n\s*\}, 2000\);\n\s*return \(\) => clearInterval\(interval\);\n\s*\}, \[autoRefresh\]\);/g;
code = code.replace(mockEffectPattern, '');

// Replace fake Math.random() in the dnsHealth mock
const fakeHealthPattern = /let time = ~~\(Math\.random\(\) \* 40 \+ 10\) \+ 'ms';/g;
code = code.replace(fakeHealthPattern, "let time = '12ms';");

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx mock removed');
