import fs from 'fs';
import path from 'path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const deps = Object.assign({}, pkg.dependencies || {}, pkg.devDependencies || {});
const depNames = Object.keys(deps);

function walk(dir){
  const results = [];
  const list = fs.readdirSync(dir);
  for(const file of list){
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if(stat.isDirectory()){
      if(file === 'node_modules' || file === '.git' || file === 'dist') continue;
      results.push(...walk(full));
    } else {
      if(/\.jsx?$|\.tsx?$|\.mjs$|\.cjs$|\.ts$/.test(file)){
        results.push(full);
      }
    }
  }
  return results;
}

const files = [];
if(fs.existsSync(path.join(root, 'src'))) files.push(...walk(path.join(root,'src')));
if(fs.existsSync(path.join(root, 'vendor'))) files.push(...walk(path.join(root,'vendor')));
// also include root js/jsx/ts files
for(const f of fs.readdirSync(root)){
  if(/\.jsx?$|\.tsx?$|\.mjs$|\.cjs$|\.ts$/.test(f)) files.push(path.join(root,f));
}

const used = new Set();

for(const file of files){
  try{
    const content = fs.readFileSync(file,'utf8');
    for(const name of depNames){
      if(content.includes(`from '${name}'`) || content.includes(`from \"${name}\"`) ||
         content.includes(`require('${name}')`) || content.includes(`require(\"${name}\")`) ||
         content.includes(`import '${name}'`) || content.includes(`import \"${name}\"`) ||
         content.includes(`/${name}/`) || content.includes(name+"/") || content.includes(name+".'")){
        used.add(name);
      } else if(content.indexOf(name) !== -1){
        // last resort: literal occurrence
        // but to avoid false positives for long names, check word boundary
        const re = new RegExp('\\b'+name.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&')+'\\b');
        if(re.test(content)) used.add(name);
      }
    }
  } catch(e){/* ignore */}
}

const unused = depNames.filter(n=>!used.has(n));

console.log('Scanned files count:', files.length);
console.log('Dependencies found in package.json:', depNames.length);
console.log('Used dependencies (count):', used.size);
console.log('Potentially unused dependencies (count):', unused.length);
console.log('\nList of potentially unused dependencies:');
for(const u of unused) console.log('-', u);

// write to file
fs.writeFileSync(path.join(root,'unused-deps-report.json'), JSON.stringify({scannedFiles: files.length, totalDeps: depNames.length, used: Array.from(used), unused}, null, 2));
console.log('\nReport written to unused-deps-report.json');
