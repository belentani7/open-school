import fs from 'fs/promises';
import path from 'path';

const root = process.cwd().includes('agent-library') ? path.join(process.cwd(), '..') : process.cwd();
const out = path.join(root, 'agent-library');

// Reusar currículo como fuente canónica
import { readFile } from 'fs/promises';
const genSource = await readFile(path.join(root, 'generate.js'), 'utf8');
// Extraer tracks manualmente duplicando definición para no hacer eval inseguro
const tracks = [
  { slug:'01-fundamentos', title:'Fundamentos de la Plataforma Android', desc:'Arquitectura del SO, ART, componentes y ciclo de vida.', modules:[
    {slug:'arquitectura-aosp', title:'Arquitectura AOSP y Capas del Sistema', lessons:[{slug:'capas-linux-hal', title:'Capas: Linux Kernel, HAL, Native, Framework y Apps'}, {slug:'art-runtime', title:'Android Runtime (ART) y formato DEX'}, {slug:'compatibilidad-cts', title:'Compatibilidad, CTS y Treble/Mainline'}]},
    {slug:'componentes-manifest', title:'Componentes y AndroidManifest.xml', lessons:[{slug:'activities', title:'Activities, Intents y ciclo de vida'}, {slug:'services-broadcast', title:'Services, BroadcastReceivers y ContentProviders'}, {slug:'manifest-permisos', title:'Manifest, permisos y queries'}]},
    {slug:'recursos-config', title:'Recursos, Configuración y Localización', lessons:[{slug:'resources-qualifiers', title:'Resources, qualifiers y theming'}, {slug:'localizacion-i18n', title:'Internacionalización y plurales'}, {slug:'config-changes', title:'Cambios de configuración y ViewModel'}]},
    {slug:'gradle-build', title:'Gradle, Build Variants y Versionado', lessons:[{slug:'gradle-kts', title:'Gradle Kotlin DSL y Version Catalogs'}, {slug:'build-variants', title:'Build Types, Flavors y BuildConfig'}, {slug:'signing-versioning', title:'Firma, versionCode y versioning semántico'}]},
    {slug:'depuracion-logs', title:'Depuración, Logs y Herramientas', lessons:[{slug:'adb-logcat', title:'ADB, Logcat y Device Explorer'}, {slug:'studio-inspectors', title:'Layout Inspector, Profiler y App Inspection'}, {slug:'crash-analytics', title:'ANR, crashes y reporting'}]},
  ]},
  { slug:'02-kotlin', title:'Kotlin para Android - Lenguaje Oficial', desc:'Sintaxis moderna, null-safety, coroutines, Flow y DSL.', modules:[
    {slug:'sintaxis-fundamentos', title:'Sintaxis, Tipos y Null Safety', lessons:[{slug:'val-var-tipos', title:'val/var, tipos, smart casts e inferencia'}, {slug:'null-safety', title:'Null safety: ?, !!, ?: y let/run'}, {slug:'colecciones-funcional', title:'Colecciones, lambdas y scope functions'}]},
    {slug:'oop-kotlin', title:'OOP en Kotlin: clases, objetos y extensiones', lessons:[{slug:'clases-data-sealed', title:'data, sealed, value y object'}, {slug:'extensiones-dsl', title:'Extensiones, infix y DSL builders'}, {slug:'delegates-properties', title:'Delegated properties y observables'}]},
    {slug:'coroutines', title:'Coroutines y Concurrencia Estructurada', lessons:[{slug:'suspend-corrutinas', title:'suspend, launch, async y scopes'}, {slug:'dispatchers-exceptions', title:'Dispatchers, excepciones y supervision'}, {slug:'testing-coroutines', title:'Testing de coroutines con Turbine'}]},
    {slug:'flow-stateflow', title:'Flow, StateFlow y SharedFlow', lessons:[{slug:'cold-hot-flows', title:'Flows fríos/calientes, operators'}, {slug:'state-shared', title:'StateFlow vs SharedFlow en UI'}, {slug:'lifecycle-aware', title:'Flows con lifecycle: repeatOnLifecycle'}]},
    {slug:'k2-multiplataforma', title:'Kotlin 2.0, KMP y Multiplataforma', lessons:[{slug:'k2-compiler', title:'Compilador K2 y mejoras de performance'}, {slug:'kmp-expect-actual', title:'Kotlin Multiplatform expect/actual'}, {slug:'serialization-parcelize', title:'Serialization, Parcelize y interop'}]},
  ]},
  { slug:'03-java-interop', title:'Java Moderno e Interoperabilidad', desc:'Java 8+ en Android, desugaring, interop Kotlin-Java.', modules:[
    {slug:'java8-desugaring', title:'Java 8+ y Desugaring en Android', lessons:[{slug:'lambdas-streams', title:'Lambdas, Streams y Method References'}, {slug:'time-api', title:'java.time con desugaring'}, {slug:'optional-records', title:'Optional, Records y características modernas'}]},
    {slug:'interop', title:'Interop Kotlin ↔ Java', lessons:[{slug:'platform-types', title:'Platform types y anotaciones de nulabilidad'}, {slug:'jvm-annotations', title:'@JvmStatic, @JvmOverloads, @JvmName'}, {slug:'migracion-kotlin', title:'Estrategia de migración Java → Kotlin'}]},
    {slug:'jvm-memory', title:'JVM Memory Model en Android', lessons:[{slug:'heap-gc', title:'Heap, GC y referencias'}, {slug:'threads-concurrency', title:'Threads, Executors y concurrencia clásica'}, {slug:'jni-ndk', title:'JNI y NDK en proyectos híbridos'}]},
    {slug:'librerias-java', title:'Librerías Java clave en Android', lessons:[{slug:'guava-apache', title:'Guava, Apache Commons y utilidades'}, {slug:'dagger-java', title:'Dagger/Hilt y anotaciones'}, {slug:'rxjava-legacy', title:'RxJava legacy y migración a Flow'}]},
    {slug:'tooling-java', title:'Tooling Java: Lint, ErrorProne, NullAway', lessons:[{slug:'lint-errorprone', title:'Lint, Error Prone y NullAway'}, {slug:'format-checkstyle', title:'Formato, Checkstyle y Spotless'}, {slug:'testing-junit', title:'JUnit 4/5, Mockito y AssertJ'}]},
  ]},
  { slug:'04-ui-compose', title:'UI Moderna con Jetpack Compose y Views', desc:'Compose, Material 3, interop Views, animaciones, accesibilidad.', modules:[
    {slug:'compose-fundamentos', title:'Compose Fundamentos: Composables y Estado', lessons:[{slug:'composables-state', title:'@Composable, recomposición y State'}, {slug:'layouts-modifiers', title:'Layouts, Modifiers y theming'}, {slug:'listas-lazy', title:'LazyColumn/Row, keys y performance'}]},
    {slug:'material3-design', title:'Material 3, Design Tokens y Theming', lessons:[{slug:'m3-tokens', title:'Material 3 y Design Tokens'}, {slug:'adaptive-layouts', title:'Adaptive layouts y Window Size Classes'}, {slug:'motion-anim', title:'Motion: AnimatedVisibility y transitions'}]},
    {slug:'views-interop', title:'Views Clásicas e Interoperabilidad', lessons:[{slug:'view-system', title:'View System: ViewGroup y Custom Views'}, {slug:'interop-compose-view', title:'Interop: AndroidView y ComposeView'}, {slug:'fragments-navigation', title:'Fragments modernos y Navigation'}]},
    {slug:'accesibilidad-ui', title:'Accesibilidad y UX Inclusiva', lessons:[{slug:'semantics-talkback', title:'Semantics, TalkBack y roles'}, {slug:'a11y-testing', title:'Testing de accesibilidad automatizado'}, {slug:'i18n-rtl', title:'RTL, localización y fuentes escalables'}]},
    {slug:'graficos-media-ui', title:'Gráficos, Media y Canvas Avanzado', lessons:[{slug:'canvas-graphics', title:'Canvas, Path y gráficos vectoriales'}, {slug:'coil-glide', title:'Coil/Glide: imágenes y caching'}, {slug:'exoplayer-media3', title:'Media3 ExoPlayer y UI de reproducción'}]},
  ]},
  { slug:'05-arquitectura', title:'Arquitectura, Navegación y Modularización', desc:'MVVM/MVI, Clean Architecture, modularización, Navigation 2.', modules:[
    {slug:'mvvm-mvi', title:'MVVM, MVI y presentación', lessons:[{slug:'viewmodel-state', title:'ViewModel, UI State y unidireccionalidad'}, {slug:'mvi-pattern', title:'Patrón MVI: intent → reducer → state'}, {slug:'usecases-domain', title:'UseCases/Interactors y capa domain'}]},
    {slug:'clean-arch', title:'Clean Architecture y capas', lessons:[{slug:'capas-data-domain-ui', title:'Capas data/domain/ui y dependencias'}, {slug:'repository-pattern', title:'Repository, DataSource y mappers'}, {slug:'modularizacion-escala', title:'Modularización a escala y boundaries'}]},
    {slug:'navigation2', title:'Navigation Compose y Deep Links', lessons:[{slug:'nav-graph', title:'NavGraph, type-safety y argumentos'}, {slug:'deeplinks-nav', title:'Deep links y app links verificados'}, {slug:'backstack-state', title:'Back stack, state restoration y predictive back'}]},
    {slug:'di-hilt', title:'DI con Hilt/Koin y Scopes', lessons:[{slug:'hilt-modules', title:'Hilt: modules, components y scopes'}, {slug:'koin-alternativa', title:'Koin como alternativa ligera'}, {slug:'testing-di', title:'Testing con DI y fakes'}]},
    {slug:'offline-sync', title:'Offline-first y Sincronización', lessons:[{slug:'offline-cache', title:'Estrategias offline y cache'}, {slug:'sync-workmanager', title:'Sincronización con WorkManager'}, {slug:'datastore-preferences', title:'DataStore vs SharedPreferences'}]},
  ]},
  { slug:'06-datos', title:'Datos, Persistencia y Almacenamiento', desc:'Room, SQLDelight, DataStore, Files, ContentProvider y Scoped Storage.', modules:[
    {slug:'room-sqlite', title:'Room y SQLite', lessons:[{slug:'room-entities', title:'Entities, DAOs y relaciones'}, {slug:'room-migraciones', title:'Migraciones, AutoMigrations y testing'}, {slug:'room-paging', title:'Room + Paging 3 y Flow'}]},
    {slug:'filesystem-storage', title:'Filesystem y Scoped Storage', lessons:[{slug:'scoped-storage', title:'Scoped Storage y MediaStore'}, {slug:'saf-storage', title:'Storage Access Framework (SAF)'}, {slug:'cache-files', title:'Cache, filesDir y backup rules'}]},
    {slug:'contentprovider', title:'ContentProviders y IPC', lessons:[{slug:'provider-basics', title:'ContentProvider básico y contracts'}, {slug:'ipc-binder', title:'Binder, AIDL y comunicación inter-proceso'}, {slug:'contacts-calendar', title:'Providers del sistema: Contacts/Calendar'}]},
    {slug:'preferences-datastore', title:'Preferencias y DataStore', lessons:[{slug:'datastore-proto', title:'Proto DataStore y Preferences'}, {slug:'encrypted-prefs', title:'EncryptedSharedPreferences y Security Crypto'}, {slug:'settings-ui', title:'Preference UI con Compose'}]},
    {slug:'backup-restore', title:'Backup, Restore y Export', lessons:[{slug:'autobackup', title:'Auto Backup y Key/Value Backup'}, {slug:'cloud-backup', title:'Backup en la nube y restore testing'}, {slug:'export-import', title:'Export/Import de datos del usuario'}]},
  ]},
  { slug:'07-conectividad', title:'Conectividad, Red y Protocolos', desc:'HTTP, REST, GraphQL, WebSocket, gRPC, BT, NFC, UWB y IoT.', modules:[
    {slug:'http-retrofit', title:'HTTP/REST con Retrofit + OkHttp', lessons:[{slug:'retrofit-okhttp', title:'Retrofit, OkHttp y interceptors'}, {slug:'serializacion', title:'Serialización: Moshi, kotlinx-serialization'}, {slug:'errores-resiliencia', title:'Errores, retry y circuit breaker'}]},
    {slug:'graphql-websockets', title:'GraphQL y Tiempo Real', lessons:[{slug:'graphql-apollo', title:'GraphQL con Apollo Kotlin'}, {slug:'websockets-sse', title:'WebSockets y SSE'}, {slug:'push-fcm', title:'Push con FCM y notificaciones'}]},
    {slug:'grpc-protobuf', title:'gRPC, Protobuf y streaming', lessons:[{slug:'protobuf-contracts', title:'Protobuf como contrato'}, {slug:'grpc-android', title:'gRPC en Android con OkHttp channel'}, {slug:'perf-protobuf', title:'Performance y tamaño vs JSON'}]},
    {slug:'bluetooth-nfc', title:'Bluetooth, NFC, UWB y Nearby', lessons:[{slug:'ble-classic', title:'BLE y Classic Bluetooth'}, {slug:'nfc-hce', title:'NFC y Host Card Emulation'}, {slug:'uwb-nearby', title:'UWB y Nearby Connections'}]},
    {slug:'iot-mqtt', title:'IoT: MQTT, CoAP y conectividad', lessons:[{slug:'mqtt-android', title:'MQTT en Android (Paho)'}, {slug:'coap-http2', title:'CoAP y HTTP/2 en dispositivos'}, {slug:'connectivity-manager', title:'ConnectivityManager y NetworkCapabilities'}]},
  ]},
  { slug:'08-sistema', title:'Sistema, Hardware y Multimedia', desc:'Services, WorkManager, sensores, cámara, audio, location.', modules:[
    {slug:'background-work', title:'Background Work Moderno', lessons:[{slug:'workmanager', title:'WorkManager: workers y constraints'}, {slug:'foreground-services', title:'Foreground Services y tipos 14+'}, {slug:'alarms-exact', title:'Alarms, exact alarms y Doze'}]},
    {slug:'sensors-hardware', title:'Sensores y Hardware', lessons:[{slug:'sensormanager', title:'SensorManager: acelerómetro, gyro'}, {slug:'biometrics-haptics', title:'Biometrics y haptics'}, {slug:'usb-accessory', title:'USB Host/Accessory'}]},
    {slug:'camera-cameraX', title:'Cámara con CameraX', lessons:[{slug:'camerax-preview', title:'Preview, ImageCapture y análisis'}, {slug:'mlkit-vision', title:'ML Kit Vision: barcode, face, text'}, {slug:'video-capture', title:'Video capture y estabilización'}]},
    {slug:'media-audio', title:'Audio, Media3 y Playback', lessons:[{slug:'media3-audio', title:'Media3: ExoPlayer y session'}, {slug:'audio-focus', title:'Audio focus y routing'}, {slug:'speech-tts', title:'Speech-to-Text y TTS'}]},
    {slug:'location-maps', title:'Location y Maps', lessons:[{slug:'fused-location', title:'Fused Location Provider'}, {slug:'maps-compose', title:'Maps Compose y clustering'}, {slug:'background-location', title:'Background location y permisos 10+'}]},
  ]},
  { slug:'09-seguridad', title:'Seguridad, Rendimiento y Calidad', desc:'Cifrado, biometría, R8, baseline profiles, testing y quality gates.', modules:[
    {slug:'crypto-keystore', title:'Criptografía y Android Keystore', lessons:[{slug:'keystore-keys', title:'Keystore, StrongBox y claves'}, {slug:'encrypt-tink', title:'Tink y Jetpack Security'}, {slug:'network-security', title:'Network Security Config y pinning'}]},
    {slug:'auth-biometric', title:'Auth, Biometrics y SafetyNet', lessons:[{slug:'biometric-prompt', title:'BiometricPrompt y fallback'}, {slug:'passkeys-credentials', title:'Passkeys y Credential Manager'}, {slug:'play-integrity', title:'Play Integrity API'}]},
    {slug:'perf-baseline', title:'Performance y Baseline Profiles', lessons:[{slug:'baseline-profiles', title:'Baseline Profiles y startup'}, {slug:'r8-proguard', title:'R8/ProGuard y shrinking'}, {slug:'perfetto-macro', title:'Perfetto, Macrobenchmark y Jank'}]},
    {slug:'testing-calidad', title:'Testing: Unit, UI y E2E', lessons:[{slug:'unit-tests', title:'Unit tests: JUnit, MockK, Turbine'}, {slug:'compose-ui-tests', title:'Compose UI tests y Espresso'}, {slug:'e2e-ci', title:'E2E, screenshot y CI sharding'}]},
    {slug:'privacy-permisos', title:'Privacidad y Permisos 13/14', lessons:[{slug:'runtime-permissions', title:'Runtime permissions y rationale'}, {slug:'photo-picker-perms', title:'Photo Picker y permisos granulares'}, {slug:'privacy-sandbox', title:'Privacy Sandbox y data safety'}]},
  ]},
  { slug:'10-publicacion', title:'Publicación, CI/CD y Ecosistema Expandido', desc:'Play Store, signing, CI/CD, Wear OS, TV, Auto, XR.', modules:[
    {slug:'play-publish', title:'Google Play: firma y publicación', lessons:[{slug:'app-bundle', title:'Android App Bundle y Play Signing'}, {slug:'play-tracks', title:'Tracks: internal/closed/open/prod y staged rollout'}, {slug:'inapp-billing', title:'In-App Billing y subscriptions'}]},
    {slug:'cicd-devops', title:'CI/CD y DevOps', lessons:[{slug:'github-actions', title:'GitHub Actions y Gradle cache'}, {slug:'fastlane-ci', title:'Fastlane, version bump y deploy'}, {slug:'quality-gates', title:'Quality gates: lint, detekt, coverage'}]},
    {slug:'wear-tv-auto', title:'Wear OS, TV y Auto', lessons:[{slug:'wear-compose', title:'Wear Compose y Tiles'}, {slug:'tv-compose', title:'Android TV y Compose for TV'}, {slug:'auto-projected', title:'Android Auto y Automotive OS'}]},
    {slug:'xr-foldables', title:'Foldables, Tablets y XR', lessons:[{slug:'foldables-adaptive', title:'Foldables y postures'}, {slug:'tablets-responsive', title:'Tablets y large screens'}, {slug:'xr-jetpack', title:'Jetpack XR y ARCore'}]},
    {slug:'enterprise-distribucion', title:'Enterprise y Distribución Avanzada', lessons:[{slug:'managed-google-play', title:'Managed Google Play y EMM'}, {slug:'device-policy', title:'Device Policy y work profiles'}, {slug:'agentes-skills', title:'Agentes IA con skills y orquestación'}]},
  ]},
];

