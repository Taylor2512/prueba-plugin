# Política anti-alucinación

## Regla principal

No conviertas una posibilidad en un hecho.

## Ledger de afirmaciones

Para decisiones de arquitectura o bugs ambiguos registra:

| Claim | Estado | Evidencia | Confianza | Acción |
|---|---|---|---:|---|
| texto breve | confirmado/inferido/hipótesis/desconocido | ruta, test o fuente | 0–100 | validar o usar |

## Jerarquía de evidencia

1. test reproducible;
2. ejecución/comando;
3. código y símbolo actual;
4. contrato/documentación canónica del repo;
5. fuente oficial vigente;
6. inferencia;
7. recuerdo del modelo.

Los niveles 6–7 nunca justifican por sí solos una modificación.

## Obligaciones

- citar ruta y símbolo al describir comportamiento;
- verificar APIs y versiones cambiantes;
- indicar incertidumbre;
- diferenciar deuda previa de regresión;
- no inventar archivos, props, tests, commits o resultados;
- no afirmar que un gate pasó si no se ejecutó;
- no completar huecos con nombres plausibles.

## Corrección

Al detectar un claim falso:

1. detener la rama de razonamiento;
2. marcarlo `RETRACTADO`;
3. identificar decisiones dependientes;
4. volver a la última evidencia válida;
5. actualizar task-card y memoria si fue persistido.
