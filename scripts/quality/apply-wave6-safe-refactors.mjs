import fs from "node:fs";
import process from "node:process";
import path from "node:path";

const root = process.cwd();

const replaceRequired = (relativePath, search, replacement, expected = 1) => {
  const absolutePath = path.join(root, relativePath);
  const source = fs.readFileSync(absolutePath, "utf8");
  const occurrences = source.split(search).length - 1;

  if (occurrences !== expected) {
    throw new Error(
      `${relativePath}: se esperaban ${expected} coincidencias y se encontraron ${occurrences}`,
    );
  }

  fs.writeFileSync(absolutePath, source.replaceAll(search, replacement), "utf8");
  console.log(`✓ ${relativePath}`);
};

const recipientsPath =
  "src/features/DigitalAgreements/features/designer/hooks/useRecipientsState.js";

replaceRequired(
  recipientsPath,
  "export const useRecipientsState = () => {",
  `const applySignatureFieldPolicy = (\n  field,\n  { requiresSignType, oneShotEnabled, signaturePolicyId, dniValue },\n) => {\n  if (field.indexName === "singType") {\n    return { ...field, isHidden: !requiresSignType, isRequired: requiresSignType };\n  }\n\n  if (field.indexName === "signaturePolicyId") {\n    return {\n      ...field,\n      value: signaturePolicyId || "",\n      isHidden: true,\n      isRequired: false,\n    };\n  }\n\n  if (field.indexName === "dni") {\n    return {\n      ...field,\n      value: dniValue,\n      isHidden: !oneShotEnabled,\n      isRequired: oneShotEnabled,\n    };\n  }\n\n  return field;\n};\n\nconst buildHydratedRecipientCommon = (recipient, position) => ({\n  typeUser: normalizeText(recipient?.typeUser) || DESIGNER_DEFAULT_USER_TYPE,\n  responsibility: normalizeResponsibility(recipient?.responsibility),\n  singType: normalizeText(recipient?.signaturePolicyId || recipient?.singType),\n  signaturePolicyId: normalizeText(\n    recipient?.signaturePolicyId || recipient?.singType,\n  ),\n  dni: normalizeText(recipient?.dni),\n  shippingType:\n    Array.isArray(recipient?.shippingType) && recipient.shippingType.length\n      ? normalizeShippingTypes(recipient.shippingType)\n      : ["correo"],\n  position,\n  isPrivateMessage: Boolean(recipient?.privateMessage),\n  privateMessage: normalizeText(recipient?.privateMessage),\n});\n\nexport const useRecipientsState = () => {`,
  `const applySignatureFieldPolicy = (\n  field,\n  { requiresSignType, oneShotEnabled, signaturePolicyId, dniValue },\n) => {\n  if (field.indexName === "singType") {\n    return { ...field, isHidden: !requiresSignType, isRequired: requiresSignType };\n  }\n\n  if (field.indexName === "signaturePolicyId") {\n    return {\n      ...field,\n      value: signaturePolicyId || "",\n      isHidden: true,\n      isRequired: false,\n    };\n  }\n\n  if (field.indexName === "dni") {\n    return {\n      ...field,\n      value: dniValue,\n      isHidden: !oneShotEnabled,\n      isRequired: oneShotEnabled,\n    };\n  }\n\n  return field;\n};\n\nconst buildHydratedRecipientCommon = (recipient, position) => ({\n  typeUser: normalizeText(recipient?.typeUser) || DESIGNER_DEFAULT_USER_TYPE,\n  responsibility: normalizeResponsibility(recipient?.responsibility),\n  singType: normalizeText(recipient?.signaturePolicyId || recipient?.singType),\n  signaturePolicyId: normalizeText(\n    recipient?.signaturePolicyId || recipient?.singType,\n  ),\n  dni: normalizeText(recipient?.dni),\n  shippingType:\n    Array.isArray(recipient?.shippingType) && recipient.shippingType.length\n      ? normalizeShippingTypes(recipient.shippingType)\n      : ["correo"],\n  position,\n  isPrivateMessage: Boolean(recipient?.privateMessage),\n  privateMessage: normalizeText(recipient?.privateMessage),\n});\n\nexport const useRecipientsState = () => {`,
);

replaceRequired(
  recipientsPath,
  `      if (field.indexName === "singType") {\n        return { ...field, isHidden: !requiresSignType, isRequired: requiresSignType };\n      }\n      if (field.indexName === "signaturePolicyId") {\n        return {\n          ...field,\n          value: syncedOverrides.signaturePolicyId || "",\n          isHidden: true,\n          isRequired: false,\n        };\n      }\n      if (field.indexName === "dni") {\n        return {\n          ...field,\n          value: normalizeText(syncedOverrides.dni),\n          isHidden: !oneShotEnabled,\n          isRequired: oneShotEnabled,\n        };\n      }\n      return field;`,
  `      return applySignatureFieldPolicy(field, {\n        requiresSignType,\n        oneShotEnabled,\n        signaturePolicyId: syncedOverrides.signaturePolicyId,\n        dniValue: normalizeText(syncedOverrides.dni),\n      });`,
);

