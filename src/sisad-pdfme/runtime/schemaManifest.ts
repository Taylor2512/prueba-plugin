import type { SchemaDefinition } from '../schemas/schemaBuilder.js';

export type SchemaInteractionKind = 'input' | 'choice' | 'signing' | 'artifact' | 'action' | 'computed' | 'visual' | 'complex';

export type SchemaRuntimeManifest = SchemaDefinition & {
  aliases: string[];
  family: string;
  interactionKind: SchemaInteractionKind;
  completion: 'required-value' | 'selection' | 'signing' | 'artifact' | 'action' | 'none';
  codec: 'string' | 'number' | 'date' | 'boolean' | 'array' | 'opaque';
};

const choiceTypes = new Set(['select', 'dropdown', 'radioGroup', 'checkbox', 'checkboxGroup']);
const signingTypes = new Set(['signature', 'initials', 'dateSigned']);
const artifactTypes = new Set(['attachment']);
const visualTypes = new Set(['image', 'svg', 'line', 'rectangle', 'ellipse']);
const complexTypes = new Set(['table']);
const computedTypes = new Set(['barcodes']);

const resolveKind = (type: string): SchemaInteractionKind => {
  if (choiceTypes.has(type)) return 'choice';
  if (signingTypes.has(type)) return 'signing';
  if (artifactTypes.has(type)) return 'artifact';
  if (visualTypes.has(type)) return 'visual';
  if (complexTypes.has(type)) return 'complex';
  if (computedTypes.has(type)) return 'computed';
  if (type === 'approve' || type === 'decline' || type === 'note') return 'action';
  return 'input';
};

const resolveCodec = (type: string): SchemaRuntimeManifest['codec'] => {
  if (type === 'number') return 'number';
  if (type === 'date' || type === 'time' || type === 'dateTime' || type === 'dateSigned') return 'date';
  if (choiceTypes.has(type)) return type === 'checkbox' ? 'boolean' : 'array';
  if (signingTypes.has(type) || artifactTypes.has(type)) return 'opaque';
  return 'string';
};

export const buildSchemaRuntimeManifest = (
  definitions: SchemaDefinition[],
  aliases: Record<string, string[]> = {},
): SchemaRuntimeManifest[] => definitions.map((definition) => {
  const type = definition.type.toLowerCase();
  const interactionKind = resolveKind(type);
  return {
    ...definition,
    aliases: [...(aliases[type] ?? [])],
    family: definition.category,
    interactionKind,
    completion: interactionKind === 'choice' ? 'selection'
      : interactionKind === 'signing' ? 'signing'
        : interactionKind === 'artifact' ? 'artifact'
          : interactionKind === 'action' ? 'action'
            : interactionKind === 'visual' || interactionKind === 'computed' ? 'none'
              : 'required-value',
    codec: resolveCodec(type),
  };
});