await fs.mkdir(out, { recursive: true });
await fs.mkdir(path.join(out, 'skills'), { recursive: true });
await fs.mkdir(path.join(out, 'tools'), { recursive: true });
await fs.mkdir(path.join(out, 'protocols'), { recursive: true });
await fs.mkdir(path.join(out, 'ontology'), { recursive: true });
await fs.mkdir(path.join(out, 'chunks'), { recursive: true });
await fs.mkdir(path.join(out, 'graph'), { recursive: true });

// 1. MANIFEST AGENT-NATIVE (canónico)
const pages = [];
pages.push({ id:'root', type:'Platform', slug:'/', title:'Android Platform — Biblioteca de Alejandría para Agentes', path:'index.html', level:0, tags:['android','platform','aosp'], languages:['kotlin','java','xml','proto','graphql'], protocols:['https','grpc','mqtt','ble','nfc'], children: tracks.map(t=>`track:${t.slug}`) });
let totalLessons = 0;
for(const t of tracks){
  pages.push({ id:`track:${t.slug}`, type:'Track', slug:t.slug, title:t.title, path:`tracks/${t.slug}/index.html`, level:1, parent:'root', children: t.modules.map(m=>`module:${t.slug}/${m.slug}`), tags:[t.slug], languages:['kotlin','java'], protocols:['https'] });
  for(const m of t.modules){
    pages.push({ id:`module:${t.slug}/${m.slug}`, type:'Module', slug:m.slug, title:m.title, path:`tracks/${t.slug}/modules/${m.slug}/index.html`, level:2, parent:`track:${t.slug}`, children: m.lessons.map(l=>`lesson:${t.slug}/${m.slug}/${l.slug}`), tags:[m.slug] });
    for(const l of m.lessons){
      totalLessons++;
      pages.push({ id:`lesson:${t.slug}/${m.slug}/${l.slug}`, type:'Lesson', slug:l.slug, title:l.title, path:`tracks/${t.slug}/modules/${m.slug}/lessons/${l.slug}.html`, level:3, parent:`module:${t.slug}/${m.slug}`, tags:[l.slug, m.slug, t.slug], languages: inferLangs(t.slug,m.slug,l.slug), protocols: inferProtocols(t.slug,m.slug,l.slug), criteria: inferCriteria(m.slug,l.slug), definition:`Síntesis educativa de ${l.title}.`, source_canonical: inferSource(t.slug,m.slug,l.slug), embeddings:`chunks/${t.slug}__${m.slug}__${l.slug}.json`, example:`kotlin:${l.slug}` });
    }
  }
}
// docs
const docs = [
  {slug:'estandares', title:'Estándares HTML5, Protocolos y Criterios'},
  {slug:'glosario', title:'Glosario Android — Definiciones de Plataforma'},
  {slug:'arquitectura-global', title:'Arquitectura Global y Criterios de Consolidación'},
  {slug:'agentes', title:'Agentes con Skills — Orquestación al estilo Coursera'},
  {slug:'sobre-mi', title:'Sobre este asistente — Prompt sobre mí mismo'},
];
for(const d of docs) pages.push({ id:`doc:${d.slug}`, type:'Doc', slug:d.slug, title:d.title, path:`docs/${d.slug}/index.html`, level:1, parent:'root', tags:[d.slug] });

