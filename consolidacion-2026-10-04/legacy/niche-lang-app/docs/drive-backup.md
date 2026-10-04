# Google Drive: copia de seguridad estructurada

Este documento describe cómo subir el backup de NicheLang sin almacenar credenciales en el repositorio ni ejecutar una autenticación desde el entorno de desarrollo. La operación debe realizarse en la cuenta de Google que el propietario haya elegido.

## 1. Generar y verificar el archivo

Desde la raíz del proyecto:

```bash
pnpm backup
unzip -l /home/ubuntu/Proyecto_NicheLang_Backup_$(date +%F).zip
```

El ZIP contiene como mínimo `/src`, `/docs`, `/tests` y `/assets`. También puede contener `/ci`, `/ops` y archivos de configuración en la raíz. Antes de subirlo, verifica que no haya archivos de entorno reales ni tokens.

## 2. Opción recomendada: interfaz web de Drive

Abre Google Drive con la cuenta de destino, crea una carpeta llamada `NicheLang Backup`, y sube el archivo `Proyecto_NicheLang_Backup_YYYY-MM-DD.zip`. Conserva el ZIP como una instantánea inmutable y, si se necesita navegar por las carpetas, extrae una copia local y sube sus carpetas `/src`, `/docs`, `/tests` y `/assets` dentro de la misma carpeta de Drive.

## 3. Opción CLI después de autenticar el servicio

La autenticación debe ejecutarla el usuario en una terminal de confianza. No se incluye ningún token en el proyecto. Una vez autenticado el CLI de Google Workspace, una secuencia orientativa es:

```bash
gws drive files create \
  --json '{"name":"NicheLang Backup","mimeType":"application/vnd.google-apps.folder"}'

# Sustituye FOLDER_ID por el ID devuelto por el comando anterior.
gws drive files create \
  --upload /home/ubuntu/Proyecto_NicheLang_Backup_YYYY-MM-DD.zip \
  --json '{"name":"Proyecto_NicheLang_Backup_YYYY-MM-DD.zip","parents":["FOLDER_ID"]}' \
  --upload-content-type "application/zip"
```

Para una estructura navegable de carpetas, crea cuatro carpetas hijas con `mimeType` `application/vnd.google-apps.folder`, usando el ID de `NicheLang Backup` como `parents`, y sube el contenido correspondiente del ZIP a cada carpeta. No uses comandos de borrado permanente. Si una versión deja de ser necesaria, muévela a la papelera o conserva la instantánea según la política de retención de la organización.

## 4. Manifest de entrega

| Carpeta | Contenido |
|---|---|
| `/src` | Código de Expo, contextos, servicios, backend, contratos y esquema Drizzle |
| `/docs` | Arquitectura, README ampliado, auditoría y seguimiento |
| `/tests` | Pruebas unitarias, de regresión y consistencia del catálogo |
| `/assets` | Iconos, splash screen y recursos visuales |
| `/ci` | Workflow de GitHub Actions |
| `/ops` | Scripts de backup y validación reproducible |

La copia de Drive debe ser tratada como respaldo de código y documentación, no como sustituto de un backup separado de la base de datos PostgreSQL. Los dumps de base de datos deben cifrarse y gestionarse mediante la política de infraestructura correspondiente.
