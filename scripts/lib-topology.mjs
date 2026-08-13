import path from 'node:path';
import crypto from 'node:crypto';
import { walkMarkdown, rel as relBase, toPosix } from './lib-documentation.mjs';

export const START='<!-- SISAD-MD-TOPOLOGY:START -->';
export const END='<!-- SISAD-MD-TOPOLOGY:END -->';
export const CHS='<!-- SISAD-MD-CHILDREN:START -->';
export const CHE='<!-- SISAD-MD-CHILDREN:END -->';
export { toPosix };
export const rel=(root,p)=>relBase(root,p);
export const stableId=(p)=>'MD-'+crypto.createHash('sha1').update(p).digest('hex').slice(0,10).toUpperCase();
export const walkMd=(root)=>walkMarkdown(root,{includeResidue:false});

export function classify(s){
  if(s==='README.md') return ['repository-entry','project','canonical','hot'];
  if(s==='docs/README.md') return ['documentation-entry','docs','canonical','warm'];
  if(s.startsWith('.ai/analysis/')) return ['analysis','analysis','reference','cold'];
  if(s.startsWith('.ai/brain/15-processes/')) return ['brain-process','processes','canonical','warm'];
  if(s.startsWith('.ai/brain/20-contracts/')) return ['contract','contracts','canonical','hot'];
  if(s.startsWith('.ai/brain/30-decisions/')) return ['decision-adr','decisions','canonical','warm'];
  if(s.startsWith('.ai/brain/70-memory/')) return ['memory','memory','canonical','hot'];
  if(s.startsWith('.ai/brain/90-reference/')) return ['brain-reference','reference','reference','cold'];
  if(s.startsWith('.ai/brain/')) return ['brain-doc','brain','canonical','warm'];
  if(s.startsWith('.ai/ops/tasks/')) return ['task','tasks','operational','hot'];
  if(s.startsWith('.ai/ops/sessions/')) return ['session','sessions','operational','warm'];
  if(s.startsWith('.ai/evidence/')) return ['evidence','evidence','operational','warm'];
  if(s.startsWith('.ai/index/')) return ['generated-index','index','derived','generated'];
  if(s.startsWith('.ai/prompts/')) return ['prompt','prompts','operational','warm'];
  if(s.startsWith('.ai/plans/')) return ['plan','plans','operational','warm'];
  if(s.startsWith('.ai/runbooks/')) return ['runbook','runbooks','operational','warm'];
  if(s.startsWith('.ai/reports/')) return ['report','reports','reference','cold'];
  if(s.startsWith('.ai/scrum/')) return ['scrum-artifact','tasks','operational','warm'];
  if(s.startsWith('.agents/skills/')||s.startsWith('.claude/skills/')) return ['skill','skills','provider-adapter','warm'];
  if(s.startsWith('.claude/agents/')||s.startsWith('.github/agents/')||s.startsWith('.codex/agents/')) return ['agent-profile','agents','provider-adapter','warm'];
  if(s.startsWith('.claude/rules/')||s.startsWith('.github/instructions/')) return ['provider-instruction','provider-instructions','provider-adapter','warm'];
  if(s.startsWith('.github/prompts/')) return ['provider-prompt','prompts','provider-adapter','warm'];
  if(s==='AGENTS.md'||s==='CLAUDE.md'||s==='CODEX.md'||s==='GEMINI.md'||s.endsWith('/AGENTS.md')) return ['instruction','instructions',s==='AGENTS.md'?'canonical':'provider-adapter','hot'];
  if(s.startsWith('docs/03-domains/')) return ['domain-doc',s.split('/')[2]||'domains','canonical','warm'];
  if(s.startsWith('docs/')) return ['technical-doc','docs','canonical','warm'];
  if(s.startsWith('research/')) return ['research','research','reference','cold'];
  if(s.startsWith('reports/')) return ['report','reports','reference','cold'];
  return [path.basename(s).toLowerCase()==='readme.md'?'local-readme':'documentation','other','reference','cold'];
}
export const sensitive=new Set(['instruction','skill','agent-profile','provider-instruction','provider-prompt','prompt','task','session','evidence']);
export function upsert(text,start,end,block){const a=text.indexOf(start),b=text.indexOf(end);if(a>=0&&b>=a)return text.slice(0,a)+block+text.slice(b+end.length);return text.trimEnd()+'\n\n'+block+'\n';}
export function nearestReadme(root,abs,mdSet){let d=path.dirname(abs);while(d!==root&&d.startsWith(root)){const c=path.join(d,'README.md');if(mdSet.has(c)&&c!==abs)return c;d=path.dirname(d);}const r=path.join(root,'README.md');return mdSet.has(r)&&r!==abs?r:null;}
export const relativeLink=(from,to)=>toPosix(path.relative(path.dirname(from),to))||path.basename(to);
