# Política anti-overflow

## Señales

- respuestas truncadas;
- pérdida de restricciones;
- relectura de decisiones;
- mezcla de tareas;
- outputs de herramientas dominando el contexto;
- resúmenes contradictorios;
- incapacidad para recordar el commit base.

## Protocolo 60/75/85

### 60%

- comprimir exploración en evidence packet;
- eliminar logs del hilo;
- guardar checkpoint;
- confirmar hipótesis principal.

### 75%

- congelar nuevas búsquedas;
- enumerar decisiones e invariantes;
- ejecutar o dividir;
- preparar handoff.

### 85%

- no editar más;
- guardar diff, tests y estado;
- iniciar sesión nueva con task-card y checkpoint;
- validar el resumen contra git antes de continuar.

## Compaction segura

Un resumen debe conservar:

- objetivo;
- alcance negativo;
- commit base;
- archivos y símbolos;
- evidencia;
- decisiones;
- cambios;
- gates;
- riesgos;
- siguiente acción.

Nunca compactar una duda como si estuviera resuelta.
