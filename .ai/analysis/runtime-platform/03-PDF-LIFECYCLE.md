# PDF loading/render lifecycle

Auditar PDF.js LoadingTask/DocumentProxy/PageProxy/RenderTask. Separar: carga, render visible, conversión batch, cancelación, cleanup y destroy. No usar un timeout como sustituto permanente de un protocolo de cierre; primero caracterizar la carrera que motivó `scheduleDestroyInstance`.
