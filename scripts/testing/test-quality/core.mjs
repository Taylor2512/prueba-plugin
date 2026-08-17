import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

export const normalize = (v) => v.split(path.sep).join('/');
export const ensureDir = (d) => fs.mkdirSync(d, { recursive: true });
export const walk = (d) => !fs.existsSync(d) ? [] : fs.readdirSync(d,{withFileTypes:true}).flatMap(e => { const p=path.join(d,e.name); return e.isDirectory()?walk(p):[p]; });
export const readJson = (f, fallback=null) => { try { return JSON.parse(fs.readFileSync(f,'utf8')); } catch { return fallback; } };
export const writeJson = (f,v) => { ensureDir(path.dirname(f)); fs.writeFileSync(f, JSON.stringify(v,null,2)+'\n','utf8'); };
export const relative = (root,abs) => normalize(path.relative(root,abs));
export const sha256 = (data) => crypto.createHash('sha256').update(data).digest('hex');
export const sha256File = (f) => sha256(fs.readFileSync(f));
export const parseArgs = (argv=process.argv.slice(2)) => { const rootArg=argv.find(x=>!x.startsWith('--'))??'.'; const flags=new Set(argv.filter(x=>x.startsWith('--'))); return {root:path.resolve(rootArg),apply:flags.has('--apply'),full:flags.has('--full'),strict:flags.has('--strict')}; };
export const run = (cmd,args,{cwd,capture=true,env={}}={}) => { const r=spawnSync(cmd,args,{cwd,encoding:'utf8',stdio:capture?'pipe':'inherit',env:{...process.env,...env}}); return {command:[cmd,...args].join(' '),status:r.status??1,stdout:r.stdout??'',stderr:r.stderr??''}; };

export const gitDirtyPaths = (root) => {
  const r=run('git',['status','--porcelain=v1','-z'],{cwd:root});
  if(r.status!==0) return new Set();
  const parts=r.stdout.split('\0').filter(Boolean); const out=[];
  for(let i=0;i<parts.length;i++){
    const item=parts[i]; if(item.length<4) continue;
    const status=item.slice(0,2); const first=normalize(item.slice(3));
    if(status[0]==='R'||status[0]==='C'||status[1]==='R'||status[1]==='C'){
      const second=parts[i+1]; if(second){ out.push(normalize(second)); i++; } else out.push(first);
    } else out.push(first);
  }
  return new Set(out);
};

const collectClaims=(value,out=[])=>{
  if(Array.isArray(value)){ for(const x of value) collectClaims(x,out); return out; }
  if(!value||typeof value!=='object') return out;
  const mode=String(value.mode??'').toLowerCase();
  if((mode===''||mode.includes('write'))&&Array.isArray(value.paths)) for(const p of value.paths) if(typeof p==='string') out.push(normalize(p));
  for(const child of Object.values(value)) collectClaims(child,out); return out;
};
export const claimedPaths=(root)=>new Set(collectClaims(readJson(path.join(root,'.ai/ops/coordination/claims.json'),{})));
export const conflicts=(rel,set)=>[...set].some(p=>rel===p||rel.startsWith(p+'/')||p.startsWith(rel+'/'));
export const assertSafeTargets=(root,targets)=>{
  const dirty=gitDirtyPaths(root), claims=claimedPaths(root), blocked=[];
  for(const rel of targets){ if(conflicts(rel,dirty)) blocked.push({path:rel,reason:'DIRTY'}); if(conflicts(rel,claims)) blocked.push({path:rel,reason:'CLAIMED'}); }
  if(blocked.length) throw new Error('UNSAFE_TARGETS\n'+blocked.map(x=>`${x.reason}: ${x.path}`).join('\n'));
};
export const backupRootFor=(root)=>path.join(path.dirname(root),path.basename(root)+'.test-quality-backup');
export const backupFile=(root,rel)=>{
  const src=path.join(root,rel); if(!fs.existsSync(src)) return null;
  const dst=path.join(backupRootFor(root),'files',rel); ensureDir(path.dirname(dst));
  if(fs.existsSync(dst)&&sha256File(dst)!==sha256File(src)) throw new Error(`BACKUP_CONFLICT: ${rel}`);
  if(!fs.existsSync(dst)) fs.copyFileSync(src,dst);
  return {path:rel,beforeHash:sha256File(src)};
};

export const isTestFile=f=>/\.(?:spec|test)\.[cm]?[jt]sx?$/.test(f);
export const isBrowserSpec=f=>/\.spec\.[cm]?[jt]sx?$/.test(f);
export const testTitles=text=>[...text.matchAll(/\b(?:test|it)(?:\.(?:skip|only|fixme|todo))?\s*\(\s*(['"`])([\s\S]*?)\1/g)].map(m=>m[2].replace(/\s+/g,' ').trim()).filter(Boolean);
export const literalRoutes=text=>[...text.matchAll(/['"`](\/[A-Za-z0-9_./:-]+)['"`]/g)].map(m=>m[1]);
export const literalExpectations=text=>[...text.matchAll(/\.to(?:HaveText|ContainText|HaveValue|BeVisible|BeEditable|BeDisabled|HaveAttribute)\s*\(([^)]*)\)/g)].map(m=>m[1].replace(/\s+/g,' ').trim());
export const tokenize=text=>(text.replace(/\/\*[\s\S]*?\*\//g,' ').replace(/\/\/.*$/gm,' ').replace(/\s+/g,' ').toLowerCase().match(/[a-záéíóúñ0-9_./#-]+/g)??[]);
export const jaccard=(a,b)=>{const A=new Set(a),B=new Set(b); if(!A.size&&!B.size)return 1; let hit=0; for(const x of A)if(B.has(x))hit++; return hit/(A.size+B.size-hit);};
