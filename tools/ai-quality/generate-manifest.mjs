import fs from "node:fs";
import path from "node:path";import crypto from "node:crypto";
const ignore=new Set(["MANIFEST.md","SHA256SUMS.txt"]);
const files=[];
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(!ignore.has(p))files.push(p);}}
walk(".");
files.sort();
fs.writeFileSync("MANIFEST.md","# Manifest\n\n"+files.map(f=>`- \`${f}\``).join("\n")+"\n");
fs.writeFileSync("SHA256SUMS.txt",files.map(f=>`${crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex")}  ${f}`).join("\n")+"\n");
console.log(`${files.length} files`);
