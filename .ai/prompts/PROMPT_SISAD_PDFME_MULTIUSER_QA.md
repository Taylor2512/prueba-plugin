# Prompt — multi-user QA

Montar:
- User A/D1;
- User A/D2;
- User B/D1;
- User B/D2;
- dos Forms en el mismo JS realm;
- dos BrowserContexts.

Probar:
typing, number, choices, signatures, attachment, table, restore y switch de scope.

Sequential:
A completa -> simulator activa B.

Parallel:
A/B simultáneos.

Massive:
10/50/100 scopes aislados; no 100 inputs compartidos.

Registrar leaks por schema/session/document/user.
