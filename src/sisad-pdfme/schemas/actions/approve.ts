/** Approval action schema. Business confirmation and routing remain host-owned. */
import { CheckCircle } from 'lucide-react';
import { createDecisionActionPlugin } from '@sisad-pdfme/schemas/actions/createDecisionActionPlugin';

const approvePlugin = createDecisionActionPlugin({
  type: 'approve',
  label: 'Aprobar',
  defaultColor: '#16a34a',
  pdfColor: [0.086, 0.639, 0.29],
  actionStatus: 'approved',
  confirmationPlaceholder: '¿Confirma la aprobación?',
  auditEventName: 'document.approved',
  icon: CheckCircle,
  iconSvg:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
  tags: ['approve', 'action', 'button'],
});

export default approvePlugin;
