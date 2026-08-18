/**
 * Contrato de propagación del idioma por el runtime UI.
 *
 * Cierra la parte del defecto que no se ve en los diccionarios: aunque el
 * diccionario español estuviera completo, el idioma podía no llegar al árbol
 * React, o llegar sin validar. Concretamente:
 *
 * - `BaseUIClass` guardaba `options.lang` tal cual, así que un locale no
 *   soportado dejaba a `getDict` sin diccionario resoluble.
 * - `resolveSisadPdfmeConfig` declaraba su propio default (`app.locale || 'es'`),
 *   una segunda autoridad que podía divergir de `DEFAULT_LANG`.
 * - `updateOptions({ lang })` debe cambiar la presentación SIN tocar el template
 *   ni los inputs: el idioma de la interfaz no es dato del documento.
 */
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import AppContextProvider from '../../../../src/sisad-pdfme/ui/components/AppContextProvider';
import { I18nContext } from '../../../../src/sisad-pdfme/ui/contexts';
import { DEFAULT_LANG } from '../../../../src/sisad-pdfme/ui/constants';
import { resolveSisadPdfmeConfig } from '../../../../src/sisad-pdfme/config/resolveSisadPdfmeConfig';
import { BaseUIClass } from '../../../../src/sisad-pdfme/ui/class';
import { getDefaultFont, pluginRegistry, BLANK_A4_PDF } from '../../../../src/sisad-pdfme/common';
import type { Dict, Lang, Template, UIOptions } from '../../../../src/sisad-pdfme/common';
import React from 'react';

/**
 * jsdom no implementa `ResizeObserver` y `BaseUIClass` crea uno como campo de
 * instancia. Se stubea aquí porque lo que se prueba es la resolución de idioma,
 * no el redimensionado.
 */
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

const template: Template = {
  basePdf: BLANK_A4_PDF,
  schemas: [
    [
      {
        name: 'firma_1',
        type: 'signature',
        position: { x: 10, y: 10 },
        width: 40,
        height: 15,
      },
    ],
  ],
} as unknown as Template;

/** Subclase mínima que expone el idioma resuelto por `BaseUIClass`. */
class LangProbe extends BaseUIClass {
  protected render(): void {
    // El contrato bajo prueba es la resolución de idioma, no el árbol React.
  }

  public readLang(): Lang {
    return this.getLang();
  }
}

const createProbe = (options: UIOptions = {}) => {
  const domContainer = document.createElement('div');
  document.body.appendChild(domContainer);
  return new LangProbe({ domContainer, template, options });
};

/** Lee una key del diccionario efectivo publicado por `AppContextProvider`. */
const Probe = ({ dictKey }: { dictKey: keyof Dict }) => {
  const translate = React.useContext(I18nContext);
  return <span data-testid="value">{translate(dictKey)}</span>;
};

const renderWithLang = (lang: Lang, options: UIOptions = {}, dictKey: keyof Dict = 'schemaTypes.fullName') => {
  // Se lee del contenedor devuelto por este render, no del `document` global:
  // varios renders por test dejarían múltiples nodos con el mismo testid.
  const { container } = render(
    <AppContextProvider
      lang={lang}
      font={getDefaultFont()}
      plugins={pluginRegistry({})}
      options={options}
    >
      <Probe dictKey={dictKey} />
    </AppContextProvider>,
  );
  return container.querySelector('[data-testid="value"]')?.textContent;
};

describe('BaseUIClass: autoridad del idioma', () => {
  it('sin lang explícito usa DEFAULT_LANG (español)', () => {
    expect(createProbe().readLang()).toBe('es');
    expect(createProbe().readLang()).toBe(DEFAULT_LANG);
  });

  it('un lang explícito del host gana sobre el default', () => {
    expect(createProbe({ lang: 'en' }).readLang()).toBe('en');
  });

  it('rechaza explícitamente un lang no soportado en vez de degradar en silencio', () => {
    // La API pública valida `options.lang` contra el contrato `Lang` en
    // `checkUIProps`. Se documenta aquí porque es MÁS estricto que un fallback:
    // el host se entera del locale inválido en el borde, no con media interfaz
    // sin traducir. El fallback tolerante vive en la capa declarativa, donde
    // `app.locale` es un string libre (ver el bloque de configuración).
    expect(() => createProbe({ lang: 'pt' as unknown as Lang })).toThrow(/options\.lang/);
  });

  it('updateOptions cambia el idioma sin perder el template', () => {
    const probe = createProbe();
    expect(probe.readLang()).toBe('es');

    probe.updateOptions({ lang: 'en' });

    expect(probe.readLang()).toBe('en');
    // El documento no es dato de presentación: sigue intacto.
    expect(probe.getTemplate().schemas[0]).toHaveLength(1);
    expect(probe.getTemplate().schemas[0][0].name).toBe('firma_1');
    expect(probe.getTemplate().schemas[0][0].type).toBe('signature');
  });

  it('updateOptions conserva las opciones previas al cambiar solo el idioma', () => {
    const probe = createProbe({ lang: 'en', labels: { cancel: 'Persist' } });
    probe.updateOptions({ lang: 'fr' });

    expect(probe.readLang()).toBe('fr');
    expect(probe.getOptions().labels).toEqual({ cancel: 'Persist' });
  });
});

describe('AppContextProvider: diccionario efectivo', () => {
  it('publica español cuando el idioma es el default', () => {
    expect(renderWithLang(DEFAULT_LANG)).toBe('Nombre completo');
  });

  it('publica inglés cuando el host lo declara explícitamente', () => {
    expect(renderWithLang('en')).toBe('Full name');
  });

  it('options.labels sobrescribe una key sin cambiar el idioma base', () => {
    expect(renderWithLang('en', { labels: { cancel: 'Persist' } }, 'cancel')).toBe('Persist');
    expect(renderWithLang('en', { labels: { cancel: 'Persist' } }, 'close')).toBe('Close');
  });

  it('no mezcla idiomas: con lang inglés ninguna key cae al español', () => {
    expect(renderWithLang('en', {}, 'schemaTypes.emailAddress')).toBe('Email address');
    expect(renderWithLang('en', {}, 'catalog.noResults')).toBe('No results');
    expect(renderWithLang('en', {}, 'listView.allTypes')).toBe('All types');
  });
});

describe('configuración declarativa: una sola autoridad', () => {
  it('sin app.locale hereda DEFAULT_LANG', () => {
    const resolved = resolveSisadPdfmeConfig({});
    expect(resolved.runtimeOptions.lang).toBe(DEFAULT_LANG);
  });

  it('respeta un app.locale soportado', () => {
    const resolved = resolveSisadPdfmeConfig({ app: { locale: 'en' } });
    expect(resolved.runtimeOptions.lang).toBe('en');
  });

  it('valida app.locale y no propaga un locale no soportado', () => {
    // `app.locale` es un string libre del host: antes llegaba sin validar a
    // `getDict`, que devolvía el diccionario del default silenciosamente.
    const resolved = resolveSisadPdfmeConfig({ app: { locale: 'pt-BR' } });
    expect(resolved.runtimeOptions.lang).toBe(DEFAULT_LANG);
  });
});
