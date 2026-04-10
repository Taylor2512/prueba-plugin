#!/usr/bin/env node

/**
 * generate-ai-workspace.js
 *
 * Crea de forma masiva una estructura de agentes, prompts, instructions y skills
 * enfocada en un proyecto frontend React + pdfme + canvas + editor PDF avanzado.
 *
 * Uso:
 *   node generate-ai-workspace.js
 *   node generate-ai-workspace.js ./ruta-del-proyecto
 */

const fs = require('node:fs');
const path = require('node:path');

const TARGET_ROOT = path.resolve(process.argv[2] || process.cwd());

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFileSafe(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content.trimStart() + '\n', 'utf8');
  console.log(`✔ ${path.relative(TARGET_ROOT, filePath)}`);
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function buildFileTree(files) {
  const grouped = {};
  for (const file of files) {
    const rel = toPosix(path.relative(TARGET_ROOT, file));
    const parts = rel.split('/');
    let cursor = grouped;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        cursor[part] = null;
      } else {
        cursor[part] = cursor[part] || {};
        cursor = cursor[part];
      }
    }
  }

  function renderTree(node, prefix = '') {
    const entries = Object.keys(node).sort((a, b) => a.localeCompare(b));
    const lines = [];
    entries.forEach((entry, index) => {
      const isLast = index === entries.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      lines.push(`${prefix}${connector}${entry}`);
      if (node[entry] && typeof node[entry] === 'object') {
        const nextPrefix = prefix + (isLast ? '    ' : '│   ');
        lines.push(...renderTree(node[entry], nextPrefix));
      }
    });
    return lines;
  }

  return renderTree(grouped).join('\n');
}

const files = [];

/* ===========================
   README / visión general
=========================== */

files.push(path.join(TARGET_ROOT, '.github', 'README-AI-WORKSPACE.md'));
writeFileSafe(
  files[files.length - 1],
  `
# AI Workspace del proyecto PDF Editor

Este workspace fue generado para guiar asistentes, agentes y modelos hacia una visión clara del producto.

## Visión del producto

Construir un editor PDF moderno sobre React y pdfme modificado con una experiencia tipo Wix/Figma/DocuSign:

- canvas dominante
- paneles compactos y contextuales
- sidebars colapsables
- overlays flotantes
- command bus reutilizable
- runtime desacoplado
- arquitectura escalable
- bajo acoplamiento entre UI, canvas, conversiones y datos
- diseño premium y consistente
- soporte para plantillas, campos, firmas, drag & drop, capas y propiedades avanzadas

## Principios de construcción

1. El canvas es el centro del producto.
2. Las acciones complejas deben abrirse bajo demanda, no ocupar espacio fijo.
3. Las herramientas deben ser contextuales, no invasivas.
4. La arquitectura debe separar editor, laboratorio, conversiones y shell visual.
5. Cada archivo debe tener responsabilidad clara.
6. La UI debe ser consistente, accesible y escalable.
7. El sistema debe poder evolucionar hacia multi-documento, colaboración y flujos de firma.

## Áreas críticas

- runtime del diseñador
- panel izquierdo tipo action rail
- panel derecho contextual
- overlays sobre canvas
- barra superior compacta
- resultados en bottom drawer
- comandos unificados
- persistencia de estado UI
- estilos unificados y tokens de diseño
- compatibilidad con pdfme modificado
`
);

/* ===========================
   AGENTS
=========================== */

