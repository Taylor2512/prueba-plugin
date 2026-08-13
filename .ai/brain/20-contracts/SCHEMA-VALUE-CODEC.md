# Schema value codec

Cada familia debe implementar semántica equivalente a `read`, `normalize`, `toInput`, `toSnapshot`, `equals`, `isEmpty`. Evita que `false`, `0`, `[]`, `null` y `''` se confundan.