const manifest = {
  platform: 'android-alexandria',
  version: '1.0.0',
  generated_at: new Date().toISOString(),
  description: 'Biblioteca de Alejandría para agentes: plataforma Android completa, 216 HTMLs + grafo + chunks + skills. Lenguaje nativo para agentes, no solo para humanos.',
  stats: { pages: pages.length, tracks: tracks.length, modules: 50, lessons: totalLessons, docs: docs.length, html_files: 216 },
  languages_covered: ['kotlin','java','xml','kotlin-dsl','sql','proto','graphql','yaml','bash'],
  protocols_covered: ['https','http2','http3','tls1.3','grpc','websocket','sse','mqtt','coap','ble','classic-bt','nfc','uwb','nearby','fcm'],
  criteria_covered: ['cts','cdd','api-level','permission-runtime','scoped-storage','nsc','keystore','strongbox','play-integrity','baseline-profiles','r8','a11y-wcag2.2','privacy-sandbox'],
  design_principles: ['html5-semantico-en-todos-los-niveles','estructura-implicita-en-codigo','contratos-como-verdad-unica','shift-left-security','fitness-functions-bloqueantes'],
  pages
};
await fs.writeFile(path.join(out,'manifest.json'), JSON.stringify(manifest,null,2));

function inferLangs(t,m,l){
  if(t.includes('kotlin')) return ['kotlin','kotlin-coroutines','kotlin-flow'];
  if(t.includes('java')) return ['java','kotlin'];
  if(m.includes('room')||l.includes('room')) return ['kotlin','sql'];
  if(m.includes('grpc')||l.includes('protobuf')) return ['proto','kotlin'];
  if(m.includes('graphql')) return ['graphql','kotlin'];
  return ['kotlin','xml'];
}
function inferProtocols(t,m,l){
  if(t==='07-conectividad') return ['https','http2','tls1.3','grpc','websocket','mqtt'];
  if(m.includes('bluetooth')||l.includes('ble')) return ['ble','gatt'];
  if(m.includes('nfc')) return ['nfc','ndef'];
  if(l.includes('fcm')||l.includes('push')) return ['fcm','https'];
  return [];
}
function inferCriteria(m,l){
  if(l.includes('permission')||l.includes('privacy')) return ['permission-runtime','privacy-sandbox'];
  if(m.includes('crypto')||l.includes('keystore')) return ['keystore','strongbox','nsc'];
  if(l.includes('baseline')) return ['baseline-profiles','macrobenchmark'];
  return ['api-level','cts'];
}
function inferSource(t,m,l){
  if(t==='01-fundamentos') return 'https://source.android.com / https://developer.android.com/guide';
  if(t==='02-kotlin') return 'https://kotlinlang.org/docs/home.html';
  return 'https://developer.android.com';
}

