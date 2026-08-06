import React from 'react';
import { EventLog } from './Ui.jsx';

export function InfoPanel({ title, data = {}, events, onClear, metadata }) {
  const sections = Object.entries(data).filter(([, value]) => value !== undefined && value !== null);

  return (
    <div className="flex flex-col gap-2">
      {sections.length > 0 && (
        <div className="space-y-1 text-xs">
          {sections.map(([key, value]) => (
            <div key={key} className="flex justify-between gap-2">
              <span className="font-medium text-slate-400">{key}:</span>
              <span className="text-slate-300 font-mono">{String(value)}</span>
            </div>
          ))}
        </div>
      )}

      {metadata?.actions && (
        <div className="flex gap-2 flex-wrap pt-2">
          {metadata.actions.map(({ label, handler }) => (
            <button
              key={label}
              onClick={handler}
              className="text-xs px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-100"
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {events && (
        <div className="pt-2 border-t border-slate-700">
          <EventLog events={events} onClear={onClear} />
        </div>
      )}
    </div>
  );
}
