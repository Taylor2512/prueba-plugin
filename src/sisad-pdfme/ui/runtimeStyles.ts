const SISAD_PDFME_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap';

const SISAD_PDFME_FONT_LINK_ATTR = 'data-sisad-pdfme-font';

const ensureLink = (href: string) => {
  if (typeof document === 'undefined') return;
  const existing = document.querySelector(`link[${SISAD_PDFME_FONT_LINK_ATTR}="${href}"]`);
  if (existing) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.setAttribute(SISAD_PDFME_FONT_LINK_ATTR, href);
  document.head.appendChild(link);
};

const ensureSisadPdfmeRuntimeStyles = () => {
  if (typeof document === 'undefined') return;
  ensureLink(SISAD_PDFME_FONT_HREF);
};

ensureSisadPdfmeRuntimeStyles();

export {};
