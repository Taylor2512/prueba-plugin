import {execSync} from "node:child_process";
for(const cmd of [
 "node tools/ai-quality/validate-ai-architecture.mjs",
 "node tools/ai-quality/task-lint.mjs",
 "node tools/ai-quality/lease-check.mjs"
]) { console.log(`$ ${cmd}`); execSync(cmd,{stdio:"inherit"}); }
try { execSync("git status --short",{stdio:"inherit"}); } catch { /* git no disponible: se omite el status */ }
