#!/usr/bin/env node
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { VALIDATION_MESSAGES } from "../src/core/engines/validationEngine/validationMessages.js";
import {
  ID_ALLOWED_CHARS,
  isValidEcuadorianCedulaDigits,
  isValidEcuadorianRucDigits,
  resolveEcuadorMobileNationalNumber,
  stripIdSeparators,
} from "../src/shared/utils/validators.js";

const validators = Object.freeze({
  CEDULA_ECUADOR: validateCedula,
  RUC_ECUADOR: validateRuc,
  CEDULA_OR_RUC_ECUADOR: validateCedulaOrRuc,
  PHONE_ECUADOR: validatePhone,
  CELLPHONE_ECUADOR: validateCellphone,
});
const aliases = Object.freeze({
  CEDULA: "CEDULA_ECUADOR",
  CELLPHONE: "CELLPHONE_ECUADOR",
  CI: "CEDULA_ECUADOR",
  MOBILE: "CELLPHONE_ECUADOR",
  PHONE: "PHONE_ECUADOR",
  RUC: "RUC_ECUADOR",
});
const samples = [
  ["CEDULA_ECUADOR", "099999999"],
  ["CEDULA_ECUADOR", "0951535971"],
  ["CEDULA_ECUADOR", "1234567890"],
  ["CEDULA_ECUADOR", "095-153-5970"],
  ["RUC_ECUADOR", "099999999001"],
  ["RUC_ECUADOR", "099999999002"],
  ["CEDULA_OR_RUC_ECUADOR", "099999999"],
  ["CEDULA_OR_RUC_ECUADOR", "099999999001"],
  ["CEDULA_OR_RUC_ECUADOR", "123"],
  ["CELLPHONE_ECUADOR", "0999999999"],
  ["CELLPHONE_ECUADOR", "+593999999999"],
  ["CELLPHONE_ECUADOR", "09 9999 9999"],
  ["CELLPHONE_ECUADOR", "042123456"],
  ["PHONE_ECUADOR", "042123456"],
  ["PHONE_ECUADOR", "+59342123456"],
  ["PHONE_ECUADOR", "123"],
].map(([pattern, value]) => ({ pattern, value }));

for (const sample of samples) {
  const result = resolveValidator(sample.pattern)?.(sample.value);
  printResult(`${sample.pattern} / ${sample.value}`, result);
}

function resolveValidator(pattern) {
  const key = String(pattern || "").trim().toUpperCase();
  return validators[aliases[key] || key] || null;
}

function validateCedula(value) {
  if (!value) return null;
  const raw = String(value).trim();
  if (!ID_ALLOWED_CHARS.test(raw)) return VALIDATION_MESSAGES.NUMBERS_ONLY;
  const digits = stripIdSeparators(raw);
  if (digits.length !== 10) return VALIDATION_MESSAGES.CEDULA_LENGTH;
  return isValidEcuadorianCedulaDigits(digits) ? null : VALIDATION_MESSAGES.INVALID_CEDULA;
}

function validateRuc(value) {
  if (!value) return null;
  const raw = String(value).trim();
  if (!ID_ALLOWED_CHARS.test(raw)) return VALIDATION_MESSAGES.NUMBERS_ONLY;
  const digits = stripIdSeparators(raw);
  if (digits.length !== 13) return VALIDATION_MESSAGES.RUC_LENGTH;
  if (!digits.endsWith("001")) return VALIDATION_MESSAGES.RUC_SUFFIX;
  return isValidEcuadorianRucDigits(digits) ? null : VALIDATION_MESSAGES.INVALID_RUC;
}

function validateCedulaOrRuc(value) {
  if (!value) return null;
  const digits = stripIdSeparators(value);
  if (digits.length === 10) return validateCedula(value);
  if (digits.length === 13) return validateRuc(value);
  return VALIDATION_MESSAGES.CEDULA_OR_RUC;
}

function validatePhone(value) {
  if (!value) return null;
  const raw = String(value).trim();
  const parsed = parsePhoneNumberFromString(raw) || parsePhoneNumberFromString(raw, "EC");
  return parsed?.isValid?.() ? null : VALIDATION_MESSAGES.INVALID_PHONE;
}

function validateCellphone(value) {
  if (!value) return null;
  const raw = String(value).trim();
  const parsed = parsePhoneNumberFromString(raw) || parsePhoneNumberFromString(raw, "EC");
  if (parsed?.isValid?.()) {
    return parsed.country === "EC" && String(parsed.nationalNumber || "").startsWith("9")
      ? null
      : VALIDATION_MESSAGES.INVALID_PHONE;
  }
  return resolveEcuadorMobileNationalNumber(raw)
    ? null
    : VALIDATION_MESSAGES.INVALID_PHONE;
}

function printResult(title, result) {
  if (result == null) console.log(`${title}: OK`);
  else console.log(`${title}: ERROR -> ${typeof result === "string" ? result : result.message || JSON.stringify(result)}`);
}
