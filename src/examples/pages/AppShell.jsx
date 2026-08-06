import React, { useMemo } from 'react';
import { DynamicRouter, useRouter } from './DynamicRouter.jsx';
import PagesConfig from '../config/pagesConfig.json';
import { getRouteCatalog } from '../routes/routeDefinitions.js';

export function AppShell({ initialPath = '/' }) {
  return (
    <DynamicRouter initialPath={initialPath}>
      <AppContent />
    </DynamicRouter>
  );
}

function AppContent() {
  const { currentPath, navigateTo } = useRouter();
  const routes = useMemo(() => getRouteCatalog(), []);

  // Render actual page content
  return (
    <div>
      {/* Header/Navigation (opcional) */}
      {/* <Header routes={routes} currentPath={currentPath} onNavigate={navigateTo} /> */}
      {/* Page content renderizado por DynamicRouter */}
    </div>
  );
}
