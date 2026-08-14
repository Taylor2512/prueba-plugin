# Plan — grid geometry

1. characterize current grid and snap coordinates;
2. create `GridGeometry`;
3. convert mm -> render spacing through page transform;
4. render per page;
5. snap engine consumes same geometry;
6. split visible/snap/guides/rulers/object snap capabilities;
7. dynamic config updates without remount;
8. zoom/page/scroll/multipage matrix;
9. visual + interaction regression.
