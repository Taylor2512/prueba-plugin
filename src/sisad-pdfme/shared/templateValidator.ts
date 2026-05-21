/**
 * TEMPLATE VALIDATOR — DocuSign-style pre-send validation
 *
 * Valida el template antes de generar solicitud o enviar.
 * No contiene reglas de negocio SISAD — solo reglas universales del documento.
 *
 * Reglas incluidas:
 *   - Campos sin destinatario (scope=recipient pero sin recipientId)
 *   - Campos de firma sin provider configurado
 *   - Campos fuera de los límites de la página
 *   - Nombres de campo duplicados en la misma página
 *   - Páginas sin campos cuando el template tiene destinatarios
 *   - Destinatarios sin campos requeridos
 *   - Campos ocultos pero marcados como requeridos
 *
 * El ValidationSeverity determina si se bloquea o solo se advierte.
 */

// ── Tipos ────────────────────────────────────────────────────────────────────

export type ValidationSeverity = 'error' | 'warning' | 'info';

export type ValidationCode =
  | 'FIELD_NO_RECIPIENT'
  | 'FIELD_SIGNATURE_NO_PROVIDER'
  | 'FIELD_OUT_OF_BOUNDS'
  | 'FIELD_NAME_DUPLICATE'
  | 'FIELD_HIDDEN_REQUIRED'
  | 'PAGE_NO_FIELDS'
  | 'RECIPIENT_NO_REQUIRED_FIELDS'
  | 'TEMPLATE_NO_RECIPIENTS'
  | 'FIELD_NAME_EMPTY';

export interface ValidationIssue {
  code: ValidationCode;
  severity: ValidationSeverity;
  message: string;
  /** Human-readable location: "Pág. 1 / Campo: firma_cliente" */
  location: string;
  /** schemaUid or schema name for navigation */
  schemaRef?: string;
  /** Page number (1-based) */
  pageNumber?: number;
  /** Schema field name */
  fieldName?: string;
  /** Recipient ID if relevant */
  recipientId?: string;
}

export interface ValidationResult {
  valid: boolean;
  /** Issues that block sending */
  errors: ValidationIssue[];
  /** Issues that are advisory */
  warnings: ValidationIssue[];
  /** Informational hints */
  infos: ValidationIssue[];
  /** Total count of all issues */
  issueCount: number;
}

// ── Input types (generic — no pdfme imports needed) ──────────────────────────

export interface ValidatableSchema {
  id: string;
  name?: string;
  type?: string;
  position?: { x: number; y: number };
  width?: number;
  height?: number;
  required?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  ownerRecipientId?: string;
  recipientId?: string;
  /** For signature schemas */
  signatureMode?: string;
  signatureProvider?: string;
  /** __designer meta */
  __designer?: {
    schemaUid?: string;
    recipientId?: string;
    assignment?: { scope?: string };
    signature?: { providerKey?: string; mode?: string };
    ownership?: { readonly?: boolean };
  };
}

export interface ValidatableRecipient {
  id: string;
  name?: string;
}

export interface ValidatablePageSize {
  width: number;
  height: number;
}

export interface ValidateTemplateInput {
  /** Pages of schemas (index = page number - 1) */
  schemasByPage: ValidatableSchema[][];
  /** Page sizes (same length as schemasByPage) */
  pageSizes?: ValidatablePageSize[];
  /** Configured recipients */
  recipients?: ValidatableRecipient[];
}

// ── Validator ────────────────────────────────────────────────────────────────

/**
 * Validates a template before sending/generating.
 * Returns a structured list of errors, warnings and infos.
 *
 * @example
 * const result = validateTemplate({ schemasByPage, pageSizes, recipients });
 * if (!result.valid) {
 *   console.error(result.errors);
 * }
 */
