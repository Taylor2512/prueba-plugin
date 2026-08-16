# Legacy cleanup runtime

Priority:
1. duplicate authority;
2. wrappers/reexports;
3. dead internal exports;
4. obsolete adapters;
5. legacy naming internals;
6. stale generated docs/tools.

There is no product compatibility obligation before the first release. Public
aliases and adapters are removed after current consumers, fixtures and tests
are migrated.

Every cleanup wave has a before/after inventory and ratchet.
