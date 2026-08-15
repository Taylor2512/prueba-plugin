# SISAD-PDFME — RESUME UNFINISHED RUNTIME AND PORTABLE INTEGRATIONS

Actúa como coordinador principal, arquitecto e implementador autónomo del repositorio
standalone SISAD-PDFME.

Tu primera obligación es REANUDAR trabajo inconcluso. No empieces una campaña nueva y no
asumas que las task cards reflejan el estado ejecutado.

El contexto exportado más reciente sugiere que existen evidences hasta RTP-465 y que RTP-470
en adelante permanecían BACKLOG, pero ESA ES SÓLO UNA HIPÓTESIS DE ARRANQUE. El live repository
manda.

No me preguntes qué opción continuar. Continúa automáticamente mientras exista trabajo
localmente resoluble.

======================================================================
1. BOOT Y RECONCILIACIÓN OBLIGATORIA
======================================================================

Ejecuta primero:

git status --short
git branch --show-current
git rev-parse HEAD

Luego:

node scripts/ai/runtime-work-queue.mjs status .
node scripts/ai/runtime-work-queue.mjs next .

Lee sólo:

1. AGENTS.md
2. .ai/START.md
3. .ai/NOW.md si existe
4. .ai/ROUTER.md
5. .ai/prompts/PROMPT_SISAD_PDFME_AUTONOMOUS_START.md
6. .ai/knowledge/runtime-platform/CURRENT-SNAPSHOT.md
7. .ai/scrum/views/RUNTIME-PLATFORM.md
8. evidence de la última task aparentemente cerrada
9. card de la siguiente task
10. nearest source/tests

No cargues recursivamente `.ai/**`.

Compara:

task frontmatter
vs
ledger
vs
evidence
vs
live source/tests.

Una card BACKLOG puede estar cerrada si evidence + source lo demuestran.
Una card PASS sin evidence suficiente NO está cerrada.

Si RTP-425..RTP-465 están probadas y RTP-470 no, empieza RTP-470.
Si no, empieza por la primera divergencia real.

======================================================================
2. REGLAS DE AUTONOMÍA
======================================================================

NUNCA preguntes:

- ¿continúo?
- ¿qué task hago?
- elige A/B/C
- ¿quieres que implemente el siguiente bloque?

Después de cada task:

1. tests;
2. evidence;
3. ledger/status;
4. `runtime-work-queue next`;
5. continuar.

Una falla normal no detiene la campaña.

Máximo dos ciclos de reparación por la misma hipótesis. Luego:
- escribe BLOCKED evidence;
- continúa una task independiente.

Solicita intervención humana sólo si TODO el trabajo útil restante depende de:
- secreto externo inexistente;
- servicio imposible de simular;
- decisión de producto no derivable;
- colisión multi-writer no aislable;
- toolchain completamente inutilizable.

======================================================================
3. SEGURIDAD GIT Y MULTI-WRITER
======================================================================

Prohibido:

git reset --hard
git clean
git checkout -- .
git restore .
blanket stash
force push

No atribuyas dirty files preexistentes a tu sesión.

Un writer por file set solapado.

No mass rename.

No crear paths persistentes con:
V2, V3, version, final, copy, timestamps o fechas.

Los IDs de task existentes no son nombres de revisión y deben conservarse.

======================================================================
4. PRODUCT BOUNDARY
======================================================================

Trabaja sólo sobre SISAD-PDFME reusable.

No introduzcas reglas de DigitalAgreements, Request, routing empresarial, backend específico,
Redux específico ni DTOs de un consumidor.

Conceptos core permitidos:

User
Document
RuntimeSession
Schema
Assignment
Capability
DataPointer
DataBinding
DataSource
HttpClientAdapter
ActionProvider
SignatureProvider
Font
Artifact

PokeAPI es SOLAMENTE example/fixture.

La implementación debe funcionar con cualquier API.

======================================================================
5. PRINCIPIO HTTP: CORE TRANSPORT-NEUTRAL
======================================================================

NO agregues Axios como dependencia obligatoria del core únicamente para esta feature.

