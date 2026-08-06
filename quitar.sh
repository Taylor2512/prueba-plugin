#!/bin/bash

# Carpeta donde se ejecutará el proceso.
DIRECTORIO="${1:-.}"

find "$DIRECTORIO" -type f -name '*Example*' -print0 |
while IFS= read -r -d '' ARCHIVO; do
    CARPETA=$(dirname "$ARCHIVO")
    NOMBRE=$(basename "$ARCHIVO")

    # Elimina todas las apariciones exactas de "example".
    NUEVO_NOMBRE="${NOMBRE//example/}"

    # Limpieza opcional de separadores sobrantes.
    NUEVO_NOMBRE=$(printf '%s' "$NUEVO_NOMBRE" |
        sed -E 's/[_-]{2,}/_/g; s/^[_ -]+//; s/[_ -]+(\.[^.]+)$/\1/')

    DESTINO="$CARPETA/$NUEVO_NOMBRE"

    if [ "$ARCHIVO" = "$DESTINO" ]; then
        continue
    fi

    if [ -e "$DESTINO" ]; then
        echo "OMITIDO: ya existe $DESTINO"
        continue
    fi

    echo "Renombrando:"
    echo "  $ARCHIVO"
    echo "  → $DESTINO"

    mv "$ARCHIVO" "$DESTINO"
done