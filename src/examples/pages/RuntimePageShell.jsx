import React from 'react';

import { ExampleImmersiveShell, RuntimeViewport } from '../components/exampleUi.jsx';

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
    <ExampleImmersiveShell
      title={title}
      modeBadge={modeBadge}
      currentPath={currentPath}
      actions={actions}
      infoTitle={infoTitle}
      info={info}
    >
      <RuntimeViewport name={viewportName}>{children}</RuntimeViewport>
    </ExampleImmersiveShell>
  );
}