Diseña/reutiliza una interfaz equivalente a:

interface HttpClientAdapter {
  request(request): Promise<HttpResponse>;
}

Debe poder recibir:

- adapter Axios;
- adapter fetch;
- fake transport de tests;
- cualquier cliente futuro.

Si el host ya usa Axios, debe poder inyectar LA MISMA instancia Axios.

Eso permite heredar:

- baseURL;
- defaults;
- interceptors;
- Authorization injection;
- refresh handling;
- observabilidad propia del host.

SISAD-PDFME NO debe leer el token directamente desde Redux/localStorage.

Patrón:

Host auth
→ host Axios interceptor
→ injected Axios adapter
→ IntegrationRuntime
→ provider/DataSource.

También soporta:

resolveHeaders(context)
→ dynamic Authorization/headers.

======================================================================
6. AUTHORIZATION Y HEADERS
======================================================================

Implementa una política explícita, no magia global.

Modos conceptuales:

client
resolver
provider
none

Authorization/Cookie/Proxy-Authorization son sensibles.

NO reenviar headers sensibles a cualquier origen.

Default:

same-origin OR explicit allowlist
=> puede forwardear

otro origen
=> bloquear.

Una definición de schema/template no puede habilitar por sí sola exfiltración de credenciales.

No persistir:

Authorization
Bearer token
Cookie
apiKey
clientSecret
refreshToken
private key
interceptors
Axios instance.

======================================================================
7. PUNTO PÚBLICO DE INYECCIÓN
======================================================================

Inspecciona primero:

src/sisad-pdfme/integration/resolveSisadPdfmeInstance.ts
src/sisad-pdfme/integration/SisadPdfmeInstanceBundle.ts
src/sisad-pdfme/integration/normalizeHostData.ts
src/sisad-pdfme/adapters/**

El target es extender LA autoridad existente, no crear otra.

Conceptualmente:

resources: {
  integrations: {
    httpClient,
    dataSources,
    signatureExecution,
    fonts
  }
}

pero si `adapters` es la raíz correcta en live source, extiéndela.

`SisadPdfmeInstanceBundle` ya separa recursos portables de adapters no serializables.
Conserva y generaliza esa intención: runtime clients/providers no deben entrar al bundle portable.

======================================================================
8. DATA POINTER
======================================================================

Implementa/reutiliza un resolver puro.

Soportar:

JSON Pointer
JSONPath

Resultado:

missing
scalar
object
array

No perder:

0
false
""
null
[]
undefined

Distinguir expected shape.

Tests:

nested object
nested array
index zero
escaped keys
missing
null
false
0
empty string
empty array
JSONPath many
cardinality mismatch.

======================================================================
9. DATA SOURCE REGISTRY
======================================================================

El schema referencia `sourceKey`.

Soportar dos niveles:

A. provider programático para APIs complejas;
B. HTTP declarativo para APIs convencionales usando HttpClientAdapter.

Provider:

query()
resolveByValue?()

Query context puede incluir:

search
offset
cursor
limit
params
User
document
runtimeSession
AbortSignal

No introducir business routing.

======================================================================
10. REQUEST MAPPING GENÉRICO
======================================================================

Un HttpDataSource debe poder describir:

method
path/url relativo permitido
query params
body
headers NO sensibles declarativos
response mapping
paging
search
dependencies

Variables de request deben resolverse mediante referencias declarativas seguras.

NO eval().

NO funciones serializadas en template.

NO arbitrary JavaScript expression execution.

======================================================================
11. RESPONSE MAPPING
======================================================================

Usa DataPointer para:

collection
item label
item value
disabled
description
icon
total
next cursor
scalar bindings.

Debe funcionar con:

objeto
array
objeto paginado
arrays anidados
scalars.

PokeAPI sólo debe demostrar el mecanismo en tests/examples.

======================================================================
12. OPTION MODEL
======================================================================

Caracteriza primero:

src/sisad-pdfme/schemas/select/index.ts
src/sisad-pdfme/schemas/options/**
src/sisad-pdfme/runtime/options.ts
nearest tests.

No romper static options.

Target:

OptionValue =
string | number | boolean | null

Multiple cuando corresponda.

Un selected value ausente de la página actual NO significa inexistente.

Implementa/reutiliza:

keep-stale
invalidate
clear

Default recomendado:
keep-stale.

Prohibido seleccionar `options[0]` silenciosamente como fallback de una página remota.

======================================================================
13. SEARCHABLE REMOTE OPTIONS
======================================================================

El select/dropdown remoto debe soportar:

search input
loading
empty
error
retry
keyboard
touch
disabled item
selected item
clear cuando capability lo permita
scroll
pagination
virtualization

Default visual:
aproximadamente 5 opciones visibles antes de scroll.

NO confundir:

visibleRows = 5
con
pageSize = 5.

Para listas grandes:
no renderizar miles de nodos.

======================================================================
14. CONCURRENCY DE REQUESTS
======================================================================

Obligatorio:

debounce configurable
AbortController
request sequence
ignore stale response
single-flight idéntico
cache policy
TTL si aplica
dispose/cleanup.

Ejemplo:

search "a"
search "ab"
search "abc"

si response "a" llega última:
IGNORE.

Al cambiar User/document/runtimeSession:
requests del scope anterior no pueden escribir en el nuevo.

======================================================================
15. CACHE ISOLATION
======================================================================

Cache key considera según sensibilidad:

sourceKey
query
page/cursor
params
dependency values
User
document
runtime session.

No filtrar data de User A a User B.

No compartir cache autenticado sólo por URL.

======================================================================
16. DEPENDENT FIELDS
======================================================================

Ejemplo genérico:

field A
→ value
→ DataSource params de field B
→ nuevas opciones.

Al cambiar A:

abort request anterior
recompute params
apply explicit selected policy
no touched automático.

======================================================================
17. SCHEMA MANIFEST / REGISTRY
======================================================================

Esto refina RTP-475/RTP-480.

Metadata de plugin/registry declara:

dataBinding:
none | scalar | collection | artifact

No crear sets runtime paralelos.

Aplicar incrementalmente:

text scalar
number scalar number
date/time scalar
select collection
radio collection
checkboxGroup collection
table array/object
image reference/artifact
barcode scalar
multiVariableText bindings
signature specialized provider.

======================================================================
18. FORM TRANSACTION CONTRACT
======================================================================

Carga remota:

origin = prefill/system
touched = false.

Selección/edición humana:

origin = user
touched = true
dirty = true.

Background refresh NO sobrescribe user-dirty salvo policy explícita.

Un remote schema jamás debe rollback de un sibling aceptado.

Completion se calcula sobre canonical value/interaction contract, no sobre presencia en la página
de opciones actual.

======================================================================
19. SNAPSHOT / VIEWER / GENERATOR
======================================================================

No reconsultar API al generar PDF por defecto.

Pipeline:

remote response
→ resolved value
→ canonical commit
→ snapshot
→ Viewer
→ Generator
→ PDF.

Persistir cuando haga falta:

value
displayValue

No guardar automáticamente el raw response completo.

PDF debe poder generarse si API está offline después del commit.

======================================================================
20. INTEGRATION RUNTIME
======================================================================

Compartir lifecycle técnico:

idle
pending
success
error
cancelled

con:

AbortSignal
timeout
correlationId
safe logging
cleanup
retry policy.

Pero NO crear `executeAnyApi`.

Mantener:

DataSourceProvider
ActionProvider
SignatureProvider
FontProvider

como semánticas distintas.

======================================================================
21. SIGNATURE PROVIDERS
======================================================================

Inspecciona:

src/sisad-pdfme/schemas/signature/providerRegistry.ts
src/sisad-pdfme/adapters/signatureProviderAdapter.ts
src/sisad-pdfme/react/signatureProviderMerge.ts
src/sisad-pdfme/runtime/usePdfmeArtifacts.ts

Un provider externo tipo OneShot es un ejemplo de SignatureProvider, no una condición hardcodeada.

No:

if provider === 'oneshot'

en el core reusable.

El provider puede reutilizar HttpClientAdapter, pero conserva lifecycle propio:

start
pending
poll
webhook correlation
success
recoverable error
terminal error
cancel
timeout.

Tests mediante mock provider. No se requieren credenciales reales.

======================================================================
22. FIRMA, INICIALES Y FUENTES
======================================================================

Conservar:

fullName
initials
styleId.

Firma e iniciales del mismo adoption profile usan el mismo style.

Crear/reutilizar un FontRegistry único para:

text
MVT
date/time cuando aplique
table cuando aplique
signature
initials.

Fuentes:

system
bundled
host.

Antes de rasterizar firma:
await font ready.

No cambiar retroactivamente un artifact ya adoptado al cambiar el estilo actual.

Reemplazar firma debe ser explícito.

Browser/Viewer/PDF deben resolver la misma fuente o una política de fallback explícita.

======================================================================
23. CROSSWALK CON TASKS EXISTENTES
======================================================================

NO crear campaña paralela.

Refina:

RTP-470:
runtime resources + capability convergence para integrations.

RTP-475:
plugin-owned binding metadata.

RTP-480:
DataPointer, OptionValue, validation/completion.

RTP-485/RTP-490:
stale request/CAS/completion.

RTP-510:
multi-user request/cache/signature isolation.

RTP-515:
remote/all-schema stress.

RTP-530/RTP-535:
retirar fetch/axios directo y duplicidad sólo después de gates.

RTP-540:
performance/a11y/privacy/http security.

RTP-545:
release NO puede cerrar sin integration gates.

======================================================================
24. TEST MATRIX
======================================================================

Http:
Axios-like injected client
fetch-like client
dynamic headers
interceptor inheritance
same-origin Authorization
cross-origin Authorization blocked
timeout
abort
binary/json
no secrets serialized.

Pointers:
object
array
scalar
missing
0
false
null
empty
JSONPath many.

Remote options:
static backward compatibility
5 visible rows
scroll
1000+ options
virtualization
search
debounce
pagination
cursor
race
abort
loading
empty
error
retry
selected outside page
keep-stale
typed values.

Form:
remote prefill not touched
human selection touched
background refresh not overwrite dirty
sibling isolation.

Scopes:
User A/B
Document A/B
two Forms same JS realm
switch rapid
cleanup
private cache isolation.

Snapshot/PDF:
offline after commit
display value stable
no secret
no raw oversized response.

Signature:
mock external provider
polling
cancel
error/retry
signature+initials same style
User isolation.

Fonts:
load
failure
fallback
signature artifact parity
text Viewer/PDF parity.

======================================================================
25. QUALITY / LEGACY
======================================================================

Sólo después de comportamiento verde:

knip
jscpd
cycles
wrappers
direct-config-readers
boundary
source-language
docs validators.

Knip no autoriza borrar registries/plugins dinámicos por sí solo.

No empeorar ratchets.

No duplicar transport/client/registry.

======================================================================
26. ACTUALIZACIÓN BRAIN
======================================================================

Mantén como contratos canónicos:

HTTP-CLIENT-CONTRACT
DATA-SOURCE-CONTRACT
DATA-BINDING-CONTRACT
INTEGRATION-RUNTIME-CONTRACT
FONT-REGISTRY-CONTRACT

Actualiza memory/ledger sólo con hechos ejecutados.

No afirmar PASS por haber escrito código.

No crear documentos con fecha/versionado.

======================================================================
27. FINAL GATE
======================================================================

Sólo finaliza cuando:

queue reconciliada
tasks locales cerradas o BLOCKED con evidence
full tests aplicables
lint
typecheck
build
boundary
dedup ratchet
dead-code ratchet
docs validate
stable names
no secret persistence
remote data gates
multi-user gates
signature gates
font parity gates
PDF deterministic gate

hayan sido ejecutados y registrados.

Si todavía existe una task desbloqueada:
CONTINÚA.

NO preguntes si debes continuar.
