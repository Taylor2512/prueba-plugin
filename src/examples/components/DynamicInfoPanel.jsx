import React from 'react';
import {
  ControllerPanel,
  EventLog,
  InfoPanelStack,
  FamilyBadgeList,
  MetricGrid,
} from './Ui.jsx';
import { FAMILY } from '../catalog/familyCatalog.js';

const panelRenderers = {
  metrics: ({ config, context }) => (
    <MetricGrid
      items={config.metrics.map(({ label, path, value, fallback }) => ({
        label,
        value: value || getNestedValue(context, path) || fallback,
      }))}
    />
  ),

  controller: ({ context }) => <ControllerPanel getController={context.getController} />,

  events: ({ context }) => <EventLog events={context.events} onClear={context.clear} />,

  families: () => (
    <div className="space-y-3">
      {FAMILY.map((family) => (
        <div key={family.key} className="box-border rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold text-white">{family.title}</div>
          <p className="m-0 mt-1 text-sm leading-6 text-slate-300">{family.description}</p>
          <div className="mt-3">
            <FamilyBadgeList types={family.types} />
          </div>
        </div>
      ))}
    </div>
  ),
};

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path.split('.').reduce((acc, part) => {
    if (part.includes('()')) return acc; // Skip methods
    return acc?.[part];
  }, obj);
};

export function DynamicInfoPanel({ config, state, context }) {
  if (!config?.infoPanels) return null;

  const panels = config.infoPanels.map((panelConfig) => ({
    key: panelConfig.key,
    title: panelConfig.title,
    description: panelConfig.description,
    render: () => {
      const renderer = panelRenderers[panelConfig.type];
      if (!renderer) return <div>Unknown panel type: {panelConfig.type}</div>;

      return renderer({
        config: panelConfig,
        context: { ...context, ...state },
      });
    },
  }));

  return <InfoPanelStack panels={panels} />;
}
