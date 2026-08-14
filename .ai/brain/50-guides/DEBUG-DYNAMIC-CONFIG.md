# Guide — debug dynamic configuration

Trace:
raw config -> migrated -> normalized -> resolved -> capability -> surface -> action.

Capture revision/hash at every step.

If UI hidden but command still executes, the bug is capability convergence, not presentation.
