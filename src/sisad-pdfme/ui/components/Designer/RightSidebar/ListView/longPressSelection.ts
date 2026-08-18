/**
 * longPressSelection — reconocedor de pulsación prolongada para ListView.
 *
 * Aísla la lógica de "mantener pulsado para entrar a multiselección" del
 * componente visual, así puede probarse con temporizadores falsos sin montar
 * React ni el DOM completo.
 *
 * Contrato:
 * - dispara `onLongPress` una sola vez tras `durationMs` sin que el puntero se
 *   haya movido más de `moveTolerancePx` desde el punto de bajada;
 * - cualquier movimiento por encima de la tolerancia CANCELA el reconocedor
 *   silenciosamente, dejando que el gesto siga su curso normal (click, drag
 *   del grip de reordenamiento, scroll);
 * - `consumeLongPress()` es la señal para el `onClick` posterior: si el
 *   reconocedor ya disparó, el click no debe repetir la selección con su
 *   propia semántica (reemplazar), porque el long-press ya la resolvió como
 *   alternar membresía;
 * - el timer se limpia en cada `pointerup`/`pointercancel`/`pointermove` fuera
 *   de tolerancia y al desmontar, así que no hay fugas de temporizadores.
 */
import { useEffect, useRef } from 'react';

/** Duración por defecto: perceptible como "mantener pulsado", no como click lento. */
export const DEFAULT_LONG_PRESS_DURATION_MS = 500;
/** Tolerancia por defecto: menor que el `distance` de activación de dnd-kit (10px). */
export const DEFAULT_LONG_PRESS_MOVE_TOLERANCE_PX = 6;

export type LongPressPointerLikeEvent = {
  pointerId: number;
  pointerType: string;
  button?: number;
  clientX: number;
  clientY: number;
};

export type UseLongPressRecognizerOptions = {
  /** Milisegundos de espera antes de considerar el gesto una pulsación larga. */
  durationMs?: number;
  /** Desplazamiento máximo, en px, antes de cancelar el reconocimiento. */
  moveTolerancePx?: number;
  /** Se invoca una sola vez cuando el gesto se reconoce como pulsación larga. */
  onLongPress: () => void;
  /** Desactiva el reconocedor sin desmontarlo (p. ej. fila bloqueada). */
  disabled?: boolean;
};

export type LongPressRecognizerHandlers = {
  onPointerDown: (event: LongPressPointerLikeEvent) => void;
  onPointerMove: (event: LongPressPointerLikeEvent) => void;
  onPointerUp: (event: LongPressPointerLikeEvent) => void;
  onPointerCancel: (event: LongPressPointerLikeEvent) => void;
  /** True (y consume) sólo si el pointerdown en curso ya disparó `onLongPress`. */
  consumeLongPress: () => boolean;
};

export function useLongPressRecognizer({
  durationMs = DEFAULT_LONG_PRESS_DURATION_MS,
  moveTolerancePx = DEFAULT_LONG_PRESS_MOVE_TOLERANCE_PX,
  onLongPress,
  disabled = false,
}: UseLongPressRecognizerOptions): LongPressRecognizerHandlers {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const firedRef = useRef(false);
  // Ref para no reiniciar el timer si `onLongPress` cambia de identidad entre
  // renders mientras el gesto está en curso.
  const onLongPressRef = useRef(onLongPress);
  onLongPressRef.current = onLongPress;

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const reset = () => {
    clearTimer();
    startRef.current = null;
    pointerIdRef.current = null;
  };

  // Cleanup en desmontaje: sin esto, un componente desmontado mientras el
  // temporizador sigue vivo dispararía `onLongPress` sobre un stale closure.
  useEffect(() => reset, []);

  const onPointerDown: LongPressRecognizerHandlers['onPointerDown'] = (event) => {
    if (disabled) return;
    // Sólo botón primario del ratón; el táctil/pen no reporta `button`.
    if (event.pointerType === 'mouse' && event.button !== undefined && event.button !== 0) return;
    reset();
    firedRef.current = false;
    pointerIdRef.current = event.pointerId;
    startRef.current = { x: event.clientX, y: event.clientY };
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      firedRef.current = true;
      onLongPressRef.current();
    }, durationMs);
  };

  const onPointerMove: LongPressRecognizerHandlers['onPointerMove'] = (event) => {
    if (!startRef.current || pointerIdRef.current !== event.pointerId) return;
    const dx = event.clientX - startRef.current.x;
    const dy = event.clientY - startRef.current.y;
    if (Math.hypot(dx, dy) > moveTolerancePx) reset();
  };

  const onPointerUp: LongPressRecognizerHandlers['onPointerUp'] = (event) => {
    if (pointerIdRef.current !== event.pointerId) return;
    clearTimer();
    startRef.current = null;
    pointerIdRef.current = null;
  };

  const onPointerCancel: LongPressRecognizerHandlers['onPointerCancel'] = () => {
    reset();
  };

  const consumeLongPress = () => {
    if (!firedRef.current) return false;
    firedRef.current = false;
    return true;
  };

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel, consumeLongPress };
}
