# Prompt — SISAD-PDFME execution orchestration

Trabaja sólo en SISAD-PDFME.

Objetivo:
demostrar que el mismo Form reusable soporta User × Document × RuntimeSession y que
single/sequential/parallel/mixed/massive son execution shapes orquestables sin ramas
de negocio en schemas/Form.

Primero:
- git status/HEAD;
- source/evidence;
- active RTP card;
- contratos de la card;
- focal tests.

No implementar scheduling en plugins.
No usar host-specific DTOs.
No implicit first User en multi-user Form.
No shared mutable state entre executions.

Completion:
touched != dirty != valid != completed.
No truthiness.

PDF:
preferir canonical merge + regeneration para un documento lógico.
Parallel conflicts son explícitos.
Massive default = un PDF por execution.

Una task por sesión. Evidence antes de PASS.
