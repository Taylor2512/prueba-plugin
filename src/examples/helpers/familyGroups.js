import { FAMILY_EXAMPLES } from '../catalog/familyCatalog.js';

export const buildFamiliesForKeys = (keys) =>
  FAMILY_EXAMPLES.filter((family) => keys.includes(family.key)).map((family) => ({
    title: family.title,
    types: family.types,
  }));
