# SIGNATURE-RUNTIME

```text
schema mode → native or external provider → pending/completed/failed → serializable result → Viewer/PDF projection
```

<!-- SISAD-PDFME-PORTABLE-INTEGRATION:.ai/brain/40-runtime/SIGNATURE-RUNTIME.md:START -->
## Integration transport

La firma externa puede consumir un `HttpClientAdapter` inyectado, incluyendo una instancia Axios
del host con interceptors existentes. El runtime de firma no conoce Redux ni el mecanismo de auth
del consumidor.

Firma e iniciales reutilizan `styleId`/FontRegistry y mantienen artifacts aislados por User,
document y session.
<!-- SISAD-PDFME-PORTABLE-INTEGRATION:.ai/brain/40-runtime/SIGNATURE-RUNTIME.md:END -->
