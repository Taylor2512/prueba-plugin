/**
 * Contrato de localización canónica de SISAD-PDFME.
 *
 * Los defectos que cierra esta suite no eran de traducción, sino de autoridad:
 *
 * 1. `DEFAULT_LANG` valía `'en'` mientras TODAS las etiquetas de los schemas
 *    built-in estaban escritas en español fijo. Una instancia sin configuración
 *    mezclaba los dos idiomas en la misma pantalla.
 * 2. La capa de configuración declarativa tenía su propio default
 *    (`app.locale || 'es'`), así que existían dos autoridades del idioma por
 *    defecto que podían divergir, y `app.locale` es un `string` libre que llegaba
 *    a `getDict` sin validar.
 * 3. El catálogo mostraba el identificador técnico (`fullName`, `multiVariableText`)
 *    porque la etiqueta visible se tomaba de la clave del registro de plugins.
 * 4. `multiVariableText` nacía con un literal inglés dentro del `defaultSchema`,
 *    que terminaba siendo CONTENIDO DEL DOCUMENTO.
 *
 * Reglas verificadas aquí: identity != presentation, y UI translation !=
 * document data.
 */
import { describe, expect, it } from 'vitest';
import { DEFAULT_LANG } from '../../../../../src/sisad-pdfme/ui/constants';
import {
  SUPPORTED_LANGS,
  getDict,
  resolveLang,
  resolveSchemaCategoryLabel,
  resolveSchemaTypeLabel,
  type Translate,
} from '../../../../../src/sisad-pdfme/ui/i18n';
import {
  getCatalogLabel,
  getSchemaStateLabel,
  getSchemaTypeLabel,
  getSignatureModeLabel,
} from '../../../../../src/sisad-pdfme/ui/components/Designer/shared/designerLabels';
import { applyLocalizedSchemaDefaults } from '../../../../../src/sisad-pdfme/schemas/localizedDefaults';
import { Dict as DictSchema } from '../../../../../src/sisad-pdfme/common/schema';
import type { Dict, Lang } from '../../../../../src/sisad-pdfme/common/types';

/** Traducción equivalente a la que publica `I18nContext` para un idioma dado. */
const translateFor = (lang: Lang): Translate => {
  const dict = getDict(lang);
  return (key: keyof Dict) => dict[key];
};

/**
 * Réplica del merge que hace `AppContextProvider`: diccionario del idioma y
 * después `options.labels` encima.
 */
const translateWith = (lang: Lang, labels: Partial<Dict>): Translate => {
  const dict = { ...getDict(lang), ...labels };
  return (key: keyof Dict) => dict[key] as string;
};

describe('A. idioma por defecto', () => {
  it('el default del runtime es español', () => {
    expect(DEFAULT_LANG).toBe('es');
  });

  it('el diccionario por defecto resuelve en español, no en inglés', () => {
    expect(getDict(DEFAULT_LANG)['schemaTypes.fullName']).toBe('Nombre completo');
    expect(getDict(DEFAULT_LANG).cancel).toBe('Cancelar');
  });
});

describe('B. resolución de idioma', () => {
  it('respeta un idioma soportado declarado por el host', () => {
    expect(resolveLang('en')).toBe('en');
    expect(resolveLang('fr')).toBe('fr');
  });

  it('cae en DEFAULT_LANG ante un idioma no resoluble', () => {
    expect(resolveLang('pt')).toBe(DEFAULT_LANG);
    expect(resolveLang('')).toBe(DEFAULT_LANG);
    expect(resolveLang(undefined)).toBe(DEFAULT_LANG);
    expect(resolveLang(null)).toBe(DEFAULT_LANG);
    expect(resolveLang(42)).toBe(DEFAULT_LANG);
    expect(resolveLang({ lang: 'en' })).toBe(DEFAULT_LANG);
  });

  it('getDict devuelve el diccionario pedido y nunca uno mezclado', () => {
    expect(getDict('es')['schemaTypes.company']).toBe('Empresa');
    expect(getDict('en')['schemaTypes.company']).toBe('Company');
  });
});