// 2. ONTOLOGÍA JSON-LD (RDF para agentes)
const ontology = {
  "@context": {
    "alex": "https://android.example.com/ontology#",
    "schema": "https://schema.org/",
    "id": "@id",
    "type": "@type"
  },
  "@graph": [
    { id:'alex:Platform', type:'rdfs:Class', label:'Platform', comment:'Plataforma Android completa. Se compone de Tracks.' },
    { id:'alex:Track', type:'rdfs:Class', label:'Track', comment:'Área de conocimiento (ej: Kotlin). Contiene Modules.' },
    { id:'alex:Module', type:'rdfs:Class', label:'Module', comment:'Módulo temático. Contiene Lessons.' },
    { id:'alex:Lesson', type:'rdfs:Class', label:'Lesson', comment:'Unidad atómica: definición + ejemplo + criterio + referencia oficial.' },
    { id:'alex:Protocol', type:'rdfs:Class', label:'Protocol', comment:'Protocolo de red/hardware: https, grpc, ble, nfc, mqtt...' },
    { id:'alex:Language', type:'rdfs:Class', label:'Language', comment:'Lenguaje soportado: kotlin, java, proto, graphql...' },
    { id:'alex:Criterion', type:'rdfs:Class', label:'Criterion', comment:'Criterio bloqueante: cts, keystore, permission-runtime...' },
    { id:'alex:Skill', type:'rdfs:Class', label:'Skill', comment:'Habilidad de agente: mass-generation, gap-analysis...' },
    ...['kotlin','java','proto','graphql','sql','xml'].map(l=>({ id:`alex:lang:${l}`, type:'alex:Language', label:l })),
    ...['https','grpc','ble','nfc','mqtt','fcm','tls1.3'].map(p=>({ id:`alex:proto:${p}`, type:'alex:Protocol', label:p })),
    ...pages.filter(p=>p.type==='Lesson').map(p=>({ id:`alex:${p.id.replace(/:/g,'/')}`, type:'alex:Lesson', label:p.title, path:p.path, parent: p.parent, tags:p.tags, source:p.source_canonical }))
  ]
};
await fs.writeFile(path.join(out,'ontology/ontology.jsonld'), JSON.stringify(ontology,null,2));

