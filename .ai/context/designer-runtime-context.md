# Designer Runtime Context

El diseñador PDF es el dueño de:

- canvas;
- schemas;
- left sidebar;
- right sidebar;
- DetailView;
- ListView;
- overlays;
- toolbar contextual;
- selection;
- Moveable;
- Selecto;
- command bus;
- snapshot del diseñador;
- CSS runtime.

## No pertenece al diseñador

- StepOne;
- StepTwo host;
- APIs SISAD;
- Uanataca/liveness;
- flujo de negocio;
- externalForms como proceso externo.

## Contratos

El diseñador debe preservar metadata para que otros módulos puedan consumir el snapshot.
