# Firma: dibujo, P12 y proveedores externos

> Documentación generada para consumo externo de `sisad-pdfme`.

## Modos contemplados
| Modo | Uso | Persistencia |
| --- | --- | --- |
| Dibujo/imagen | Firma capturada localmente. | dataURL o referencia segura. |
| P12 | Certificado local. | metadata, nunca password. |
| Proveedor externo | Firma con flujo externo. | providerId y estado; transacciones temporales fuera del template. |

## Proveedor externo configurable
El plugin no debe setear proveedores fijos. El host debe poder inyectarlos por tenant o configuración.

```ts
const providers = [
  { id: 'uanataca', label: 'Uanataca', flow: 'external-link' },
  { id: 'tenant-a', label: 'Tenant A Sign', flow: 'embedded' },
];
```

## Inspector recomendado
- Modo de firma.
- Proveedor visible solo si modo proveedor.
- Botón Configurar proveedor.
- Estado de firma: pendiente/completada/rechazada/expirada.
- Avanzado: callbacks, mapping backend, policies.

## Seguridad
- No persistir secretos ni passwords.
- No guardar URL temporal de firma como parte permanente del schema.
- Validar estado en backend antes de generar PDF final.