// 3. KNOWLEDGE GRAPH (nodos + aristas para RAG)
const nodes = pages.map(p=>({ id:p.id, label:p.title, type:p.type, path:p.path, tags:p.tags||[] }));
const edges = [];
for(const p of pages){
  if(p.parent) edges.push({ from:p.parent, to:p.id, rel:'contains' });
  if(p.children) for(const c of p.children) edges.push({ from:p.id, to:c, rel:'contains' });
  if(p.protocols) for(const pr of p.protocols) edges.push({ from:p.id, to:`proto:${pr}`, rel:'usesProtocol' });
  if(p.languages) for(const lg of p.languages) edges.push({ from:p.id, to:`lang:${lg}`, rel:'writtenIn' });
}
const graph = { nodes, edges, stats:{ nodes:nodes.length, edges:edges.length } };
await fs.writeFile(path.join(out,'graph/knowledge-graph.json'), JSON.stringify(graph,null,2));

// 4. SKILLS (lenguaje nativo para agentes - YAML-like JSON)
const skills = [
  {
    id:'content-creator',
    name:'content-creator',
    description:'Detecta gaps en YAMLs, genera contenido faltante, completa TODOs.',
    inputs:['src/content/**/*.yaml','manifest.json'],
    outputs:['src/content/**/*.yaml (patched)','report/gap-report.json'],
    capabilities:['gap-analysis','auto-completion','quality-validation'],
    tools:['read_yaml','write_yaml','llm_generate'],
    prompt:'Eres el Content Creator. Lista campos TODO/vacíos y genera definiciones sintéticas con referencia oficial.'
  },
  {
    id:'html-generator',
    name:'html-generator',
    description:'Genera masivamente 200+ HTMLs HTML5 semánticos desde plantillas.',
    inputs:['manifest.json','src/templates/*.html'],
    outputs:['tracks/**/index.html','modules/**/index.html','lessons/**/*.html'],
    capabilities:['mass-generation','template-rendering','asset-injection','a11y-check'],
    tools:['render_template','inject_assets','validate_html5'],
    scale:'216 HTMLs por ejecución, idempotente'
  },
  {
    id:'validator',
    name:'validator',
    description:'Valida HTML5, enlaces internos rotos, a11y y coherencia de breadcrumbs.',
    inputs:['**/*.html'],
    outputs:['reports/validation.json'],
    capabilities:['html-validation','link-check','a11y-wcag','coherence'],
    block:'PR si <95% o enlaces rotos>0'
  },
  {
    id:'orchestrator',
    name:'orchestrator',
    description:'Orquesta al estilo Coursera: distribuye tareas, resuelve dependencias, reporta 100%.',
    inputs:['manifest.json','skills/*'],
    outputs:['reports/completion-report.json'],
    capabilities:['task-distribution','dependency-resolution','progress-tracking'],
    model:'coursera-style'
  },
  {
    id:'semantic-search',
    name:'semantic-search',
    description:'RAG sobre chunks.jsonl + graph. Responde con cita a lección y fuente oficial.',
    inputs:['chunks/*.json','graph/knowledge-graph.json'],
    outputs:['answer + citations'],
    capabilities:['vector-search','graph-traversal','citation']
  },
  {
    id:'protocol-validator',
    name:'protocol-validator',
    description:'Valida contratos .proto / openapi / graphql contra implementaciones.',
    inputs:['protocols/*.proto','protocols/openapi.yaml'],
    outputs:['reports/contract-report.json'],
    capabilities:['proto-lint','openapi-validate','breaking-change-detection']
  },
  {
    id:'security-auditor',
    name:'security-auditor',
    description:'Shift-left: SAST, NSC, Keystore, permisos 13/14, Play Integrity.',
    inputs:['AndroidManifest.xml','network_security_config.xml','src/**/*.kt'],
    outputs:['reports/security.json'],
    capabilities:['sast','nsc-check','keystore-check','permission-audit']
  },
  {
    id:'architecture-guardian',
    name:'architecture-guardian',
    description:'Fitness functions (ArchUnit) que invierten Conway: bloquea imports ilegales entre features.',
    inputs:['src/**/*.kt'],
    outputs:['reports/architecture.json'],
    capabilities:['fitness-functions','boundary-check','conway-inversion']
  }
];
for(const s of skills) await fs.writeFile(path.join(out,`skills/${s.id}.skill.json`), JSON.stringify(s,null,2));
await fs.writeFile(path.join(out,'skills/index.json'), JSON.stringify({ skills: skills.map(s=>s.id), count: skills.length },null,2));

