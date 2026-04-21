import type React from 'react';

export type RightSidebarContextHeaderContext = {
  mode: 'list' | 'detail' | 'bulk' | 'docs';
  activeCount: number;
};

export type RightSidebarContextHeader = React.ReactNode | ((ctx: RightSidebarContextHeaderContext) => React.ReactNode);

export const resolveRightSidebarContextHeader = (
  contextHeader: RightSidebarContextHeader | undefined,
  context: RightSidebarContextHeaderContext,
): React.ReactNode => {
  if (typeof contextHeader === 'function') {
    return contextHeader(context);
  }

  return contextHeader ?? null;
};