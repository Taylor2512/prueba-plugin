import { SisadPdfmeInstance } from '@/sisad-pdfme';
import { contractDesignerInstance } from '../instances/contractDesigner.instance';

export function ContractDesignerPage() {
  return (
    <main className="h-dvh min-h-0 w-full min-w-0 overflow-hidden">
      <SisadPdfmeInstance instance={contractDesignerInstance} />
    </main>
  );
}