// 5. MCP TOOLS (Model Context Protocol - herramientas invocables por agentes)
const tools = [
  {
    name:'alexandria_query',
    description:'Consulta la Biblioteca de Alejandría. Devuelve lecciones, definiciones y fuentes oficiales.',
    inputSchema:{ type:'object', properties:{ query:{type:'string'}, tags:{type:'array'}, level:{type:'string', enum:['track','module','lesson'] } }, required:['query'] },
    handler:'agent-library/tools/alexandria_query.js'
  },
  {
    name:'alexandria_generate_htmls',
    description:'Genera/regenera 216 HTMLs faltantes. Estructura implícita en código.',
    inputSchema:{ type:'object', properties:{ target:{type:'string'}, finalize:{type:'boolean'} } },
    handler:'generate.js'
  },
  {
    name:'alexandria_validate',
    description:'Valida HTML5 + enlaces + a11y. Bloquea si no 100%.',
    inputSchema:{ type:'object', properties:{} },
    handler:'agent-library/tools/validate.js'
  },
  {
    name:'alexandria_get_protocol',
    description:'Obtiene definición canónica de protocolo (https, grpc, ble, nfc, mqtt) con ejemplo.',
    inputSchema:{ type:'object', properties:{ protocol:{type:'string'} }, required:['protocol'] },
    handler:'agent-library/protocols/index.json'
  }
];
await fs.writeFile(path.join(out,'tools/mcp-tools.json'), JSON.stringify({ mcp:{ version:'2024-11-05', tools } },null,2));

