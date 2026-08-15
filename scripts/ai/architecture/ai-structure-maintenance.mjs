#!/usr/bin/env node
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(process.argv[3]||".");
const cmd=process.argv[2]||"audit";
const scripts={
 audit:"audit-ai-structure.mjs",
 plan:"plan-ai-structure.mjs",
 apply:"apply-ai-structure.mjs",
 verify:"verify-ai-structure.mjs",
};
if(!scripts[cmd]){console.error("Usage: ai-structure-maintenance.mjs audit|plan|apply|verify [root]");process.exit(2);}
const r=spawnSync(process.execPath,[path.join(here,scripts[cmd]),root],{stdio:"inherit",cwd:root});
process.exit(r.status??1);
