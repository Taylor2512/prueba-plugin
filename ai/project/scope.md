# Alcance y límites

## Dentro del alcance

```txt
Designer
Canvas
Schemas
LeftSidebar
RightSidebar
DetailView
ListView
Toolbar contextual
Moveable/Selecto como integración protegida
CommandBus
Snapshot designer
CSS visual / Tailwind migration
Laboratorios de ejemplo
Baselines visuales
```

## Fuera del alcance por defecto

```txt
StepOne
StepTwo host de negocio
ContentCustomForm
Uanataca
liveness
APIs SISAD
workflow externo
firma real backend
infra backend
```

## Contrato de compatibilidad

Form/Viewer/Generator no son foco principal, pero no deben romperse. Cualquier cambio en Designer debe preservar metadata y render compatible.
