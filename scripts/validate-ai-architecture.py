#!/usr/bin/env python3
from pathlib import Path
import re
import sys

repo = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
required = [
    'README.md', 'AGENTS.md', 'CLAUDE.md', '.github/copilot-instructions.md',
    'SISAD-PDFME-MULTIAGENT.code-workspace', '.rgignore',
    'ai/README.md', 'ai/start/START.md',
    'ai/project/worktree-topology.md', 'ai/project/git-operating-model.md',
    'ai/router/ROUTER.md', 'ai/coordination/worktrees/WAVE-1.5.md',
    'ai/task-cards/active/W15-CODEX-CORE-CONTRACTS.md',
    'ai/task-cards/active/W15-CLAUDE-INSPECTOR-CONTRACTS.md',
    'ai/task-cards/active/W15-COPILOT-TEST-INFRA.md',
    'scripts/bootstrap-ai-worktrees.sh',
    'scripts/migrate-sibling-worktrees-to-embedded.sh',
    'scripts/verify-embedded-worktree-isolation.sh',
]
errors = []
for rel in required:
    p = repo / rel
    if not p.is_file(): errors.append(f'missing: {rel}')
    elif p.stat().st_size == 0: errors.append(f'empty: {rel}')

task_ids = {}
for p in (repo / 'ai/task-cards').rglob('*.md'):
    text = p.read_text(encoding='utf-8', errors='replace')
    m = re.search(r'^#\s+([A-Z0-9][A-Z0-9._-]+)\s+—', text, re.M)
    if m: task_ids.setdefault(m.group(1), []).append(str(p.relative_to(repo)))
for task_id, paths in task_ids.items():
    if len(paths) > 1: errors.append(f'duplicate task id {task_id}: {paths}')

for p in (repo / 'ai/skills').glob('*.md'):
    if p.name == 'README.md': continue
    text = p.read_text(encoding='utf-8', errors='replace')
    for section in ('## Propósito','## Procedimiento','## Validaciones','## Anti-patrones'):
        if section not in text: errors.append(f'skill missing {section}: {p.relative_to(repo)}')

for p in [repo/'AGENTS.md', repo/'CLAUDE.md', repo/'.github/copilot-instructions.md']:
    if p.exists() and 'ai/start/START.md' not in p.read_text(encoding='utf-8', errors='replace'):
        errors.append(f'adapter missing START: {p.relative_to(repo)}')

old_paths = [
    '/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-merge',
    '/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-codex',
    '/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-claude',
    '/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-copilot',
]
for p in list((repo/'ai').rglob('*.md')) + [repo/'README.md', repo/'AGENTS.md', repo/'CLAUDE.md']:
    if not p.exists(): continue
    text = p.read_text(encoding='utf-8', errors='replace')
    for old in old_paths:
        if old in text: errors.append(f'legacy sibling path in {p.relative_to(repo)}: {old}')

for rule in ('.worktrees/','.ai-coordination/','.ai-md-architecture-backups/'):
    if rule not in (repo/'.rgignore').read_text(encoding='utf-8', errors='replace').splitlines():
        errors.append(f'.rgignore missing {rule}')

if errors:
    print('AI architecture validation failed:')
    for e in errors: print('-', e)
    sys.exit(1)
print('AI architecture validation passed for embedded worktrees.')
