# Memory — tooling architecture

Durable decisions:

- stable semantic paths; no version suffixes/folders;
- one config authority under `config/tooling`;
- one Markdown/index/topology engine;
- hot-state files protected during imports;
- external backups instead of backup folders inside the repository;
- generated indexes are rebuilt, not copied from overlays;
- duplicate implementation paths become wrappers, then are removed after consumers migrate.
