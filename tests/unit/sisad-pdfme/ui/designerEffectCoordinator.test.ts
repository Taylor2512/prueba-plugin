/**
 * COREUX-009 — Coordinador de efectos del Designer.
 *
 * Criterios: ningún efecto deja el body bloqueado, cancelar modal restaura
 * foco, y todas las suscripciones se limpian.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDesignerEffectCoordinator } from '@/sisad-pdfme/ui/components/Designer/shared/designerEffectCoordinator';

afterEach(() => {
  document.body.style.overflow = '';
  document.body.innerHTML = '';
});

describe('bloqueo de scroll del body', () => {
  it('bloquea y restaura el valor original', () => {
    document.body.style.overflow = 'auto';
    const coordinator = createDesignerEffectCoordinator();

    coordinator.lockBodyScroll('modal');
    expect(document.body.style.overflow).toBe('hidden');

    coordinator.unlockBodyScroll('modal');
    expect(document.body.style.overflow).toBe('auto');
  });

  it('con dos superficies, la primera en cerrarse NO desbloquea', () => {
    const coordinator = createDesignerEffectCoordinator();

    coordinator.lockBodyScroll('modal');
    coordinator.lockBodyScroll('drawer');
    coordinator.unlockBodyScroll('modal');

    expect(coordinator.isBodyLocked()).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');

    coordinator.unlockBodyScroll('drawer');
    expect(coordinator.isBodyLocked()).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });

  it('desbloquear dos veces con el mismo token es idempotente', () => {
    const coordinator = createDesignerEffectCoordinator();

    coordinator.lockBodyScroll('a');
    coordinator.lockBodyScroll('b');
    coordinator.unlockBodyScroll('a');
    coordinator.unlockBodyScroll('a');

    expect(coordinator.activeLockTokens()).toEqual(['b']);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('dispose libera el body aunque queden locks vivos', () => {
    const coordinator = createDesignerEffectCoordinator();

    coordinator.lockBodyScroll('modal');
    coordinator.lockBodyScroll('drawer');
    coordinator.dispose();

    expect(coordinator.isBodyLocked()).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });

  it('una limpieza que lanza no deja el body bloqueado', () => {
    const coordinator = createDesignerEffectCoordinator();

    coordinator.lockBodyScroll('modal');
    coordinator.register(() => {
      throw new Error('cleanup roto');
    });

    expect(() => coordinator.dispose()).not.toThrow();
    expect(document.body.style.overflow).toBe('');
  });
});

describe('foco', () => {
  const mountButton = (id: string) => {
    const button = document.createElement('button');
    button.id = id;
    document.body.appendChild(button);
    return button;
  };

  it('cancelar un modal devuelve el foco al disparador', () => {
    const trigger = mountButton('trigger');
    trigger.focus();
    const coordinator = createDesignerEffectCoordinator();

    coordinator.captureFocus();
    const inside = mountButton('modal-input');
    inside.focus();
    expect(document.activeElement).toBe(inside);

    inside.remove();
    coordinator.restoreFocus();

    expect(document.activeElement).toBe(trigger);
  });

  it('soporta modales anidados con una pila', () => {
    const first = mountButton('first');
    const second = mountButton('second');

    const coordinator = createDesignerEffectCoordinator();
    first.focus();
    coordinator.captureFocus();
    second.focus();
    coordinator.captureFocus();

    expect(coordinator.focusDepth()).toBe(2);

    coordinator.restoreFocus();
    expect(document.activeElement).toBe(second);
    coordinator.restoreFocus();
    expect(document.activeElement).toBe(first);
    expect(coordinator.focusDepth()).toBe(0);
  });

  it('no roba el foco si el objetivo ya no está en el DOM', () => {
    const removed = mountButton('removed');
    const survivor = mountButton('survivor');
    const coordinator = createDesignerEffectCoordinator();

    removed.focus();
    coordinator.captureFocus();
    removed.remove();
    survivor.focus();

    coordinator.restoreFocus();

    expect(document.activeElement).toBe(survivor);
  });

  it('restoreFocus sin captura previa no hace nada', () => {
    const coordinator = createDesignerEffectCoordinator();
    expect(() => coordinator.restoreFocus()).not.toThrow();
  });
});

describe('anuncios accesibles', () => {
  it('publica en una región aria-live', () => {
    const coordinator = createDesignerEffectCoordinator();

    coordinator.announce('3 campos seleccionados');
    const region = document.querySelector('[data-sisad-pdfme-announcer]');

    expect(region).not.toBeNull();
    expect(region?.getAttribute('aria-live')).toBe('polite');
    expect(region?.textContent).toBe('3 campos seleccionados');
  });

  it('permite elevar la urgencia y reutiliza una sola región', () => {
    const coordinator = createDesignerEffectCoordinator();

    coordinator.announce('a');
    coordinator.announce('b', 'assertive');

    const regions = document.querySelectorAll('[data-sisad-pdfme-announcer]');
    expect(regions).toHaveLength(1);
    expect(regions[0].getAttribute('aria-live')).toBe('assertive');
    expect(regions[0].textContent).toBe('b');
  });

  it('dispose retira la región del DOM', () => {
    const coordinator = createDesignerEffectCoordinator();

    coordinator.announce('hola');
    coordinator.dispose();

    expect(document.querySelector('[data-sisad-pdfme-announcer]')).toBeNull();
  });
});

describe('suscripciones', () => {
  it('dispose ejecuta todas las limpiezas registradas', () => {
    const coordinator = createDesignerEffectCoordinator();
    const first = vi.fn();
    const second = vi.fn();

    coordinator.register(first);
    coordinator.register(second);
    expect(coordinator.pendingCleanups()).toBe(2);

    coordinator.dispose();

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
    expect(coordinator.pendingCleanups()).toBe(0);
  });

  it('una limpieza que lanza no impide las demás', () => {
    const coordinator = createDesignerEffectCoordinator();
    const survivor = vi.fn();

    coordinator.register(() => {
      throw new Error('boom');
    });
    coordinator.register(survivor);
    coordinator.dispose();

    expect(survivor).toHaveBeenCalledTimes(1);
  });

  it('cancelar el registro evita la limpieza', () => {
    const coordinator = createDesignerEffectCoordinator();
    const cleanup = vi.fn();

    const unregister = coordinator.register(cleanup);
    unregister();
    coordinator.dispose();

    expect(cleanup).not.toHaveBeenCalled();
  });

  it('dispose es idempotente', () => {
    const coordinator = createDesignerEffectCoordinator();
    const cleanup = vi.fn();

    coordinator.register(cleanup);
    coordinator.dispose();
    coordinator.dispose();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});
