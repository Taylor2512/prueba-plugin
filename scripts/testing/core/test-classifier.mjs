import { isBrowserSpec } from './test-inventory.mjs';

/**
 * Reglas de smell.
 *
 * Fusiona las dos baterías que existían por separado (`test-quality/audit` y
 * `test-suite/audit`) y resuelve sus desacuerdos: donde una marcaba HIGH y la
 * otra MEDIUM el mismo patrón, gana el criterio de si el smell puede producir
 * un FALSO VERDE. Un test que se salta o que muta el DOM miente; uno que usa
 * `.nth()` sólo es frágil.
 */
const REGLAS = [
  {
    code: 'skipped-tests',
    severity: 'HIGH',
    test: (s) => /\b(?:test|it|describe)\.skip\s*\(/.test(s),
    detail: 'Marcadores .skip: el caso no se ejecuta y el gate sigue verde.',
  },
  {
    code: 'fixme-tests',
    severity: 'HIGH',
    test: (s) => /\btest\.fixme\s*\(/.test(s),
    detail: 'Marcadores .fixme: fallo conocido silenciado.',
  },
  {
    code: 'todo-tests',
    severity: 'MEDIUM',
    test: (s) => /\b(?:test|it)\.todo\s*\(/.test(s),
    detail: 'Marcadores .todo sin implementación.',
  },
  {
    code: 'test-file-without-expect',
    severity: 'HIGH',
    // Un spec puede delegar sus assertions en un helper de `tests/support`
    // (`esperarValores`, `abrirForm`…). Exigir `expect(` literal marcaba como
    // roto justo al código que centraliza las comprobaciones.
    test: (s) =>
      /\b(?:test|it)(?:\.\w+)?\s*\(/.test(s) &&
      !/\bexpect\s*\(/.test(s) &&
      !/from\s+['"][^'"]*support\//.test(s),
    detail: 'Casos declarados sin assertion propia ni helper de assertions.',
  },
  {
    code: 'fixed-wait',
    severity: 'MEDIUM',
    test: (s) => /\bwaitForTimeout\s*\(/.test(s),
    detail: 'waitForTimeout: usar auto-wait y assertions web-first.',
  },
  {
    code: 'network-idle-wait',
    severity: 'MEDIUM',
    test: (s) => /waitForLoadState\s*\(\s*['"`]networkidle/.test(s),
    detail: 'networkidle es inestable con polling o websockets; esperar la superficie.',
  },
  {
    code: 'manual-visibility-assertion',
    severity: 'MEDIUM',
    test: (s) => /expect\s*\(\s*await\s+[^)]*\.isVisible\s*\(\s*\)\s*\)/.test(s),
    detail: 'expect(await isVisible()) no reintenta; usar expect(locator).toBeVisible().',
  },
  {
    code: 'hardcoded-base-url',
    severity: 'HIGH',
    test: (s) => /page\.goto\s*\(\s*['"`]https?:\/\//.test(s),
    detail: 'URL absoluta en el spec: ignora baseURL y rompe fuera del puerto por defecto.',
  },
  {
    code: 'generic-test-title',
    severity: 'HIGH',
    titles: true,
    test: (title) => /^(test|test\s*\d+|stable test|spec|smoke|prueba\s*\d*)$/i.test(title.trim()),
    detail: 'Título sin comportamiento observable.',
  },
];

const REGLAS_NAVEGADOR = [
  {
    code: 'direct-dom-mutation',
    severity: 'CRITICAL',
    test: (s) =>
      /page\.evaluate[\s\S]{0,500}?(?:\.value\s*=(?!=)|textContent\s*=(?!=)|innerText\s*=(?!=)|innerHTML\s*=(?!=)|dispatchEvent)/.test(
        s,
      ),
    detail: 'La prueba fabrica el resultado mutando el DOM en vez de interactuar.',
  },
  {
    code: 'global-page-keyboard',
    severity: 'MEDIUM',
    test: (s) => /\bpage\.keyboard\.(?:type|insertText|press)\s*\(/.test(s),
    detail: 'Teclado global: escribe en el foco actual, no necesariamente en el campo bajo prueba.',
  },
  {
    code: 'generated-css-selector',
    severity: 'MEDIUM',
    test: (s) => /['"`][^'"`]*(?:css-dev-only-do-not-override|ant-[a-z-]+-[a-z0-9]{5,})/.test(s),
    detail: 'Selector acoplado a clases generadas por Ant Design.',
  },
  {
    code: 'explicit-any',
    severity: 'LOW',
    test: (s) => /:\s*any\b|as\s+any\b/.test(s),
    detail: 'any explícito en un spec de navegador.',
  },
];

/** Aplica las reglas a un item de inventario y devuelve sus hallazgos. */
export const classify = (item) => {
  const findings = [];
  const push = (code, severity, detail) =>
    findings.push({ code, severity, path: item.path, detail });

  for (const regla of REGLAS) {
    if (regla.titles) {
      for (const title of item.titles) {
        if (regla.test(title)) push(regla.code, regla.severity, `${regla.detail} → "${title}"`);
      }
      continue;
    }
    if (regla.test(item.source)) push(regla.code, regla.severity, regla.detail);
  }

  if (isBrowserSpec(item.path)) {
    for (const regla of REGLAS_NAVEGADOR) {
      if (regla.test(item.source)) push(regla.code, regla.severity, regla.detail);
    }
  }

  if (/^tests\/[^/]+\.(?:spec|test)\.[cm]?[jt]sx?$/.test(item.path)) {
    push('unclassified-root-test', 'HIGH', 'Test suelto en la raíz de tests/ sin capa ni dominio.');
  }
  if (item.layer === 'SIN_CLASIFICAR') {
    push('unclassified-layer', 'HIGH', 'El archivo no pertenece a ninguna capa canónica.');
  }
  if (item.layer === 'E2E' && item.titles.length > 15) {
    push(
      'oversized-e2e-spec',
      'MEDIUM',
      `${item.titles.length} casos en un solo spec: dividir por responsabilidad.`,
    );
  }

  return findings;
};

export const ORDEN_SEVERIDAD = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
