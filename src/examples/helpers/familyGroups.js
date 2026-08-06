import { FAMILY } from '../catalog/familyCatalog.js';

export const buildFamiliesForKeys = (keys) =>
  FAMILY.filter((family) => keys.includes(family.key)).map((family) => ({
    title: family.title,
    types: family.types,
  }));
