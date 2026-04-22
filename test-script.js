import { getLabExampleById } from './src/features/sisad-pdfme/examples/labExamples.js';
import { buildSchemaAssignments } from './src/sisad-pdfme/common/collaboration.ts';

const ex = getLabExampleById('multi-document-routing');
console.log(JSON.stringify(buildSchemaAssignments(ex.template.schemas), null, 2));
