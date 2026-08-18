#!/usr/bin/env node
import fs from "node:fs";import path from "node:path";
const args=process.argv.slice(2),root=path.resolve(args.find(x=>!x.startsWith("--"))||"."),apply=args.includes("--apply"),target=".trace-tmp",abs=path.join(root,target);
if(!fs.existsSync(abs)){console.log(JSON.stringify({target,present:false}));process.exit(0)}
const codeExt=new Set([".js",".jsx",".ts",".tsx",".mjs",".cjs"]),refs=[];
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(["node_modules",".git","dist","coverage","test-results","playwright-report",target].includes(e.name))continue;const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(codeExt.has(path.extname(p).toLowerCase())&&!p.includes(`${path.sep}scripts${path.sep}ai${path.sep}architecture${path.sep}`)){try{if(fs.readFileSync(p,"utf8").includes(target))refs.push(path.relative(root,p).split(path.sep).join("/"))}catch(error){if(error?.code !== "EACCES") throw error;}}}}
walk(root);if(refs.length){console.log(JSON.stringify({target,present:true,blocked:true,codeConsumers:refs},null,2));process.exit(3)}
if(apply){const backup=path.join(path.dirname(root),`${path.basename(root)}.architecture-maintenance-backup`,target);fs.mkdirSync(path.dirname(backup),{recursive:true});if(!fs.existsSync(backup))fs.cpSync(abs,backup,{recursive:true});fs.rmSync(abs,{recursive:true,force:true})}
console.log(JSON.stringify({target,present:true,blocked:false,wouldRemove:!apply,removed:apply},null,2));
