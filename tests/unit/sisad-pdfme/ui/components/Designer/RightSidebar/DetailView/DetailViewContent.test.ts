import React from 'react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('antd', () => ({
  Badge: ({ children }: { children?: React.ReactNode }) => React.createElement('span', null, children),
  Button: ({ children }: { children?: React.ReactNode }) => React.createElement('button', null, children),
  Collapse: ({ children }: { children?: React.ReactNode }) => React.createElement('div', null, children),
  Divider: () => React.createElement('hr'),
  Form: ({ children }: { children?: React.ReactNode }) => React.createElement('form', null, children),
  Input: ({ children }: { children?: React.ReactNode }) => React.createElement('input', null, children),
  InputNumber: ({ children }: { children?: React.ReactNode }) => React.createElement('input', null, children),
  Modal: ({ children }: { children?: React.ReactNode }) => React.createElement('div', null, children),
  Select: ({ children }: { children?: React.ReactNode }) => React.createElement('select', null, children),
  Space: ({ children }: { children?: React.ReactNode }) => React.createElement('div', null, children),
  Switch: ({ children }: { children?: React.ReactNode }) => React.createElement('button', null, children),
  Tag: ({ children }: { children?: React.ReactNode }) => React.createElement('span', null, children),
  Tooltip: ({ children }: { children?: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  Typography: {
    Text: ({ children }: { children?: React.ReactNode }) => React.createElement('span', null, children),
    Title: ({ children }: { children?: React.ReactNode }) => React.createElement('span', null, children),
    Paragraph: ({ children }: { children?: React.ReactNode }) => React.createElement('p', null, children),
  },
  theme: {
    useToken: () => ({ token: {} }),
  },
}));

vi.mock('form-render', () => ({
  default: ({ children }: { children?: React.ReactNode }) => React.createElement('div', null, children),
}));

import * as moduleUnderTest from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent';

describe('sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
