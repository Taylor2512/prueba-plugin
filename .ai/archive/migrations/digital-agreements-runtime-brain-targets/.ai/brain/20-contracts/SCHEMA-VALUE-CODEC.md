# Schema value codec

Cada family implementa una semántica equivalente a:
`read`, `normalize`, `toInput`, `toSnapshot`, `equals`, `isEmpty`.

Form, Viewer, Snapshot, Completion y Generator consumen la misma semántica. `false`, `0`,
`[]`, `null`, `undefined` y `''` no se confunden. Un schema puede declarar que no es
editable sin perder parity de representación.
