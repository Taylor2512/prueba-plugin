import {
  CommandBus,
  createCommandBus,
} from '../ui/commands/commandBus.js';
import {
  buildTopLevelCommentEntry,
  createCommentCommandEvent,
  createPageSnapshotCommand,
  createTemplateSnapshotCommand,
} from '../ui/commands/designerCommands.js';

export const designerCommands = {
  createPageSnapshotCommand,
  createTemplateSnapshotCommand,
  createCommentCommandEvent,
  buildTopLevelCommentEntry,
} as const;

export const schemaCommands = {
  createPageSnapshotCommand,
};

export const commentCommands = {
  createCommentCommandEvent,
  buildTopLevelCommentEntry,
};

export const documentCommands = {
  createTemplateSnapshotCommand,
};

export const registerDesignerCommands = () => ({
  schemaCommands,
  commentCommands,
  documentCommands,
});

export { CommandBus, createCommandBus };
export { createPageSnapshotCommand, createTemplateSnapshotCommand, createCommentCommandEvent, buildTopLevelCommentEntry };
export {
  createSelectionCommands,
  emitInlineEditRequest,
  setInlineEditRequestHandler,
} from '../ui/components/Designer/shared/selectionCommands.js';
export type {
  SelectionCommandSet,
  SelectionCommandsContext,
  AlignType,
  DistributeType,
  InlineEditTarget,
  InlineEditRequest,
} from '../ui/components/Designer/shared/selectionCommands.js';
