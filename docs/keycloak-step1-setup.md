# Keycloak Step 1 - Realm, Clients y Roles

Este setup deja listo:

- Realm: `ecommerce-mf`
- Cliente SPA: `shell-web` (public, Authorization Code + PKCE)
- Cliente API: `ecommerce-api` (confidential)
- Roles realm: `admin`, `manager`, `customer`

## Archivos creados

- `infra/keycloak/docker-compose.yml`
- `infra/keycloak/realm-ecommerce-mf.json`
- `infra/keycloak/start-keycloak.ps1`
- `infra/keycloak/stop-keycloak.ps1`
- `infra/keycloak/keycloak-26.0.7` (distribucion standalone)

## Levantar Keycloak (recomendado sin Docker)

Desde PowerShell en la raiz del proyecto:

```powershell
powershell -ExecutionPolicy Bypass -File infra/keycloak/start-keycloak.ps1
```

Para detenerlo:

```powershell
powershell -ExecutionPolicy Bypass -File infra/keycloak/stop-keycloak.ps1
```

## Levantar Keycloak con Docker (opcional)

Desde la raiz del proyecto:

```bash
docker compose -f infra/keycloak/docker-compose.yml up -d
```

Panel de admin:

- URL: `http://localhost:8080`
- Usuario admin: `admin`
- Password admin: `admin123`

## Verificacion

1. Entrar a `http://localhost:8080/admin`
2. Seleccionar realm `ecommerce-mf`
3. Confirmar clientes:
   - `shell-web`
   - `ecommerce-api`
4. Confirmar roles realm:
   - `admin`
   - `manager`
   - `customer`

## Usuarios de prueba importados

- `admin@ingecoplast.co` / `Admin123*`
- `manager@ingecoplast.co` / `Manager123*`
- `customer@ingecoplast.co` / `Customer123*`

## Notas importantes

- Cambia el secreto de `ecommerce-api` en `infra/keycloak/realm-ecommerce-mf.json`:
  - valor actual: `CHANGE_ME_ECOMMERCE_API_SECRET`
- Cambia las contraseñas de usuarios demo antes de usar en ambientes no locales.
- Si necesitas resetear todo en modo standalone, borra `infra/keycloak/keycloak-26.0.7/data` y vuelve a iniciar.
- Si necesitas resetear todo con Docker, elimina contenedor y levanta nuevamente.

## Endpoints OIDC del realm

- Issuer:
  - `http://localhost:8080/realms/ecommerce-mf`
- Discovery:
  - `http://localhost:8080/realms/ecommerce-mf/.well-known/openid-configuration`
- Token:
  - `http://localhost:8080/realms/ecommerce-mf/protocol/openid-connect/token`
- Auth:
  - `http://localhost:8080/realms/ecommerce-mf/protocol/openid-connect/auth`
- Logout:
  - `http://localhost:8080/realms/ecommerce-mf/protocol/openid-connect/logout`
