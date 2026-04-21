# Prompt: crear command bus del editor

Actúa como arquitecto de interacción para un editor visual.

## Objetivo
Diseñar e implementar un command bus reutilizable para accionar funciones del editor desde:
- top bar
- left rail
- overlays
- hotkeys
- context menus

## Debe cubrir
- document.*
- selection.*
- page.*
- view.*
- insert.*
- convert.*

## Requisitos
- comandos semánticos
- handlers desacoplados
- tipado claro
- posibilidad de telemetría futura
- fácil extensión

