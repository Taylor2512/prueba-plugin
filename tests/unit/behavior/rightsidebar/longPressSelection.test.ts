/**
 * Reconocedor de pulsación prolongada (`longPressSelection`).
 *
 * Cubre el umbral de duración, la tolerancia de movimiento (cancelación) y la
 * señal de consumo que evita que el click sintético posterior repita la
 * selección con su propia semántica.
 */
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  useLongPressRecognizer,
  DEFAULT_LONG_PRESS_DURATION_MS,
  DEFAULT_LONG_PRESS_MOVE_TOLERANCE_PX,
  type LongPressPointerLikeEvent,
} from '../../../../src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/longPressSelection';

const puntero = (overrides: Partial<LongPressPointerLikeEvent> = {}): LongPressPointerLikeEvent => ({
  pointerId: 1,
  pointerType: 'mouse',
  button: 0,
  clientX: 100,
  clientY: 100,
  ...overrides,
});

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useLongPressRecognizer', () => {
  it('dispara onLongPress tras el umbral sin movimiento', () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() => useLongPressRecognizer({ onLongPress }));

    act(() => result.current.onPointerDown(puntero()));
    expect(onLongPress).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(DEFAULT_LONG_PRESS_DURATION_MS));
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('no dispara antes del umbral', () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() => useLongPressRecognizer({ onLongPress }));

    act(() => result.current.onPointerDown(puntero()));
    act(() => vi.advanceTimersByTime(DEFAULT_LONG_PRESS_DURATION_MS - 1));
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('un movimiento dentro de la tolerancia no cancela', () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() => useLongPressRecognizer({ onLongPress }));

    act(() => result.current.onPointerDown(puntero({ clientX: 100, clientY: 100 })));
    act(() =>
      result.current.onPointerMove(
        puntero({ clientX: 100 + DEFAULT_LONG_PRESS_MOVE_TOLERANCE_PX - 1, clientY: 100 }),
      ),
    );
    act(() => vi.advanceTimersByTime(DEFAULT_LONG_PRESS_DURATION_MS));
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('un movimiento por encima de la tolerancia cancela el reconocimiento', () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() => useLongPressRecognizer({ onLongPress }));

    act(() => result.current.onPointerDown(puntero({ clientX: 100, clientY: 100 })));
    act(() =>
      result.current.onPointerMove(
        puntero({ clientX: 100 + DEFAULT_LONG_PRESS_MOVE_TOLERANCE_PX + 20, clientY: 100 }),
      ),
    );
    act(() => vi.advanceTimersByTime(DEFAULT_LONG_PRESS_DURATION_MS));
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('soltar antes del umbral cancela: es un click corto, no un long-press', () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() => useLongPressRecognizer({ onLongPress }));

    act(() => result.current.onPointerDown(puntero()));
    act(() => vi.advanceTimersByTime(DEFAULT_LONG_PRESS_DURATION_MS / 2));
    act(() => result.current.onPointerUp(puntero()));
    act(() => vi.advanceTimersByTime(DEFAULT_LONG_PRESS_DURATION_MS));
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('pointercancel limpia el temporizador', () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() => useLongPressRecognizer({ onLongPress }));

    act(() => result.current.onPointerDown(puntero()));
    act(() => result.current.onPointerCancel(puntero()));
    act(() => vi.advanceTimersByTime(DEFAULT_LONG_PRESS_DURATION_MS));
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('disabled impide que el gesto arranque', () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() => useLongPressRecognizer({ onLongPress, disabled: true }));

    act(() => result.current.onPointerDown(puntero()));
    act(() => vi.advanceTimersByTime(DEFAULT_LONG_PRESS_DURATION_MS));
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('un botón secundario del ratón no arranca el reconocimiento', () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() => useLongPressRecognizer({ onLongPress }));

    act(() => result.current.onPointerDown(puntero({ button: 2 })));
    act(() => vi.advanceTimersByTime(DEFAULT_LONG_PRESS_DURATION_MS));
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('consumeLongPress sólo es true una vez tras disparar, y luego vuelve a false', () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() => useLongPressRecognizer({ onLongPress }));

    expect(result.current.consumeLongPress()).toBe(false);

    act(() => result.current.onPointerDown(puntero()));
    act(() => vi.advanceTimersByTime(DEFAULT_LONG_PRESS_DURATION_MS));

    expect(result.current.consumeLongPress()).toBe(true);
    expect(result.current.consumeLongPress()).toBe(false);
  });

  it('un pointerId distinto no cancela ni suelta un gesto en curso', () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() => useLongPressRecognizer({ onLongPress }));

    act(() => result.current.onPointerDown(puntero({ pointerId: 1 })));
    // Un move/up de OTRO puntero (p. ej. touch multi-dedo) no debe afectar.
    act(() => result.current.onPointerMove(puntero({ pointerId: 2, clientX: 500, clientY: 500 })));
    act(() => result.current.onPointerUp(puntero({ pointerId: 2 })));
    act(() => vi.advanceTimersByTime(DEFAULT_LONG_PRESS_DURATION_MS));
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });

  it('desmontar durante el temporizador no dispara onLongPress', () => {
    const onLongPress = vi.fn();
    const { result, unmount } = renderHook(() => useLongPressRecognizer({ onLongPress }));

    act(() => result.current.onPointerDown(puntero()));
    unmount();
    act(() => vi.advanceTimersByTime(DEFAULT_LONG_PRESS_DURATION_MS));
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('un segundo pointerdown reinicia el reconocimiento (nuevo gesto)', () => {
    const onLongPress = vi.fn();
    const { result } = renderHook(() => useLongPressRecognizer({ onLongPress }));

    act(() => result.current.onPointerDown(puntero()));
    act(() => vi.advanceTimersByTime(DEFAULT_LONG_PRESS_DURATION_MS / 2));
    // Nuevo gesto: reinicia el reloj, así que el umbral vuelve a contar desde 0.
    act(() => result.current.onPointerDown(puntero()));
    act(() => vi.advanceTimersByTime(DEFAULT_LONG_PRESS_DURATION_MS / 2));
    expect(onLongPress).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(DEFAULT_LONG_PRESS_DURATION_MS / 2));
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });
});
