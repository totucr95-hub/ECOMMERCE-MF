# Keycloak Step 2 - Integracion Frontend (sin .NET aun)

Esta guia explica lo que ya quedo implementado en el workspace para usar Keycloak en frontend.

## Que se implemento

1. Dependencia instalada:

- `keycloak-js`

2. Configuracion y bootstrap:

- Se creo configuracion base en `shared-core/src/lib/keycloak.config.ts`
- El shell inicializa sesion Keycloak al arrancar con `APP_INITIALIZER` en `shell/src/app/app.config.ts`

3. Auth real por OIDC:

- `AuthService` ahora usa Keycloak para:
  - `init()`
  - `loginWithKeycloak()`
  - `refreshToken()`
  - `logout()`
- Archivo: `shared-core/src/lib/services.ts`

4. Guards y token HTTP:

- Guards esperan init de auth antes de decidir acceso.
- `jwtInterceptor` adjunta token solo a requests API.
- Archivo: `shared-core/src/lib/security.ts`

5. Login UI simplificado:

- Boton `Ingresar con Keycloak` en lugar de formulario mock.
- Archivos:
  - `auth/src/app/pages/login/login.page.ts`
  - `auth/src/app/pages/login/login.page.html`

6. Silent SSO:

- Archivo publico para `check-sso`: `shell/public/silent-check-sso.html`

## Como usarlo ahora mismo

## 1) Levanta Keycloak

```powershell
powershell -ExecutionPolicy Bypass -File infra/keycloak/start-keycloak.ps1
```

Alternativa con Docker:

```bash
docker compose -f infra/keycloak/docker-compose.yml up -d
```

## 2) Levanta el frontend shell

```bash
npx nx serve shell
```

## 3) Abre la app

- URL: `http://localhost:4200`
- Ve a `/auth/login`
- Clic en `Ingresar con Keycloak`

## 4) Credenciales demo

- `admin@ingecoplast.co` / `Admin123*`
- `manager@ingecoplast.co` / `Manager123*`
- `customer@ingecoplast.co` / `Customer123*`

## 5) Flujo esperado

- Login exitoso -> redirige a `/admin`
- Guard admin valida rol `admin`
- Requests a API (cuando exista .NET) incluiran `Authorization: Bearer <token>` automaticamente

## Personalizar config sin recompilar

La app lee estos valores desde localStorage (si existen):

- `keycloak.url`
- `keycloak.realm`
- `keycloak.spaClientId`

Ejemplo en consola del navegador:

```js
localStorage.setItem('keycloak.url', 'http://localhost:8080');
localStorage.setItem('keycloak.realm', 'ecommerce-mf');
localStorage.setItem('keycloak.spaClientId', 'shell-web');
location.reload();
```

## Problemas comunes

1. Error al iniciar sesion con Keycloak

- Verifica que Keycloak este arriba en `http://localhost:8080`
- Revisa que el realm `ecommerce-mf` exista

2. Redirect invalid

- Revisa `redirectUris` y `webOrigins` del cliente `shell-web`
- Ya se incluyeron puertos `4200` a `4204` en el import del realm

3. Entra pero no ve admin

- Verifica que el usuario tenga rol realm `admin`

## Nota sobre backend

Aun sin .NET, todo el frontend queda listo para autenticarse en Keycloak.
Cuando montes API .NET, solo faltara validar JWT con:

- Authority: `http://localhost:8080/realms/ecommerce-mf`
- Audience/Client: `ecommerce-api`
