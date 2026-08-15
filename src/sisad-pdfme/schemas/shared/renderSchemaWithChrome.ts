/**
 * Template Method helper for schema UI rendering.
 *
 * Encapsulates the shared three-step pattern:
 *   1. clear root
 *   2. stamp chrome + root attributes
 *   3. call schema-specific render function
 *
 * Callers supply only the inner render; chrome scaffolding is automatic.
 *
 * Restriction: does NOT touch x/y/width/height/rotation or Moveable/Selecto.
 */
import type { SchemaVisualFamily, SisadSchemaBase } from '@sisad-pdfme/schemas/shared/schemaTypes';
import { clearSchemaRoot, setSchemaRootAttributes } from '@sisad-pdfme/schemas/shared/schemaDom';
import { applyFieldChrome, type SchemaRenderMode } from '@sisad-pdfme/schemas/shared/fieldChrome';

export type RenderSchemaWithChromeOptions<TSchema extends SisadSchemaBase> = {
  schema: TSchema;
  rootElement: HTMLElement;
  family: SchemaVisualFamily;
  /** Optional chrome wrapper; defaults to creating a div child of rootElement. */
  chromeElement?: HTMLElement;
  selected?: boolean;
  multiSelected?: boolean;
  hovered?: boolean;
  invalid?: boolean;
  ownerColor?: string;
  compact?: boolean;
  /** Runtime render mode; forwarded to the FieldChromePolicy. */
  renderMode?: SchemaRenderMode;
  /** The schema-specific render function. Receives the chrome element to populate. */
  render: (chromeEl: HTMLElement) => void;
};

/**
 * Clears root, stamps data attributes and field chrome, then calls `render(chromeEl)`.
 *
 * chromeEl is either the provided `options.chromeElement` or a new `<div>` appended
 * to rootElement. This keeps rootElement dimensions stable (Moveable safe).
 */
export function renderSchemaWithChrome<TSchema extends SisadSchemaBase>(
  options: RenderSchemaWithChromeOptions<TSchema>,
): void {
  const {
    schema,
    rootElement,
    family,
    chromeElement,
    selected,
    multiSelected,
    hovered,
    invalid,
    ownerColor,
    compact,
    renderMode,
    render,
  } = options;

  clearSchemaRoot(rootElement);
  setSchemaRootAttributes(rootElement, schema, { ownerColor });

  const chromeEl = chromeElement ?? document.createElement('div');
  applyFieldChrome(chromeEl, {
    schema,
    family,
    selected,
    multiSelected,
    hovered,
    invalid,
    ownerColor,
    compact,
    renderMode,
  });

  render(chromeEl);

  if (!chromeElement) {
    rootElement.appendChild(chromeEl);
  }
}
