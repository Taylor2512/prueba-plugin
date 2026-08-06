import { useMemo } from 'react';
import { useRuntimeConfig } from './useRuntimeConfig.js';
import { useEventLog } from './useEventLog.js';
import { useController } from './useController.js';

export function usePageContext(profileKey) {
  const config = useRuntimeConfig(profileKey);
  const eventLog = useEventLog();
  const controller = useController();

  return useMemo(
    () => ({
      config,
      events: eventLog.events,
      record: eventLog.record,
      clear: eventLog.clear,
      handleControllerReady: controller.handleControllerReady,
      getController: controller.getController,
    }),
    [config, eventLog.events, eventLog.record, eventLog.clear, controller.handleControllerReady, controller.getController],
  );
}