const agents = {
  'frontend-pdf-architect.agent.md': `
# Frontend PDF Architect

## Rol
Eres un arquitecto frontend senior especializado en React, canvas, editores visuales, pdfme, flujos tipo DocuSign y UX de herramientas complejas.

## Misión
Diseñar y refactorizar el editor PDF como producto, no como laboratorio de pruebas.

## Objetivos
- separar runtime, layout, paneles y conversiones
- reducir acoplamiento
- crear una experiencia tipo Wix/Figma
- hacer que el canvas sea el protagonista
- consolidar un command bus reutilizable
- estandarizar sidebars, drawers y overlays

## Debes priorizar
1. arquitectura modular
2. UX compacta
3. mantenibilidad
4. accesibilidad
5. performance
6. consistencia visual

## Debes evitar
- mega componentes
- hooks monolíticos
- estilos duplicados
- lógica de negocio en componentes presentacionales
- sidebars permanentes que desperdicien espacio
- refactors superficiales

## Entregables esperados
- propuesta de estructura de carpetas
- plan de refactor por fases
- lista de deuda técnica
- componentes objetivo
- contratos entre capas
`,

  'pdfme-runtime-specialist.agent.md': `
# PDFME Runtime Specialist

## Rol
Especialista en pdfme modificado, runtime UI, template state, inputs, plugins, toolbar configs y motor de canvas.

## Misión
Mantener la compatibilidad con pdfme mientras se mejora su ergonomía, extensibilidad y control desde React.

## Debes analizar
- creación y destrucción de instancia
- sincronización template / inputs
- eventos del diseñador
- runtime API expuesta
- integración con overlays
- fit, page state, selection state
- command routing

## Debes producir
- propuestas de API runtime estables
- adaptación segura de pdfme modificado
- recomendaciones para eventos y listeners
- separación entre API pública y detalles internos

## Reglas
- no romper contratos existentes sin justificarlo
- preferir APIs pequeñas y semánticas
- documentar side effects
`,

  'canvas-ux-orchestrator.agent.md': `
# Canvas UX Orchestrator

## Rol
Especialista en interacción visual sobre canvas, selección, overlays, snapping, floating toolbars y diseño espacial.

## Misión
Lograr una experiencia tipo editor profesional con mínima ocupación visual y máxima velocidad de uso.

## Debes impulsar
- toolbars contextuales
- overlays no invasivos
- rail lateral compacto
- drawer inferior para resultados
- feedback visual claro
- estados hover, active, focus, selected y locked

## Reglas
- toda interacción debe reducir clics
- el canvas nunca debe quedar ahogado por paneles fijos
- las acciones frecuentes deben estar cerca del foco de trabajo
`,

  'design-system-guardian.agent.md': `
# Design System Guardian

## Rol
Guardián del sistema visual del editor.

## Misión
Garantizar consistencia entre tokens, spacing, radii, sombras, tipografías, tamaños, botones y componentes.

## Debes revisar
- duplicidad de CSS
- naming inconsistente
- inline styles innecesarios
- tokens no homologados
- jerarquía visual
- dark mode
- estados de interacción

## Resultado esperado
- unificación de tokens
- reglas de composición
- patrones reusables para rail, drawer, panel, card, toolbar, badge y overlay
`,

  'prompt-execution-director.agent.md': `
# Prompt Execution Director

## Rol
Convierte tareas complejas del proyecto en prompts precisos, secuenciales y ejecutables por IA.

## Misión
Reducir ambigüedad y guiar a los modelos a cambios estructurados, seguros y medibles.

## Debes generar
- prompts por fase
- prompts por archivo
- prompts de validación
- prompts de refactor
- prompts de hardening
- prompts de limpieza arquitectónica

## Reglas
- exigir criterios de aceptación
- definir restricciones
- pedir diffs claros
- prohibir cambios innecesarios fuera del alcance
`
};

for (const [name, content] of Object.entries(agents)) {
  const file = path.join(TARGET_ROOT, '.github', 'agents', name);
  files.push(file);
  writeFileSafe(file, content);
}

/* ===========================
   INSTRUCTIONS
=========================== */

const instructions = {
  'frontend-editor.instructions.md': `
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
`,

  'pdfme-extension.instructions.md': `
# PDFME Extension Instructions

## Objetivo
Extender pdfme modificado sin convertir la integración en una caja negra frágil.

## Reglas
- envolver APIs internas detrás de adaptadores locales
- no acoplar la app a detalles de implementación inestables
- centralizar registro de toolbar configs
- centralizar integración de plugins
- documentar diferencias respecto a pdfme upstream

## Debes promover
- createRuntimeApi
- adapters
- event maps
- selection helpers
- page helpers
- schema operations desacopladas
`,

  'ui-ux-compact.instructions.md': `
# UI UX Compact Instructions

## Objetivo
Aplicar una experiencia compacta inspirada en Wix, Figma y editores modernos.

## Principios
- menos paneles visibles por defecto
- más acciones contextuales
- menos texto, más jerarquía visual
- más espacio para el canvas
- opciones avanzadas bajo demanda

## Aplicación práctica
- usar rail izquierdo angosto
- abrir drawers por acción
- mostrar propiedades según selección
- agrupar controles secundarios en menus o drawers
- mover resultados técnicos a panel inferior
`,

  'css-unification.instructions.md': `
# CSS Unification Instructions

## Objetivo
Eliminar redundancia de estilos y consolidar el sistema visual.

## Reglas
- unificar tokens
- agrupar estilos por dominio
- evitar archivos vacíos o duplicados
- reducir colisiones de cascada
- documentar capas: foundation, layout, components, overlays, utilities

## Meta
Lograr que el editor tenga una base visual consistente, predecible y mantenible.
`
};

