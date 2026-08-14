# Config effect planning

Config updates are diffed semantically and produce bounded effects.

Examples:
- grid visibility -> repaint;
- grid spacing -> repaint + snap geometry update;
- Moveable capability -> update interaction resource;
- schema registry profile -> registry refresh;
- theme token -> presentation;
- plugin set -> controlled runtime/resource rebuild.

No generic remount for every `canvas` change.
