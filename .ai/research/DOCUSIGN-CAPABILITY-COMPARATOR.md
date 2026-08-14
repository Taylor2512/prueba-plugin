# DocuSign capability comparator

Status: REFERENCE ONLY. Not SISAD-PDFME product authority.

Official DocuSign developer concepts used as comparator:
- tabs/fields associated with recipient input;
- embedded signing/recipient view;
- conditional fields;
- conditional recipients/routing;
- routing order;
- prefilled tabs;
- bulk/fan-out style sending.

Adaptation principles for SISAD-PDFME:
- external participant -> reusable User adapter;
- tabs -> schema plugins/assignments;
- embedded signing -> Form surface;
- prefill -> `origin=prefill`;
- conditional fields -> declared dependencies/expressions;
- routing/bulk -> execution-plan simulator outside Form;
- recipient visibility -> central schema/document access;
- field data -> snapshot/execution result.

Do not copy product-specific envelope/network semantics into core.
