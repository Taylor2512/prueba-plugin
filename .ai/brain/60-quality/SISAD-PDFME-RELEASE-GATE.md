# SISAD-PDFME release gate

Release sólo con evidencia de:
- unit/contract family tests;
- Form pairwise isolation;
- multiuser/multidoc isolation;
- Viewer/Snapshot/PDF parity;
- public API consumer smoke;
- Playwright BrowserContext concurrency;
- accessibility/keyboard/touch/IME relevantes;
- leak/cleanup/performance budget;
- lint/typecheck/build según autoridad real del repo;
- boundary audit y no new recipient-centric core usage.

Conteo bruto de tests no sustituye estos gates.
