import { MultiVariableTextSchema } from './types.js';

const normalizeText = (value: unknown): string => String(value || '').trim();

export const parseVariablesInput = (variablesIn: string | Record<string, string>): Record<string, string> => {
  if (!variablesIn) {
    return {};
  }

  if (typeof variablesIn !== 'string') {
    return variablesIn;
  }

  try {
    const parsed = JSON.parse(variablesIn || '{}') as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    return parsed as Record<string, string>;
  } catch {
    return {};
  }
};

export const getMissingVariables = (value: string, schema: MultiVariableTextSchema): string[] => {
  if (schema.variables.length === 0) {
    return [];
  }

  const values = parseVariablesInput(value);
  return schema.variables.filter((variable) => !normalizeText(values[variable]));
};

export const substituteVariables = (
  text: string,
  variablesIn: string | Record<string, string>,
): string => {
  if (!text) {
    return '';
  }

  let substitutedText = text;

  if (variablesIn) {
    const variables =
      typeof variablesIn === 'string'
        ? parseVariablesInput(variablesIn)
        : variablesIn;

    Object.keys(variables).forEach((variableName) => {
      // handle special characters in variable name
      const variableForRegex = variableName.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp('\\{' + variableForRegex + '\\}', 'g');
      substitutedText = substitutedText.replace(regex, variables[variableName]);
    });
  }

  // Remove any variables that were not substituted from inputs
  substitutedText = substitutedText.replace(/{[^{}]+}/g, '');

  return substitutedText;
};

export const validateVariables = (value: string, schema: MultiVariableTextSchema): boolean => {
  if (schema.variables.length === 0) {
    return true;
  }

  const values = parseVariablesInput(value);
  if (value && Object.keys(values).length === 0) {
    throw new SyntaxError(
      `[@sisad-pdfme/generator] invalid JSON string '${value}' for variables in field ${schema.name}`,
    );
  }

  for (const variable of schema.variables) {
    if (!normalizeText(values[variable])) {
      if (schema.required) {
        throw new Error(
          `[@sisad-pdfme/generator] variable ${variable} is missing for field ${schema.name}`,
        );
      }
      // If not required, then simply don't render this field if an input is missing
      return false;
    }
  }

  return true;
};