// 6. PROTOCOLS AS CODE (contratos canónicos)
await fs.writeFile(path.join(out,'protocols/android-contracts.proto'), `syntax = "proto3";
package android.alexandria;
option java_package = "com.example.alexandria";

// Contrato canónico: cada Lesson tiene referencia oficial y criterio bloqueante
message Lesson {
  string id = 1; // lesson:track/module/lesson
  string title = 2;
  repeated string languages = 3; // kotlin, java, proto
  repeated string protocols = 4; // https, grpc, ble
  repeated string criteria = 5; // cts, keystore
  string source_canonical = 6; // https://developer.android.com/...
  string path = 7; // tracks/.../lesson.html
}
message Manifest {
  string platform = 1;
  string version = 2;
  repeated Lesson lessons = 3;
}
`);
await fs.writeFile(path.join(out,'protocols/openapi.yaml'), `openapi: 3.1.0
info:
  title: Alexandria Agent API
  version: 1.0.0
  description: API nativa para agentes - Biblioteca de Alejandría Android
paths:
  /query:
    post:
      summary: Consulta semántica
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                query: {type: string, example: "WorkManager vs Foreground Service"}
      responses:
        '200':
          description: Lecciones con citas y fuentes oficiales
  /generate:
    post:
      summary: Genera HTMLs faltantes (216)
      responses: {'200': {description: Generados}}
  /validate:
    get:
      summary: Valida HTML5 + enlaces
`);

await fs.writeFile(path.join(out,'protocols/protocols.json'), JSON.stringify({
  https:{ name:'HTTPS/TLS 1.3', transport:'TCP+TLS', use:'Retrofit/OkHttp + NSC + pinning', example:'GET https://api.example.com/v1/items' },
  grpc:{ name:'gRPC/Protobuf', transport:'HTTP/2', use:'Contratos .proto streaming', example:'rpc GetItem(GetItemRequest) returns (Item)' },
  websocket:{ name:'WebSocket/SSE', transport:'TCP', use:'Tiempo real', example:'ws://... / text/event-stream' },
  ble:{ name:'BLE GATT', transport:'Bluetooth Low Energy', use:'Sensors/IoT', example:'scan -> connect -> readCharacteristic' },
  nfc:{ name:'NFC NDEF/HCE', transport:'NFC', use:'Tags y pagos', example:'NDEF record TYPE_TEXT' },
  mqtt:{ name:'MQTT', transport:'TCP', use:'IoT', example:'publish topic=qos1' },
  fcm:{ name:'FCM', transport:'HTTPS', use:'Push', example:'POST https://fcm.googleapis.com/v1/projects/.../messages:send' }
},null,2));

