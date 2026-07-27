# Política de revisión

El reviewer no reimplementa el parche.

Debe comprobar:

- causa raíz;
- alcance;
- invariantes;
- API pública;
- regresiones;
- duplicidad;
- accesibilidad/UX cuando aplique;
- pruebas;
- claims sin evidencia;
- deuda nueva;
- coherencia con task-card.

Salida:

`approve`, `request-changes` o `blocked`, con hallazgos ordenados por severidad.
