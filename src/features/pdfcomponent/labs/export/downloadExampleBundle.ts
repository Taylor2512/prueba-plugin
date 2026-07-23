import { buildExampleBundle } from './buildExampleBundle.js';
import type { ExampleBundleOptions } from './buildExampleBundle.js';
import type { ExampleDefinition } from '../builders/exampleTemplate.js';

/** Builds a data: URL href for an example bundle (JSON, utf-8 encoded). */
export const buildExampleHref = async (
  example: ExampleDefinition,
  options: ExampleBundleOptions = {},
): Promise<string> => {
  const bundle = await buildExampleBundle(example, options);
  return `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(bundle, null, 2))}`;
};