// 7. CHUNKS para RAG (cada lección = chunk con metadatos ricos)
for(const p of pages.filter(p=>p.type==='Lesson')){
  const chunk = {
    id: p.id,
    text: `Título: ${p.title}. Contexto: ${p.tags.join(', ')}. Definición: ${p.definition} Fuente canónica: ${p.source_canonical}. Path: ${p.path}. Criterios: ${(p.criteria||[]).join(', ')}. Lenguajes: ${(p.languages||[]).join(', ')}. Protocolos: ${(p.protocols||[]).join(', ')}.`,
    metadata: { title:p.title, path:p.path, tags:p.tags, source:p.source_canonical, level:p.level },
    embedding_hint: `Chunk para RAG de ${p.title}. Usar para responder con cita a ${p.path}.`
  };
  await fs.writeFile(path.join(out,`chunks/${p.id.replace(/[:\/]/g,'__')}.json`), JSON.stringify(chunk,null,2));
}
const chunksIndex = { count: pages.filter(p=>p.type==='Lesson').length, format:'json per lesson', usage:'Cargar en vector DB (pinecone/weaviate) con embedding text-embedding-3-large' };
await fs.writeFile(path.join(out,'chunks/index.json'), JSON.stringify(chunksIndex,null,2));

// 8. AGENT README (lenguaje nativo, no humano)
await fs.writeFile(path.join(out,'README.md'), `# Alexandria — Biblioteca para Agentes (no para humanos)

**Esto no es una web. Es una base de conocimiento canónica para agentes.**

## Cómo me usan los agentes (lenguaje nativo)

\`\`\`js
// 1. Cargar manifiesto canónico (216 páginas indexadas)
import manifest from './agent-library/manifest.json'
// manifest.pages[] -> cada HTML con id, type, tags, protocols, languages, source_canonical

// 2. RAG: cargar chunks
const chunks = await loadAll('./agent-library/chunks/*.json')
// chunk.text + chunk.metadata -> embedding

// 3. Grafo: traversar dependencias
import graph from './agent-library/graph/knowledge-graph.json'
// graph.nodes + graph.edges (contains, usesProtocol, writtenIn)

// 4. Ontología JSON-LD
import ontology from './agent-library/ontology/ontology.jsonld'
// RDF listo para reasoners

// 5. Skills invocables
import orchestrator from './agent-library/skills/orchestrator.skill.json'
// orchestrator.tools -> ejecutar

// 6. MCP tools
import mcp from './agent-library/tools/mcp-tools.json'
// mcp.tools[].name = alexandria_query | alexandria_generate_htmls
\`\`\`

## Endpoints agente

- \`POST /query {query, tags, level}\` -> lecciones + citas oficiales
- \`POST /generate {target, finalize}\` -> 216 HTMLs
- \`GET /validate\` -> HTML5 + enlaces
- \`GET /protocol/{https|grpc|ble|nfc|mqtt}\` -> contrato canónico

## Principios

1. **Fuente canónica enlazada, no copiada**: cada lesson.source_canonical apunta a developer.android.com/source.android.com
2. **Estructura implícita**: el código (generate.js) ES la estructura, no un doc aparte
3. **HTML5 en todos los niveles**: validador bloquea si falta <header>/<nav>/<main>/<article>/<footer>
4. **Fitness functions**: architectural-guardian bloquea imports ilegales (Conway invertida)

## Estadísticas canónicas
- 216 HTMLs, 10 tracks, 50 módulos, 150 lecciones, 5 docs
- 9 lenguajes, 15 protocolos, 13 criterios bloqueantes
- 8 skills, 4 MCP tools, 1 ontología JSON-LD, 1 grafo 200+ nodos
`);

// 9. Estructura implícita como código: exponer generate.js como skill
await fs.writeFile(path.join(out,'pipeline.yaml'), `name: Alexandria Completion Pipeline
on: [push, pull_request, manual]
jobs:
  gap-analysis:
    runs-on: ubuntu-latest
    steps:
      - run: node agent-library/tools/alexandria_query.js --check-gaps
  content-creator:
    needs: gap-analysis
    steps:
      - run: node generate-agent-library.js
  html-generator:
    needs: content-creator
    steps:
      - run: node ../generate.js
  validator:
    needs: html-generator
    steps:
      - run: node agent-library/tools/validate.js --strict --a11y 95
  security-auditor:
    steps:
      - run: node agent-library/skills/security-auditor.skill.json
  architecture-guardian:
    steps:
      - run: npx archunit --rules pipeline.yaml
`);

console.log('Alexandria agent-library generada:', manifest.stats);
