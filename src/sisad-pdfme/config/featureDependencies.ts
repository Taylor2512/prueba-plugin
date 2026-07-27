import type { FeatureId } from './featureRegistry.js';

export const featureDependencies: Record<FeatureId, FeatureId[]> = {
  runtime: [],
  canvas: ['runtime'],
  sidebars: ['runtime'],
  inspector: ['runtime'],
  documents: ['runtime', 'canvas'],
  comments: ['runtime', 'canvas'],
  signatures: ['runtime'],
  assignment: ['runtime', 'collaboration'],
  collaboration: ['runtime'],
  persistence: ['runtime'],
};