describe('C. paridad de diccionarios', () => {
  const requiredKeys = Object.keys(DictSchema.shape) as Array<keyof Dict>;

  it('declara los 11 idiomas del contrato Lang', () => {
    expect(SUPPORTED_LANGS.sort()).toEqual(
      ['ar', 'de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'pl', 'th', 'zh'].sort(),
    );
  });

  it.each(SUPPORTED_LANGS)('el diccionario %s cumple el contrato Dict completo', (lang) => {
    const dict = getDict(lang);
    // Valida contra el propio Zod: una key ausente o no-string falla aquí en vez
    // de degradar en tiempo de render a `undefined` en pantalla.
    expect(() => DictSchema.parse(dict)).not.toThrow();

    const missing = requiredKeys.filter((key) => {
      const value = dict[key];
      return typeof value !== 'string' || value.trim() === '';
    });
    expect(missing).toEqual([]);
  });

  it('no deja etiquetas de tipo sin traducir respecto al español', () => {
    // Cada idioma debe tener su propia etiqueta para un tipo con nombre común;
    // si coincidiera con el español en TODOS los idiomas sería copia sin traducir.
    const labels = SUPPORTED_LANGS.map((lang) => getDict(lang)['schemaTypes.signature']);
    expect(new Set(labels).size).toBeGreaterThan(1);
  });
});

describe('D. precedencia: options.labels > idioma explícito > DEFAULT_LANG', () => {
  it('options.labels sobrescribe únicamente su key y conserva el idioma base', () => {
    const translate = translateWith('en', { cancel: 'Persist' });

    expect(translate('cancel')).toBe('Persist');
    // El resto del diccionario sigue siendo inglés, no una mezcla con español.
    expect(translate('close')).toBe(getDict('en').close);
    expect(translate('schemaTypes.fullName')).toBe('Full name');
  });

  it('un idioma explícito gana sobre el default', () => {
    expect(translateFor('en')('schemaTypes.fullName')).toBe('Full name');
    expect(translateFor(DEFAULT_LANG)('schemaTypes.fullName')).toBe('Nombre completo');
  });
});

describe('E. identity != presentation en el catálogo de schemas', () => {
  const technicalTypes = [
    'text',
    'number',
    'fullName',
    'emailAddress',
    'company',
    'title',
    'multiVariableText',
    'signature',
    'initials',
    'dateSigned',
    'dateTime',
    'date',
    'time',
  ];

  it('el español muestra la presentación esperada de la captura', () => {
    const t = translateFor('es');
    expect(technicalTypes.map((type) => getSchemaTypeLabel(t, type))).toEqual([
      'Texto',
      'Número',
      'Nombre completo',
      'Correo electrónico',
      'Empresa',
      'Cargo',
      'Texto dinámico',
      'Firma',
      'Iniciales',
      'Fecha de firma',
      'Fecha y hora',
      'Fecha',
      'Hora',
    ]);
  });

  it('el inglés muestra el mismo catálogo traducido', () => {
    const t = translateFor('en');
    expect(technicalTypes.map((type) => getSchemaTypeLabel(t, type))).toEqual([
      'Text',
      'Number',
      'Full name',
      'Email address',
      'Company',
      'Job title',
      'Dynamic text',
      'Signature',
      'Initials',
      'Date signed',
      'Date and time',
      'Date',
      'Time',
    ]);
  });

  it('ninguna etiqueta visible expone el identificador técnico', () => {
    const es = translateFor('es');
    const en = translateFor('en');
    technicalTypes.forEach((type) => {
      expect(getSchemaTypeLabel(es, type)).not.toBe(type);
      expect(getSchemaTypeLabel(en, type)).not.toBe(type);
    });
  });

  it('los identificadores técnicos no se traducen ni se renombran', () => {
    // El resolver recibe el `type` y NUNCA lo devuelve modificado hacia el schema:
    // sólo produce presentación. Este test fija el contrato de identidad.
    const t = translateFor('es');
    expect(getSchemaTypeLabel(t, 'fullName')).toBe('Nombre completo');
    expect(technicalTypes).toContain('fullName');
    expect(technicalTypes).toContain('emailAddress');
    expect(technicalTypes).not.toContain('nombreCompleto');
    expect(technicalTypes).not.toContain('correoElectronico');
  });

  it('acepta el casing histórico del type sin alterar la identidad', () => {
    const t = translateFor('es');
    expect(getSchemaTypeLabel(t, 'multivariabletext')).toBe('Texto dinámico');
    expect(getSchemaTypeLabel(t, 'datetime')).toBe('Fecha y hora');
    expect(getSchemaTypeLabel(t, 'dropdown')).toBe('Desplegable');
  });

  it('no traduce los nombres propios de los estándares de código de barras', () => {
    const es = translateFor('es');
    const en = translateFor('en');
    expect(getSchemaTypeLabel(es, 'qrcode')).toBe('QR Code');
    expect(getSchemaTypeLabel(en, 'qrcode')).toBe('QR Code');
    expect(getSchemaTypeLabel(es, 'gs1datamatrix')).toBe('GS1 DataMatrix');
  });
});

describe('F. plugins del host', () => {
  it('conserva la etiqueta aportada por un plugin custom', () => {
    const t = translateFor('es');
    expect(getCatalogLabel(t, 'Mi widget', 'myWidget', 'custom')).toBe('Mi widget');
  });

  it('nunca muestra undefined ni vacío para un tipo desconocido', () => {
    const t = translateFor('es');
    const label = getSchemaTypeLabel(t, 'host_custom_widget');
    expect(label).toBe('Host Custom Widget');
    expect(label).not.toContain('undefined');

    expect(getCatalogLabel(t, '', '', 'builtin')).toBe('Campo');
  });

  it('un tipo desconocido no se inventa traducción por idioma', () => {
    expect(getSchemaTypeLabel(translateFor('es'), 'myWidget')).toBe(
      getSchemaTypeLabel(translateFor('en'), 'myWidget'),
    );
  });
});

describe('G. estados y modos de firma del inspector', () => {
  it('traduce los estados de schema', () => {
    expect(getSchemaStateLabel(translateFor('es'), 'pending')).toBe('Pendiente');
    expect(getSchemaStateLabel(translateFor('en'), 'pending')).toBe('Pending');
  });

  it('resuelve los alias históricos de estado', () => {
    expect(getSchemaStateLabel(translateFor('es'), 'ok')).toBe('Listo');
    expect(getSchemaStateLabel(translateFor('en'), 'success')).toBe('Completed');
  });

  it('traduce los métodos de adquisición de firma', () => {
    expect(getSignatureModeLabel(translateFor('es'), 'p12')).toBe('Certificado P12');
    expect(getSignatureModeLabel(translateFor('en'), 'p12')).toBe('P12 certificate');
  });
});

describe('H. categorías del catálogo', () => {
  it('traduce la etiqueta visible conservando la key de agrupación', () => {
    expect(resolveSchemaCategoryLabel(translateFor('es'), 'Destinatario')).toBe('Destinatario');
    expect(resolveSchemaCategoryLabel(translateFor('en'), 'Destinatario')).toBe('Recipient');
    expect(resolveSchemaCategoryLabel(translateFor('en'), 'QR y Códigos')).toBe('QR and barcodes');
  });

  it('devuelve tal cual una categoría declarada por el host', () => {
    expect(resolveSchemaCategoryLabel(translateFor('en'), 'Mis campos')).toBe('Mis campos');
  });
});

describe('I. multiVariableText: contenido inicial vs dato del documento', () => {
  const template = {
    type: 'multiVariableText',
    text: '',
    __i18nDefaults: { text: 'schemas.mvt.defaultContent' as keyof Dict },
  };

  it('un schema nuevo nace con el contenido en el idioma activo', () => {
    const es = applyLocalizedSchemaDefaults(template, translateFor('es'));
    expect(es.text).toBe('Escriba el texto aquí usando {} para las variables');

    const en = applyLocalizedSchemaDefaults(template, translateFor('en'));
    expect(en.text).toBe('Add text here using {} for variables');
  });

  it('elimina el marcador para que no se persista en el documento', () => {
    const created = applyLocalizedSchemaDefaults(template, translateFor('es'));
    expect(created).not.toHaveProperty('__i18nDefaults');
  });

  it('NO reescribe el contenido de un schema existente al cambiar de idioma', () => {
    // Un documento histórico puede contener el texto inglés porque así se creó o
    // porque lo escribió la persona usuaria: cambiar el idioma de la UI no debe
    // mutarlo.
    const persisted = {
      type: 'multiVariableText',
      text: 'Add text here using {} for variables',
    };

    expect(applyLocalizedSchemaDefaults(persisted, translateFor('es'))).toEqual(persisted);
    expect(applyLocalizedSchemaDefaults(persisted, translateFor('es')).text).toBe(
      'Add text here using {} for variables',
    );
  });

  it('un valor explícito del host gana sobre el default localizado', () => {
    const withHostValue = { ...template, text: 'Texto del host' };
    expect(applyLocalizedSchemaDefaults(withHostValue, translateFor('en')).text).toBe(
      'Texto del host',
    );
  });

  it('no toca datos del usuario ni otros campos', () => {
    const withUserData = {
      ...template,
      content: '{"nombre":"Ada Lovelace"}',
      name: 'campo_1',
    };
    const created = applyLocalizedSchemaDefaults(withUserData, translateFor('es'));
    expect(created.content).toBe('{"nombre":"Ada Lovelace"}');
    expect(created.name).toBe('campo_1');
    expect(created.type).toBe('multiVariableText');
  });
});
