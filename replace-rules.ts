import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

const startTarget = `      case 'rules':\n        return (`;
const endTarget = `      case 'dns':\n        return (`;

const startIndex = code.indexOf(startTarget);
const endIndex = code.indexOf(endTarget);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `      case 'rules':\n        return (\n          <SecurityPoliciesAdvanced \n             t={t} \n             filteringRules={filteringRules} \n             setFilteringRules={setFilteringRules} \n             geoBlockingRules={geoBlockingRules} \n             setGeoBlockingRules={setGeoBlockingRules} \n          />\n        );\n`;
  code = code.substring(0, startIndex) + replacement + code.substring(endIndex);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Replaced rules block successfully!");
} else {
  console.log("Could not find targets");
}
