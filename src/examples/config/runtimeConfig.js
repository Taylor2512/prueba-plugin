import { createProfiledConfig } from '@/sisad-pdfme/config';
import Config from './sisad-pdfme.s.json';

export const CONFIG_PROFILES = Object.keys(Config.profiles);

export function createRuntimeConfig(profile, overrides = {}) {
  return createProfiledConfig(Config.base, Config.profiles, profile, overrides);
}
