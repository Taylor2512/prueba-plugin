import { CommandBus } from '../ui/commands/commandBus.js';
import {
  buildTopLevelCommentEntry,
  createCommentCommandEvent,
  createPageSnapshotCommand,
  createTemplateSnapshotCommand,
} from '../ui/commands/designerCommands.js';

export const createCommandBus = () => new CommandBus();

export const registerDesignerCommands = () => ({
  schemaCommands: {
    createPageSnapshotCommand,
  },
  commentCommands: {
    createCommentCommandEvent,
    buildTopLevelCommentEntry,
  },
  documentCommands: {
    createTemplateSnapshotCommand,
  },
});

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

export { CommandBus };
export {
  createPageSnapshotCommand,
  createTemplateSnapshotCommand,
  createCommentCommandEvent,
  buildTopLevelCommentEntry,
};
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
