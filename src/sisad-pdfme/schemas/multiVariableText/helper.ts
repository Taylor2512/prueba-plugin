import { MultiVariableTextSchema } from './types.js';

export const substituteVariables = (
  text: string,
  variablesIn: string | Record<string, string>,
): string => {
  if (!text) {
    return '';
  }

  let substitutedText = text;

  if (variablesIn) {
    let variables: Record<string, string>;
    if (typeof variablesIn === 'string') {
      try {
        variables = JSON.parse(variablesIn || '{}') as Record<string, string>;
      } catch {
        // UI render passes the raw field value here, which may still be a bare
        // placeholder (e.g. '{customer_name}') rather than a JSON variable map.
        // Tolerate it: treat as no variables so unresolved placeholders are
        // stripped below instead of crashing the renderer. Generator-side
        // strictness lives in validateVariables, not here.
        variables = {};
      }
    } else {
      variables = variablesIn;
    }

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

  let values;
  try {
    values = value ? (JSON.parse(value) as Record<string, string>) : {};
  } catch {
    throw new SyntaxError(
      `[@sisad-pdfme/generator] invalid JSON string '${value}' for variables in field ${schema.name}`,
    );
  }

  for (const variable of schema.variables) {
    if (!values[variable]) {
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
