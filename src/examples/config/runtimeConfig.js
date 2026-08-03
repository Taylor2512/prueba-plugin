import { createProfiledConfig } from '@/sisad-pdfme/config';
import examplesConfig from './sisad-pdfme.examples.json';

export const EXAMPLE_CONFIG_PROFILES = Object.keys(examplesConfig.profiles);

export function createRuntimeConfig(profile, overrides = {}) {
  return createProfiledConfig(examplesConfig.base, examplesConfig.profiles, profile, overrides);
}
