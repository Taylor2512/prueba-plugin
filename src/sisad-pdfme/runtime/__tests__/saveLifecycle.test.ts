import { describe, expect, it, vi } from "vitest";

import { createSaveLifecycle } from "@sisad-pdfme/runtime/saveLifecycle";

const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe("createSaveLifecycle", () => {
  it("persiste una sola vez por save exitoso y publica el estado final", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);
    const states = [];
    const events = [];
    const lifecycle = createSaveLifecycle({
      persist,
      onStateChange: (state) => states.push(state),
      dispatcher: {
        emit: (name, payload, meta) => events.push([name, payload, meta]),
      },
    });

    const result = await lifecycle.save({ id: "snapshot-1" });

    expect(persist).toHaveBeenCalledTimes(1);
    expect(persist).toHaveBeenCalledWith({ id: "snapshot-1" });
    expect(result).toEqual({ ok: true, revision: 1 });
    expect(lifecycle.getState()).toMatchObject({
      status: "saved",
      revision: 1,
      error: null,
      dirty: false,
    });
    expect(states.at(-1)).toMatchObject({
      status: "saved",
      revision: 1,
      error: null,
      dirty: false,
    });
    expect(events.map(([name]) => name)).toEqual([
      "save.requested",
      "save.started",
      "save.succeeded",
    ]);
  });

  it("encola un segundo save mientras el primero sigue en vuelo y no escribe en paralelo", async () => {
    const first = deferred();
    const second = deferred();
    const persist = vi
      .fn()
      .mockImplementationOnce(() => first.promise)
      .mockImplementationOnce(() => second.promise);
    const lifecycle = createSaveLifecycle({ persist });

    const firstSave = lifecycle.save({ id: "snapshot-1" });
    const secondSave = lifecycle.save({ id: "snapshot-2" });

    expect(persist).toHaveBeenCalledTimes(1);
    expect(lifecycle.getState()).toMatchObject({ status: "saving", dirty: true });

    first.resolve(undefined);
    await firstSave;

    expect(persist).toHaveBeenCalledTimes(2);
    expect(persist).toHaveBeenNthCalledWith(1, { id: "snapshot-1" });
    expect(persist).toHaveBeenNthCalledWith(2, { id: "snapshot-2" });

    second.resolve(undefined);
    await secondSave;

    expect(lifecycle.getState()).toMatchObject({
      status: "saved",
      revision: 2,
      dirty: false,
      error: null,
    });
  });

  it("conserva el snapshot pendiente y permite retry tras un fallo", async () => {
    const persist = vi
      .fn()
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce(undefined);
    const lifecycle = createSaveLifecycle({ persist, getErrorMessage: (error) => error.message });

    const failed = await lifecycle.save({ id: "snapshot-1" });
    expect(failed).toEqual({ ok: false, error: "boom" });
    expect(lifecycle.getState()).toMatchObject({
      status: "error",
      revision: 0,
      error: "boom",
      dirty: true,
    });
    expect(lifecycle.canRetry()).toBe(true);

    const retried = await lifecycle.retry();
    expect(retried).toEqual({ ok: true, revision: 1 });
    expect(persist).toHaveBeenCalledTimes(2);
    expect(persist).toHaveBeenNthCalledWith(1, { id: "snapshot-1" });
    expect(persist).toHaveBeenNthCalledWith(2, { id: "snapshot-1" });
    expect(lifecycle.canRetry()).toBe(false);
  });
});
