/**
 * Guard de teclado del schema `number`.
 *
 * `renderTextUi` monta un `contenteditable`, no un `<input type="number">`, así
 * que el navegador no filtra nada por sí solo. Cancelar `beforeinput` es lo que
 * impide que la letra llegue a existir en el DOM: sin esto el carácter se
 * escribe, se rechaza al confirmar y el campo se vacía al perder el foco, que es
 * justo la experiencia que se quiere evitar.
 *
 * `insertCompositionText` (IME) no es cancelable, y en Firefox el pegado lo
 * gestiona un handler propio de `makeElementPlainTextContentEditable` que inserta
 * el nodo a mano sin pasar por `beforeinput`. Para esos dos huecos hay una
 * segunda pasada en `input` que revierte al último texto admisible.
 */
import { isAcceptableNumberInput, type NumberInputPolicy } from './inputPolicy.js';

/** Tipos de `beforeinput` que sí pueden introducir caracteres nuevos. */
const isInsertion = (inputType: string) => inputType.startsWith('insert');

/** Un campo numérico es de una sola línea: los saltos nunca son válidos. */
const isLineBreak = (inputType: string) =>
  inputType === 'insertLineBreak' || inputType === 'insertParagraph';

/**
 * Texto que quedaría en el campo si la edición se aplicara.
 *
 * `null` cuando la selección no se puede resolver contra este campo; en ese caso
 * no se bloquea nada, porque un guard que no sabe qué va a pasar no debe decidir.
 */
const buildProspectiveText = (field: HTMLElement, inserted: string): string | null => {
  const selection = field.ownerDocument.defaultView?.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  if (!field.contains(range.commonAncestorContainer)) return null;

  const beforeCaret = range.cloneRange();
  beforeCaret.selectNodeContents(field);
  beforeCaret.setEnd(range.startContainer, range.startOffset);

  const start = beforeCaret.toString().length;
  const end = start + range.toString().length;
  const current = field.textContent ?? '';

  return current.slice(0, start) + inserted + current.slice(end);
};

const readInsertedText = (event: InputEvent): string => {
  if (event.inputType === 'insertFromPaste' || event.inputType === 'insertFromDrop') {
    return event.dataTransfer?.getData('text') ?? '';
  }
  return event.data ?? '';
};

const moveCaretToEnd = (field: HTMLElement) => {
  const view = field.ownerDocument.defaultView;
  const selection = view?.getSelection();
  if (!selection) return;
  const range = field.ownerDocument.createRange();
  range.selectNodeContents(field);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
};

/**
 * Instala el filtro sobre el campo editable que `renderTextUi` acaba de montar.
 *
 * El renderer reconstruye el DOM del schema en cada render, así que el nodo es
 * siempre nuevo y los listeners no se acumulan.
 */
export const attachNumberInputGuard = (rootElement: HTMLElement, schema: NumberInputPolicy) => {
  const field = rootElement.querySelector<HTMLElement>('[contenteditable]');
  if (!field) return;

  let lastAcceptable = field.textContent ?? '';

  field.addEventListener('beforeinput', (event: Event) => {
    const inputEvent = event as InputEvent;
    const inputType = inputEvent.inputType ?? '';

    if (isLineBreak(inputType)) {
      event.preventDefault();
      return;
    }
    if (!isInsertion(inputType)) return;

    const prospective = buildProspectiveText(field, readInsertedText(inputEvent));
    if (prospective === null) return;

    if (!isAcceptableNumberInput(prospective, schema)) event.preventDefault();
  });

  /** Red de seguridad: revierte lo que `beforeinput` no ha podido cancelar. */
  const sanitize = () => {
    const current = field.textContent ?? '';
    if (isAcceptableNumberInput(current, schema)) {
      lastAcceptable = current;
      return;
    }
    field.textContent = lastAcceptable;
    moveCaretToEnd(field);
  };

  // Cubre la composición IME, cuyo `beforeinput` no es cancelable.
  field.addEventListener('input', sanitize);

  // Cubre el pegado de Firefox: su handler inserta el nodo a mano y no dispara
  // `input`, pero se registra antes que este, así que aquí el texto ya está
  // puesto. En Chromium este listener corre antes de que el navegador inserte
  // nada, así que solo ve texto ya admitido y no revierte nada.
  field.addEventListener('paste', sanitize);
};
