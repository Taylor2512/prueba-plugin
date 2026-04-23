import { describe, expect, it, vi } from 'vitest';
import { DesignerEngineBuilder } from '../../src/sisad-pdfme/ui/designerEngine.js';

describe('DesignerEngineBuilder all methods', () => {
  it('chains renderers, sidebars and canvas options', () => {
    const Left = () => null;
    const Right = () => null;

    const engine = new DesignerEngineBuilder()
      .withLeftSidebar(Left)
      .withRightSidebar(Right)
      .withLeftSidebarProps({ title: 'Left' })
      .withRightSidebarProps({ title: 'Right' })
      .withCanvasFeatureToggles({ guides: true, moveable: false, selecto: true, snapLines: false, padding: true, mask: false })
      .withCanvasStyleOverrides({ stage: { border: '1px solid red' } })
      .withCanvasClassNames({ stage: 'my-stage' })
      .withCanvasComponents({})
      .withCanvasUseDefaultStyles(false)
      .build();

    expect(engine.renderers?.leftSidebar).toBe(Left);
    expect(engine.renderers?.rightSidebar).toBe(Right);
    expect(engine.sidebars?.left?.title).toBe('Left');
    expect(engine.sidebars?.right?.title).toBe('Right');
    expect(engine.canvas?.featureToggles?.guides).toBe(true);
    expect(engine.canvas?.styleOverrides?.stage).toEqual({ border: '1px solid red' });
    expect(engine.canvas?.classNames?.stage).toBe('my-stage');
    expect(engine.canvas?.useDefaultStyles).toBe(false);
  });

  it('merges http config across calls and keeps latest override', () => {
    const engine = new DesignerEngineBuilder()
      .withHttpAxiosConfig({ baseURL: 'https://api.a', headers: { A: '1' }, timeoutMs: 1000 })
      .withHttpAxiosConfig({ headers: { B: '2', A: '3' }, withCredentials: true })
      .build();

    expect(engine.http?.axios?.baseURL).toBe('https://api.a');
    expect(engine.http?.axios?.headers).toEqual({ A: '3', B: '2' });
    expect(engine.http?.axios?.timeoutMs).toBe(1000);
    expect(engine.http?.axios?.withCredentials).toBe(true);
  });

  it('configures schema options and collaboration settings', () => {
    const identityFactory = vi.fn((schema) => ({ id: schema.id, key: schema.name, namespace: 'x', version: '1' }));
    const onCreate = vi.fn((schema) => schema);

    const engine = new DesignerEngineBuilder()
      .withSchemaConfigStorageKey('__custom__')
      .withSchemaIdentityFactory(identityFactory)
      .withSchemaCreationHook(onCreate)
      .withAutoAttachIdentity(false)
      .withCollaboration({
        enabled: true,
        actorId: 'u1',
        users: [{ id: 'u1', name: 'User 1', color: '#111111' }],
      })
      .build();

    expect(engine.schema?.configStorageKey).toBe('__custom__');
    expect(engine.schema?.identityFactory).toBe(identityFactory);
    expect(engine.schema?.onCreate).toBe(onCreate);
    expect(engine.schema?.autoAttachIdentity).toBe(false);
    expect(engine.collaboration?.recipientOptions?.[0]?.id).toBe('u1');
    expect(engine.collaboration?.users?.[0]?.id).toBe('u1');
  });

  it('build returns deep clone and buildOptions injects designerEngine', () => {
    const builder = new DesignerEngineBuilder().withCanvasStyleOverrides({ stage: { border: '1px solid red' } });
    const engineA = builder.build();
    const engineB = builder.build();

    if (engineA.canvas?.styleOverrides?.stage) {
      (engineA.canvas.styleOverrides.stage as Record<string, unknown>).border = 'mutated';
    }

    expect(engineB.canvas?.styleOverrides?.stage).toEqual({ border: '1px solid red' });

    const options = builder.buildOptions({ lang: 'es' as const });
    expect(options.lang).toBe('es');
    expect(options.designerEngine.canvas?.styleOverrides?.stage).toEqual({ border: '1px solid red' });
  });
});
