import { describe, expect, test } from 'vitest';
import { DesignerCoordinateService } from '@/sisad-pdfme/ui/components/Designer/shared/designerCoordinateService.js';

describe('DesignerCoordinateService', () => {
  test('clampRectToPage keeps rect inside page bounds', () => {
    const service = new DesignerCoordinateService();

    const clamped = service.clampRectToPage(
      {
        left: -20,
        top: -10,
        right: 240,
        bottom: 140,
        width: 260,
        height: 150,
      },
      { width: 200, height: 100 },
    );

    expect(clamped).toEqual({
      left: 0,
      top: 0,
      right: 200,
      bottom: 100,
      width: 200,
      height: 100,
    });
  });
});
