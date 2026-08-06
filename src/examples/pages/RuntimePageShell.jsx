import React from 'react';

import { ImmersiveShell, RuntimeViewport } from '../components/Ui.jsx';

export function RuntimePageShell({
  title,
  modeBadge,
  currentPath,
  actions,
  infoTitle,
  info,
  viewportName,
  children,
}) {
  return (
    <ImmersiveShell
      title={title}
      modeBadge={modeBadge}
      currentPath={currentPath}
      actions={actions}
      infoTitle={infoTitle}
      info={info}
    >
      <RuntimeViewport name={viewportName}>{children}</RuntimeViewport>
    </ImmersiveShell>
  );
}
