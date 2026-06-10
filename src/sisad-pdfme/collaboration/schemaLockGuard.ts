/**
 * FASE 3 — Schema Lock Guard for CommandBus
 *
 * Creates a CommandGuard that blocks commands targeting schemas locked by other users.
 * PROHIBITION: "Schema bloqueado editable por otra vía → prohibido"
 *
 * Usage:
 *   const guard = createSchemaLockGuard(lockManager, resolveSchemaUids);
 *   const unsubscribe = commandBus.addGuard(guard);
 *
 * The resolver function extracts schema UIDs from a command. Each integration
 * provides its own resolver since command payloads vary by application.
 *
 * Commands with no targeted schemas (e.g. view-only, zoom) pass through unblocked.
 * Read-only command IDs (listed in PASSTHROUGH_COMMAND_IDS) are never blocked.
 */

import type { Command } from '../contracts/commands';
import type { CommandGuard } from '../ui/commands/commandBus.js';
import type { LockManager } from './lockManager.js';

/**
 * Resolves the schema UIDs that a command will mutate.
 * Return an empty array if the command doesn't target any schemas.
 */
export type SchemaUidResolver = (command: Command) => string[];

/**
 * Command IDs that should never be blocked by lock guards.
 * These are read-only or presentation-only operations.
 */
const PASSTHROUGH_COMMAND_IDS = new Set([
  'selectSchema',
  'selectAll',
  'deselectAll',
  'zoomIn',
  'zoomOut',
  'zoomFit',
  'zoomReset',
  'toggleGrid',
  'toggleRulers',
  'toggleSnapLines',
  'openProperties',
  'focusSearch',
  'navigatePage',
]);

export interface SchemaLockGuardOptions {
  /**
   * Called when a command is blocked due to lock conflict.
   * Use for user-facing notifications ("Campo bloqueado por [nombre]").
   */
  onBlocked?: (command: Command, lockedSchemaUids: string[]) => void;
  /**
   * Additional command IDs that should never be blocked.
   */
  additionalPassthroughIds?: string[];
}

/**
 * Creates a CommandGuard that prevents mutation of schemas locked by other users.
 *
 * @param lockManager – active LockManager instance
 * @param resolveSchemaUids – extracts target schema UIDs from a Command
 * @param options – optional callbacks and configuration
 */
export function createSchemaLockGuard(
  lockManager: LockManager,
  resolveSchemaUids: SchemaUidResolver,
  options?: SchemaLockGuardOptions,
): CommandGuard {
  const passthroughIds = new Set([
    ...PASSTHROUGH_COMMAND_IDS,
    ...(options?.additionalPassthroughIds ?? []),
  ]);

  return (command: Command): boolean => {
    // Read-only commands always pass
    if (passthroughIds.has(command.id)) return true;

    const schemaUids = resolveSchemaUids(command);

    // Commands that don't target any schema always pass
    if (schemaUids.length === 0) return true;

    // Check if any targeted schema is locked by another user
    const lockedUids = schemaUids.filter((uid) => lockManager.isLockedByOther(uid));

    if (lockedUids.length > 0) {
      options?.onBlocked?.(command, lockedUids);
      return false; // Block command
    }

    return true; // Allow command
  };
}
