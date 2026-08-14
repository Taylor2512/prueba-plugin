# Designer stability strategy

Designer is not the main rewrite target.

Protect:
- drag/drop preview and drop semantics;
- canvas scroll/zoom/pan;
- selection/multi-selection;
- move/resize/rotate;
- snapping/guides/grid;
- left/right sidebars;
- schema inspector;
- user assignment and color;
- multi-document switching;
- import/export/snapshot;
- keyboard and accessibility.

Any internal refactor must demonstrate no regression through contract + interaction tests.
