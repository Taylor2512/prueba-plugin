# Frontend Editor Instructions

## Objetivo
Evolucionar el editor PDF hacia una arquitectura profesional y compacta.

## Directrices
- usar React con componentes de responsabilidad única
- separar layout shell de lógica de editor
- extraer hooks monolíticos
- mantener nombres semánticos
- encapsular acciones en command handlers
- mover resultados secundarios a drawers
- reducir paneles permanentes

## Convenciones
- un archivo = una responsabilidad principal
- componentes grandes deben delegar composición
- evitar estilos inline salvo casos justificados
- preferir tokens y clases de sistema
- toda prop pública debe tener un propósito claro

## Patrones obligatorios
- rail de acciones
- panel contextual
- toolbar contextual sobre selección
- bottom drawer para resultados
- runtime desacoplado del shell visual

## Anti-patrones
- estado global accidental
- duplicación de handlers
- mezcla de lógica de conversión con lógica de canvas
- side effects en render