for (const [name, content] of Object.entries(instructions)) {
  const file = path.join(TARGET_ROOT, '.github', 'instructions', name);
  files.push(file);
  writeFileSafe(file, content);
}

/* ===========================
   PROMPTS
=========================== */

const prompts = {
  'refactor-editor-shell.prompt.md': `
# Prompt: Refactor del shell del editor

Actúa como arquitecto frontend senior experto en React, canvas, pdfme y editores visuales.

## Contexto
Existe un editor PDF construido con React y pdfme modificado. El estado actual mezcla lógica de laboratorio, runtime del diseñador, resultados de conversión y layout visual. El objetivo es evolucionarlo a un producto con UX compacta tipo Wix.

## Objetivo
Refactorizar el shell principal del editor para separar:
- EditorRail
- TopBar compacta
- ContextDrawer
- BottomResultsDrawer
- Workspace central
- Runtime del editor desacoplado

## Restricciones
- no romper compatibilidad funcional existente
- mantener la base React actual
- no introducir librerías innecesarias
- minimizar cambios fuera del alcance
- conservar nombres semánticos

## Entregables
1. nueva estructura de componentes
2. propuesta de archivos
3. implementación de base
4. criterios de aceptación
5. notas de migración

## Criterios de aceptación
- el canvas gana espacio visible
- los paneles secundarios dejan de ocupar espacio permanente
- las acciones principales siguen accesibles
- el layout queda listo para escalar
`,

  'split-monolithic-hook.prompt.md': `
# Prompt: dividir hook monolítico

Actúa como especialista en arquitectura React.

## Tarea
Tomar un hook grande que mezcla runtime de editor, blobs, conversiones, UI mode y acciones, y dividirlo en hooks especializados.

## Meta
Extraer al menos estas responsabilidades:
- usePdfmeEditorRuntime
- usePdfmeConversionLab
- usePdfmeUiState
- useBlobResourceManager

## Requisitos
- preservar funcionalidad
- reducir side effects implícitos
- eliminar parches tipo setTimeout cuando sea posible
- usar nombres explícitos
- documentar responsabilidades de cada hook
`,

  'create-command-bus.prompt.md': `
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
`,

  'compact-wix-style-ui.prompt.md': `
# Prompt: compactar UI estilo Wix

Actúa como diseñador de producto y frontend engineer senior.

## Objetivo
Transformar una UI pesada de editor PDF en una experiencia compacta y profesional inspirada en Wix/Figma.

## Cambios esperados
- rail izquierdo fino con iconos y tooltips
- panel derecho contextual
- toolbar flotante sobre selección
- bottom drawer para resultados
- top bar compacta
- reducción de texto redundante
- mejoras de espaciado, sombras, jerarquía y foco visual

## No hacer
- dejar sidebars anchas siempre visibles
- llenar la pantalla de cards de soporte
- mezclar herramientas técnicas con acciones de usuario final
`,

  'unify-css-architecture.prompt.md': `
# Prompt: unificar arquitectura CSS

Actúa como frontend architect y design system specialist.

## Objetivo
Reorganizar y consolidar el CSS del editor.

## Tareas
- detectar duplicidades
- proponer estructura final
- mover reglas a capas correctas
- homologar tokens
- eliminar estilos vacíos o redundantes
- reducir conflictos entre estilos globales y estilos internos del editor

## Resultado esperado
Una arquitectura CSS estable, limpia y escalable.
`
};

for (const [name, content] of Object.entries(prompts)) {
  const file = path.join(TARGET_ROOT, '.github', 'prompts', name);
  files.push(file);
  writeFileSafe(file, content);
}

/* ===========================
   SKILLS
=========================== */

