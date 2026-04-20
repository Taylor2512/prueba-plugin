# SchemaConnections y contratos de datos

## 1. Por qué esta pieza es estratégica

`SchemaConnectionsWidget` y sus contratos asociados convierten al editor en algo más que un constructor visual. Aquí es donde el proyecto salta de “editor de layout” a “plataforma de formularios PDF inteligentes”.

## 2. Familias de capacidades actuales

La arquitectura actual ya apunta a estas familias:

- persistencia local o híbrida;
- consultas API por field;
- herencia de configuración HTTP del sistema;
- generación de JSON de formulario;
- metadata e integraciones futuras.

## 3. Problema clásico

Si toda esta potencia se muestra de golpe, el inspector se vuelve ilegible.

## 4. Solución recomendada

Agrupar todo bajo una sola familia funcional: **Conexiones**.

### Subbloques
- Persistencia
- API
- Form JSON
- Metadata / Integraciones futuras

## 5. Persistencia

### Contrato recomendado
```ts
interface SchemaPersistenceConfig {
  enabled: boolean;
  mode?: 'local' | 'session' | 'indexeddb' | 'hybrid';
  key?: string;
  includeHidden?: boolean;
  includeMetadata?: boolean;
  strategy?: 'replace' | 'merge' | 'append';
  ttlMs?: number;
}
```

### Casos de uso
- draft local;
- recuperación por sesión;
- persistencia offline;
- guardado híbrido.

## 6. API por field

### Contrato recomendado
```ts
interface SchemaRequestConfig {
  enabled: boolean;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  trigger?: 'onLoad' | 'onFocus' | 'onBlur' | 'onChange' | 'manual' | 'onSubmit';
  timeoutMs?: number;
  requestMode?: 'read' | 'write' | 'read-write';
  requestMapping?: Record<string, string>;
  responseMapping?: Record<string, string>;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}
```

### Casos de uso
- llenar select dinámico;
- autocompletar por cédula/RUC;
- validar contra endpoint remoto;
- submit parcial.

## 7. HTTP heredable del sistema

### Razón de existir
Evita duplicar configuración sensible en cada field.

### Modos ideales
- heredar todo;
- heredar y extender;
- local completo.

## 8. Auth manual

### Tipos recomendados
- bearer
- basic
- api-key
- custom

### Recomendación UX
No mostrar inputs completos hasta que el usuario seleccione `manual`.

## 9. Form JSON

### Contrato recomendado
```ts
interface SchemaFormConfig {
  enabled: boolean;
  collect?: boolean;
  format?: 'flat' | 'nested';
  rootKey?: string;
  includeEmpty?: boolean;
  includeHidden?: boolean;
  includeMeta?: boolean;
  path?: string;
  alias?: string;
}
```

### Valor de negocio
Permite usar el editor como generador de payloads, no solo de PDFs.

## 10. Reglas de UX recomendadas

### Persistencia
Visible y simple.

### API
Visible solo cuando se activa.

### Form JSON
Visible como módulo de salida, no como ruido constante.

## 11. Preview y validación

La plataforma debería tender a tener:
- preview del request final;
- preview del JSON generado;
- validación de config incompleta;
- badges resumen.

## 12. Conclusión

Este subsistema es uno de los diferenciales más fuertes del producto. Debe tratarse como capa de datos de plataforma, no como simple widget de inspector.