export function validateTemplate(input: ValidateTemplateInput): ValidationResult {
  const issues: ValidationIssue[] = [];
  const { schemasByPage, pageSizes = [], recipients = [] } = input;

  // ── Track names for duplicate detection ──
  const allSchemaNames: Map<string, { page: number; fieldName: string; count: number }> = new Map();

  // ── Per-page validation ───────────────────────────────────────────────────
  for (let pageIdx = 0; pageIdx < schemasByPage.length; pageIdx++) {
    const pageSchemas = schemasByPage[pageIdx] ?? [];
    const pageNumber = pageIdx + 1;
    const pageSize = pageSizes[pageIdx] ?? { width: Infinity, height: Infinity };

    // PAGE_NO_FIELDS — advisory only when there are recipients configured
    if (pageSchemas.length === 0 && recipients.length > 0) {
      issues.push({
        code: 'PAGE_NO_FIELDS',
        severity: 'warning',
        message: `La página ${pageNumber} no tiene campos configurados.`,
        location: `Pág. ${pageNumber}`,
        pageNumber,
      });
    }

    for (const schema of pageSchemas) {
      const fieldName = schema.name || '(sin nombre)';
      const schemaRef = schema.__designer?.schemaUid || schema.id;
      const loc = `Pág. ${pageNumber} / Campo: ${fieldName}`;

      // FIELD_NAME_EMPTY — warning
      if (!schema.name || !schema.name.trim()) {
        issues.push({
          code: 'FIELD_NAME_EMPTY',
          severity: 'warning',
          message: `Un campo en la página ${pageNumber} no tiene nombre.`,
          location: loc,
          pageNumber,
          schemaRef,
        });
      }

      // FIELD_NAME_DUPLICATE — error (breaks form JSON export)
      if (schema.name && schema.name.trim()) {
        const key = schema.name.trim().toLowerCase();
        const existing = allSchemaNames.get(key);
        if (existing) {
          existing.count++;
          if (existing.count === 2) {
            // Only emit once per duplicate name
            issues.push({
              code: 'FIELD_NAME_DUPLICATE',
              severity: 'error',
              message: `El nombre de campo "${schema.name}" está duplicado (aparece en la pág. ${existing.page} y pág. ${pageNumber}).`,
              location: loc,
              pageNumber,
              schemaRef,
              fieldName,
            });
          }
        } else {
          allSchemaNames.set(key, { page: pageNumber, fieldName, count: 1 });
        }
      }

      // FIELD_NO_RECIPIENT — for recipient-scoped schemas without an owner
      const isRecipientScoped =
        schema.__designer?.assignment?.scope === 'recipient' ||
        !!(schema.ownerRecipientId || schema.recipientId || schema.__designer?.recipientId);
      const hasRecipient = !!(
        schema.ownerRecipientId ||
        schema.recipientId ||
        schema.__designer?.recipientId
      );
      if (isRecipientScoped && !hasRecipient && !schema.readOnly) {
        issues.push({
          code: 'FIELD_NO_RECIPIENT',
          severity: 'warning',
          message: `El campo "${fieldName}" está marcado como de destinatario pero no tiene destinatario asignado.`,
          location: loc,
          pageNumber,
          schemaRef,
          fieldName,
        });
      }

      // FIELD_SIGNATURE_NO_PROVIDER — error for signature fields
      const isSignature = schema.type === 'signature' ||
        schema.__designer?.signature?.mode !== undefined;
      const hasProvider = !!(
        schema.signatureProvider ||
        schema.__designer?.signature?.providerKey ||
        schema.__designer?.signature?.mode
      );
      if (isSignature && !hasProvider) {
        issues.push({
          code: 'FIELD_SIGNATURE_NO_PROVIDER',
          severity: 'error',
          message: `El campo de firma "${fieldName}" no tiene proveedor de firma configurado.`,
          location: loc,
          pageNumber,
          schemaRef,
          fieldName,
        });
      }

      // FIELD_OUT_OF_BOUNDS — warning (can still render but user should know)
      if (
        schema.position &&
        typeof schema.width === 'number' &&
        typeof schema.height === 'number' &&
        pageSize.width !== Infinity
      ) {
        const { x, y } = schema.position;
        if (
          x < 0 || y < 0 ||
          x + schema.width > pageSize.width + 0.1 ||
          y + schema.height > pageSize.height + 0.1
        ) {
          issues.push({
            code: 'FIELD_OUT_OF_BOUNDS',
            severity: 'warning',
            message: `El campo "${fieldName}" está (parcialmente) fuera de los límites de la página ${pageNumber}.`,
            location: loc,
            pageNumber,
            schemaRef,
            fieldName,
          });
        }
      }

      // FIELD_HIDDEN_REQUIRED — error (can never be filled)
      const isHidden = (schema as ValidatableSchema & { hidden?: boolean }).hidden === true;
      if (isHidden && schema.required) {
        issues.push({
          code: 'FIELD_HIDDEN_REQUIRED',
          severity: 'error',
          message: `El campo "${fieldName}" está oculto pero marcado como requerido — nunca podrá completarse.`,
          location: loc,
          pageNumber,
          schemaRef,
          fieldName,
        });
      }
    }
  }

  // ── Template-level validation ─────────────────────────────────────────────

  // TEMPLATE_NO_RECIPIENTS — info (valid for simple templates without flow)
  if (recipients.length === 0 && schemasByPage.some((p) => p.length > 0)) {
    issues.push({
      code: 'TEMPLATE_NO_RECIPIENTS',
      severity: 'info',
      message: 'El template no tiene destinatarios configurados. Los campos serán de alcance global.',
      location: 'Template',
    });
  }

  // RECIPIENT_NO_REQUIRED_FIELDS — advisory per recipient
  if (recipients.length > 0) {
    for (const recipient of recipients) {
      const hasRequiredField = schemasByPage.flat().some(
        (s) =>
          s.required &&
          (
            s.ownerRecipientId === recipient.id ||
            s.recipientId === recipient.id ||
            s.__designer?.recipientId === recipient.id
          ),
      );
      if (!hasRequiredField) {
        const name = recipient.name || recipient.id;
        issues.push({
          code: 'RECIPIENT_NO_REQUIRED_FIELDS',
          severity: 'info',
          message: `El destinatario "${name}" no tiene campos requeridos asignados.`,
          location: `Destinatario: ${name}`,
          recipientId: recipient.id,
        });
      }
    }
  }

  // ── Build result ──────────────────────────────────────────────────────────
  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const infos = issues.filter((i) => i.severity === 'info');

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    infos,
    issueCount: issues.length,
  };
}

/**
 * Quick check — returns true if the template has no blocking errors.
 * Useful for enabling/disabling the "Send" button.
 */
export function isTemplateValid(input: ValidateTemplateInput): boolean {
  return validateTemplate(input).valid;
}