const skills = {
  'editor-product-vision.skill.md': `
# Skill: Editor Product Vision

## Cuándo usar esta skill
Cuando una tarea impacta directamente la visión del producto del editor PDF.

## Qué recuerda esta skill
- el canvas debe dominar el layout
- los paneles deben ser compactos y contextuales
- la UI debe parecer producto real, no laboratorio
- la arquitectura debe separar shell, runtime y conversiones

## Checklist
- ¿el canvas gana espacio?
- ¿la acción es contextual?
- ¿la solución reduce ruido visual?
- ¿la propuesta escala a futuro?
`,

  'pdfme-integration.skill.md': `
# Skill: PDFME Integration

## Enfoque
Integrar y extender pdfme modificado de forma controlada.

## Recordatorios
- preferir adaptadores
- encapsular APIs internas
- centralizar eventos
- no mezclar integración de pdfme con decisiones de layout de app
`,

  'canvas-interaction.skill.md': `
# Skill: Canvas Interaction

## Enfoque
Toda mejora de interacción debe respetar el foco del canvas y minimizar fricción.

## Debe cubrir
- selección
- hover
- resize
- move
- snap
- guías
- overlays
- toolbars contextuales
`,

  'component-composition.skill.md': `
# Skill: Component Composition

## Regla principal
Cada componente debe tener una responsabilidad principal clara.

## Buenas prácticas
- separar shell y contenido
- separar presentacional y lógico
- aislar side effects
- evitar mega props
- usar composición sobre condicionales gigantes
`,

  'ux-compact-panels.skill.md': `
# Skill: UX Compact Panels

## Principio
No mostrar configuraciones complejas hasta que el usuario las pida.

## Patrones preferidos
- rail
- drawer
- popover
- flyout
- toolbar contextual
- footer drawer

## Evitar
- paneles fijos sobredimensionados
- listas vacías gigantes
- barras técnicas expandidas por defecto
`,

  'refactor-safety.skill.md': `
# Skill: Refactor Safety

## Objetivo
Cambiar arquitectura sin romper funcionalidades base.

## Checklist
- preservar contratos públicos
- migrar por fases
- verificar eventos críticos
- validar render del canvas
- validar persistencia de estado
- validar cleanup de recursos blob
`,

  'design-system-consistency.skill.md': `
# Skill: Design System Consistency

## Objetivo
Mantener coherencia visual y semántica.

## Revisar siempre
- spacing
- radius
- shadows
- typography
- icon sizing
- hover/focus/active
- color semantics
`
};

for (const [name, content] of Object.entries(skills)) {
  const file = path.join(TARGET_ROOT, '.github', 'skills', name);
  files.push(file);
  writeFileSafe(file, content);
}

/* ===========================
   ARCHIVO DE ORQUESTACIÓN
=========================== */

const orchestrationFile = path.join(TARGET_ROOT, '.github', 'workspace.manifest.json');
files.push(orchestrationFile);
writeFileSafe(
  orchestrationFile,
  JSON.stringify(
    {
      project: 'pdf-editor-react-pdfme',
      vision: {
        product: 'Editor PDF moderno tipo Wix/Figma/DocuSign',
        priorities: [
          'canvas dominante',
          'UI compacta',
          'arquitectura modular',
          'runtime desacoplado',
          'paneles contextuales',
          'extensibilidad',
          'consistencia visual'
        ]
      },
      folders: {
        agents: '.github/agents',
        instructions: '.github/instructions',
        prompts: '.github/prompts',
        skills: '.github/skills'
      },
      suggestedExecutionOrder: [
        'frontend-pdf-architect.agent.md',
        'frontend-editor.instructions.md',
        'editor-product-vision.skill.md',
        'refactor-editor-shell.prompt.md',
        'split-monolithic-hook.prompt.md',
        'create-command-bus.prompt.md',
        'compact-wix-style-ui.prompt.md',
        'unify-css-architecture.prompt.md'
      ]
    },
    null,
    2
  )
);

/* ===========================
   SCRIPT DE APOYO PARA LISTAR
=========================== */

const listFile = path.join(TARGET_ROOT, '.github', 'print-ai-workspace.js');
files.push(listFile);
writeFileSafe(
  listFile,
  `
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(process.argv[2] || process.cwd(), '.github');

function walk(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, list);
    else list.push(full);
  }
  return list;
}

if (!fs.existsSync(ROOT)) {
  console.error('No existe la carpeta .github en:', ROOT);
  process.exit(1);
}

const files = walk(ROOT);
console.log('\\nAI Workspace files:\\n');
for (const file of files) {
  console.log('-', path.relative(process.cwd(), file));
}
`
);

/* ===========================
   RESUMEN
=========================== */

const tree = buildFileTree(files);

console.log('\n==============================================');
console.log('AI Workspace generado correctamente');
console.log('Ruta:', TARGET_ROOT);
console.log('==============================================\n');
console.log(tree);
console.log('\nSiguiente paso recomendado:\n');
console.log('1. Revisa .github/README-AI-WORKSPACE.md');
console.log('2. Usa primero el agente frontend-pdf-architect.agent.md');
console.log('3. Ejecuta los prompts en el orden del workspace.manifest.json\n');