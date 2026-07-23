/** Rejection action schema. Business confirmation and routing remain host-owned. */
import { XCircle } from 'lucide-react';
import { createDecisionActionPlugin } from './createDecisionActionPlugin.js';

const declinePlugin = createDecisionActionPlugin({
  type: 'decline',
  label: 'Rechazar',
  defaultColor: '#dc2626',
  pdfColor: [0.863, 0.149, 0.149],
  actionStatus: 'declined',
  confirmationPlaceholder: '¿Confirma el rechazo?',
  icon: XCircle,
  iconSvg:
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  tags: ['decline', 'reject', 'action', 'button'],
});

export default declinePlugin;
