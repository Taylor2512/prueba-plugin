import { buildShowcaseTemplate } from '../builders/showcaseTemplate.js';
import { typesOf } from '../catalog/familyCatalog.js';

export const DEMO_DOCUMENTS = [
  {
    id: 'contrato-marco',
    label: 'Contrato marco',
    template: buildShowcaseTemplate([
      { title: 'Datos del contrato', types: typesOf(['text', 'choice']) },
    ]),
  },
  {
    id: 'anexo-firmas',
    label: 'Anexo de firmas',
    template: buildShowcaseTemplate([
      { title: 'Firmas y aprobaciones', types: typesOf(['signature', 'boolean']) },
    ]),
  },
];
