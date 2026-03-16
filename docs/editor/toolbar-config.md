# Toolbar JSON configuration and runtime API

This document explains the toolbar JSON format and the Designer runtime APIs to register toolbar configurations and commands per schema type.

## JSON format

The toolbar JSON should be an object with a `controls` array. Each control definition can include:

- `id` (string, required): unique id for the control
- `label` (string, optional): label or tooltip
- `icon` (string|object, optional): icon name or inline SVG descriptor
- `command` (string, optional): command name to invoke
- `args` (any, optional): optional args passed to the command
- `visibleIf` (string, optional): expression evaluated against the active schema to hide/show

Example (text toolbar):

```json
{
  "controls": [
    { "id": "bold", "label": "Bold", "command": "toggleBold", "icon": "B" },
    { "id": "italic", "label": "Italic", "command": "toggleItalic", "icon": "I" },
    { "id": "fontSize", "label": "Font size", "command": "setFontSize", "args": { "step": 2 } }
  ]
}
```

Example (image toolbar):

```json
{
  "controls": [
    { "id": "replace", "label": "Replace image", "command": "replaceImage", "icon": "image" },
    { "id": "fit", "label": "Fit", "command": "fitImage", "args": { "mode": "cover" } }
  ]
}
```

## Runtime API (Designer)

Use these methods on the `Designer` instance (already exposed in the codebase):

- `registerToolbarCommandsForType(type: string, commands: Command[])`
  - Register programmatic `Command` objects for a schema type.

- `registerToolbarConfigForType(type: string, configJson: string | object)`
  - Register a JSON toolbar configuration for a schema type; these controls will be converted to `Command`s and executed via the registry.

Example (JS):

```js
// designer is the initialized Designer instance
const textToolbarJson = {
  controls: [
    { id: 'bold', label: 'Bold', command: 'toggleBold' },
    { id: 'fontSize', label: 'Font', command: 'setFontSize', args: { step: 2 } }
  ]
};

designer.registerToolbarConfigForType('text', textToolbarJson);

// Or register commands directly
designer.registerToolbarCommandsForType('image', [
  { id: 'replace', label: 'Replace', execute: (ctx)=>{/* ... */} },
]);
```

## How it integrates

- `SelectionContextToolbar` will use the `commandsRegistry` to query commands for the active schema type(s). If a `toolbarConfig` is provided it will be parsed and controls rendered directly.
- Commands created from JSON call into an `implMap` if provided, otherwise they attempt to invoke legacy handlers exposed by the toolbar via `handlers.selectionCommands`.

## Tips and best practices

- Prefer registering `Command` objects when you need custom UI behavior (dialogs, file pickers, complex flows).
- Use JSON when the toolbar layout is simple (buttons, toggles) and can be expressed declaratively.
- Ensure commands that modify schemas receive `changeSchemas` / `commitSchemas` via `ctx.args` when invoked programmatically from non-legacy contexts.

## Next steps

- Add example snippets for plugin authors (show how to map plugin actions to toolbar commands).
- Add an E2E test that registers a toolbar JSON for `text` and asserts the toolbar buttons run expected handlers.
