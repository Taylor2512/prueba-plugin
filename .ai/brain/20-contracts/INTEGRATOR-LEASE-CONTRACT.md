# Integrator lease contract

Because all agents share the same branch, commit/push is a serialized responsibility.

The integrator:
- reviews active claims;
- refuses commit while another writer reports an unfinished partial edit unless those files are
  intentionally included;
- runs `git status --short`;
- stages explicit paths;
- never uses `git add .` during concurrent operation unless all writers have reached a barrier;
- writes commit messages from task/evidence;
- pushes only after release gates required by that slice.

Default recommended integrator can be Claude or Codex; the role, not provider, is authoritative.
