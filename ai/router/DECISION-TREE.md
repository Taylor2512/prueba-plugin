# Árbol de decisión

```txt
¿Hay pérdida de datos o bloqueo?
  sí → P0
  no ↓

¿El comportamiento es funcional?
  sí → agente del dominio
  no ↓

¿Es interacción?
  sí → interaction-agent
  no ↓

¿Es estructura visual?
  sí → frontend-ux-agent
  no ↓

¿Es estilo/Tailwind?
  sí → css-tailwind-agent
  no ↓

¿Es documentación?
  sí → documentation-agent
```

Cuando dos dominios son necesarios, crear dos tareas con dependencia.
