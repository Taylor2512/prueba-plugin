import React from 'react';
import { SisadPdfmeInstance } from '@/sisad-pdfme';
import { consumerInstance } from './instance';

export const App = () => (
  <main>
    <h1>Public consumer</h1>
    <SisadPdfmeInstance instance={consumerInstance} />
  </main>
);