replaceRequired(
  recipientsPath,
  `      if (field.indexName === "singType") {\n        return { ...field, isHidden: !requiresSignType, isRequired: requiresSignType };\n      }\n      if (field.indexName === "signaturePolicyId") {\n        return {\n          ...field,\n          value: syncedOverrides.signaturePolicyId || "",\n          isHidden: true,\n          isRequired: false,\n        };\n      }\n      if (field.indexName === "dni") {\n        return {\n          ...field,\n          value: oneShotEnabled ? normalizeText(syncedOverrides.dni) : "",\n          isHidden: !oneShotEnabled,\n          isRequired: oneShotEnabled,\n        };\n      }\n      return field;`,
  `      return applySignatureFieldPolicy(field, {\n        requiresSignType,\n        oneShotEnabled,\n        signaturePolicyId: syncedOverrides.signaturePolicyId,\n        dniValue: oneShotEnabled ? normalizeText(syncedOverrides.dni) : "",\n      });`,
);

const replaceHydratedRecipientBlock = (indent) => {
  replaceRequired(
    recipientsPath,
    `${indent}typeUser: normalizeText(recipient?.typeUser) || DESIGNER_DEFAULT_USER_TYPE,\n${indent}responsibility: normalizeResponsibility(recipient?.responsibility),\n${indent}singType: normalizeText(recipient?.signaturePolicyId || recipient?.singType),\n${indent}signaturePolicyId: normalizeText(recipient?.signaturePolicyId || recipient?.singType),\n${indent}dni: normalizeText(recipient?.dni),\n${indent}shippingType:\n${indent}  Array.isArray(recipient?.shippingType) && recipient.shippingType.length\n${indent}    ? normalizeShippingTypes(recipient.shippingType)\n${indent}    : ["correo"],\n${indent}position: normalizedPosition,`,
    `${indent}...buildHydratedRecipientCommon(recipient, normalizedPosition),`,
  );

  replaceRequired(
    recipientsPath,
    `${indent}isPrivateMessage: Boolean(recipient?.privateMessage),\n${indent}privateMessage: normalizeText(recipient?.privateMessage),\n${indent}isPassword: Boolean(recipient?.password),`,
    `${indent}isPassword: Boolean(recipient?.password),`,
  );
};

replaceHydratedRecipientBlock("              ");
replaceHydratedRecipientBlock("            ");

const rulesPath =
  "src/features/DigitalAgreements/core/domain/recipients/recipientRules.js";

replaceRequired(
  rulesPath,
  "export const validateRecipientRules = (recipients = [], isSequential = false) => {",
  `const partitionRecipientsByCopy = (recipients = []) => {\n  const normalized = Array.isArray(recipients) ? recipients : [];\n  return {\n    normalized,\n    active: normalized.filter(\n      (recipient) => !isCopyResponsibility(recipient?.responsibility),\n    ),\n    copies: normalized.filter((recipient) =>\n      isCopyResponsibility(recipient?.responsibility),\n    ),\n  };\n};\n\nexport const validateRecipientRules = (recipients = [], isSequential = false) => {`,
);

replaceRequired(
  rulesPath,
  `  const normalizedRecipients = Array.isArray(recipients) ? recipients : [];\n  const active = normalizedRecipients.filter(\n    (recipient) => !isCopyResponsibility(recipient?.responsibility)\n  );\n  const copies = normalizedRecipients.filter(\n    (recipient) => isCopyResponsibility(recipient?.responsibility)\n  );`,
  `  const { normalized: normalizedRecipients, active, copies } =\n    partitionRecipientsByCopy(recipients);`,
  2,
);

const managerPath =
  "src/features/ContentWorkflows/Contracts/TemplateManager.jsx";

replaceRequired(
  managerPath,
  "export default function TemplateManager() {",
  `const resolveLatestVersion = (versionList = []) => {\n  if (!Array.isArray(versionList) || versionList.length === 0) return null;\n  const versionNumber = Math.max(...versionList.map((item) => item.versionNumber));\n  const version = versionList.find(\n    (item) => item.versionNumber === versionNumber,\n  );\n  return version ? { version, versionNumber } : null;\n};\n\nconst fetchCabinetIndexes = async ({ cabinetId, token }) => {\n  const response = await axios.get(\n    \`\${SisadCoreServer}index/bycabinet/\${cabinetId}\`,\n    { headers: { Authorization: \`Bearer \${token}\` } },\n  );\n  return Array.isArray(response.data) ? response.data : [];\n};\n\nexport default function TemplateManager() {`,
);

replaceRequired(
  managerPath,
  `  useEffect(() => {\n    if (!selectedCabinetId) return;\n    axios\n      .get(\`\${SisadCoreServer}index/bycabinet/\${selectedCabinetId}\`, {\n        headers: { Authorization: \`Bearer \${token}\` },\n      })\n      .then((res) => setFields(res.data))\n      .catch(console.error);\n  }, [selectedCabinetId, token]);`,
  `  useEffect(() => {\n    if (!selectedCabinetId) return;\n    fetchCabinetIndexes({ cabinetId: selectedCabinetId, token })\n      .then(setFields)\n      .catch(console.error);\n  }, [selectedCabinetId, token]);`,
);

replaceRequired(
  managerPath,
  `      const max = Math.max(...vers.map((v) => v.versionNumber));\n      const last = vers.find((v) => v.versionNumber === max);`,
  `      const latest = resolveLatestVersion(vers);\n      if (!latest) return;\n      const { version: last, versionNumber: max } = latest;`,
  2,
);

console.log("Wave 6: refactors seguros aplicados.");
