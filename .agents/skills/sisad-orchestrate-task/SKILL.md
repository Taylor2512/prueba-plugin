---
name: sisad-orchestrate-task
description: Orchestrate one SISAD PDFME task-card with bounded context, model routing, optional read-only delegation, gates, and memory delta. Use when starting or resuming a multi-step project task.
---

# Orchestrate a task

1. Read the task-card and nearest AGENTS.
2. Score complexity with `.ai/MODEL-ROUTER.md`.
3. Confirm one writer, branch/worktree, allowed files and gates.
4. Delegate at most two independent read-only investigations.
5. Keep requirements and decisions in the main thread; summaries only from children.
6. Implement or hand off to the writer.
7. Require review, metrics and memory delta before Done.

Read `.ai/ORCHESTRATION.md` for constraints. Do not create a multi-agent workflow for a small single-file task.
