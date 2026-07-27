# Contratos de capas del componente

| Capa | Responsabilidad | No debe |
|---|---|---|
| public API | props, config, adapters, callbacks | exponer internals |
| integration | traducir host/core | implementar UI |
| runtime | montar Designer/Form/Viewer | conocer negocio host |
| engine | estado y comandos | renderizar chrome |
| UI | interacción y presentación | duplicar policies |
| schemas | plugins y renderers | acceder al host |
| snapshot | serializar identidad/routing | guardar estado visual temporal |
| generator | salida PDF | depender del Designer DOM |
| design system | tokens/variants | alterar geometría del canvas |
| tests | caracterizar contratos | acoplarse a detalles triviales |

Toda abstracción nueva declara capa propietaria.
