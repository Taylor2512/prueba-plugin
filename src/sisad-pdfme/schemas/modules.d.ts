declare module 'bwip-js' {
  export type RenderOptions = Record<string, unknown>;
  const bwipjs: {
    toBuffer: (options: RenderOptions) => Promise<Uint8Array> | Uint8Array;
    toCanvas?: (canvas: HTMLCanvasElement, options: RenderOptions) => Promise<void> | void;
  };
  export default bwipjs;
}

declare namespace Intl {
  type SegmenterGranularity = 'grapheme' | 'word' | 'sentence';
  interface SegmenterOptions {
    localeMatcher?: 'lookup' | 'best fit';
    granularity?: SegmenterGranularity;
  }
  interface SegmentData {
    segment: string;
    index: number;
    input: string;
    isWordLike?: boolean;
  }
  interface Segments {
    [Symbol.iterator](): Iterator<SegmentData>;
  }
  interface Segmenter {
    segment(input: string): Segments;
  }
  interface SegmenterConstructor {
    new (locales?: string | string[], options?: SegmenterOptions): Segmenter;
  }
  var Segmenter: SegmenterConstructor;
}
