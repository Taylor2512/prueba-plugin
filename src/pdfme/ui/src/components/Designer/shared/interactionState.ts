export type InteractionPhase =
  | 'idle'
  | 'hover'
  | 'selected-single'
  | 'selected-multi'
  | 'editing'
  | 'dragging'
  | 'resizing'
  | 'rotating';

export interface InteractionState {
  phase: InteractionPhase;
  selectionCount: number;
  hasSelection: boolean;
  isHovering: boolean;
  isDragging: boolean;
  isResizing: boolean;
  isRotating: boolean;
}

export type InteractionStateInput = {
  activeElements: HTMLElement[];
  hoveringSchemaId: string | null;
  editing: boolean;
  isDragging: boolean;
  isResizing: boolean;
  isRotating: boolean;
};

export const deriveInteractionState = (input: InteractionStateInput): InteractionState => {
  const { activeElements, hoveringSchemaId, editing, isDragging, isResizing, isRotating } = input;
  const selectionCount = activeElements.length;
  const hasSelection = selectionCount > 0;
  const isHovering = Boolean(hoveringSchemaId && !hasSelection);

  let phase: InteractionPhase = 'idle';
  if (isDragging) {
    phase = 'dragging';
  } else if (isResizing) {
    phase = 'resizing';
  } else if (isRotating) {
    phase = 'rotating';
  } else if (editing && hasSelection) {
    phase = 'editing';
  } else if (selectionCount > 1) {
    phase = 'selected-multi';
  } else if (selectionCount === 1) {
    phase = 'selected-single';
  } else if (isHovering) {
    phase = 'hover';
  }

  return {
    phase,
    selectionCount,
    hasSelection,
    isHovering,
    isDragging,
    isResizing,
    isRotating,
  };
};
