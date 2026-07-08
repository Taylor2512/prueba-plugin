import { downloadJson } from '@/sisad-pdfme/browser/downloads.js';
import { buildExampleBundle, getExampleBundleFilename } from './buildExampleBundle.js';
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

/**
 * Builds the bundle and triggers a browser download. Returns the object URL
 * (revoke when done). No-op outside the browser.
 */
export const downloadExampleBundle = async (
  example: ExampleDefinition,
  options: ExampleBundleOptions = {},
): Promise<string> => {
  const bundle = await buildExampleBundle(example, options);
  return downloadJson(bundle, getExampleBundleFilename(example));
};
