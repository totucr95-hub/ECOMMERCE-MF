import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const args = new Map();

for (let index = 2; index < process.argv.length; index += 2) {
  const key = process.argv[index];
  const value = process.argv[index + 1];

  if (!key?.startsWith('--') || !value) {
    throw new Error(`Invalid argument near "${key ?? ''}".`);
  }

  args.set(key.slice(2), value);
}

const requiredUrl = (name) => {
  const value = args.get(name);
  if (!value) {
    throw new Error(`Missing required argument --${name}.`);
  }

  const url = new URL(value);
  const isLocal = ['localhost', '127.0.0.1'].includes(url.hostname);
  if (url.protocol !== 'https:' && !isLocal) {
    throw new Error(`--${name} must use HTTPS outside localhost.`);
  }

  return value.replace(/\/$/, '');
};

const apiUrl = requiredUrl('api-url');
const keycloakUrl = requiredUrl('keycloak-url');
const realm = args.get('keycloak-realm') ?? 'ecommerce-mf';
const clientId = args.get('keycloak-client-id') ?? 'shell-web';
const remoteNames = ['landing', 'shop', 'admin', 'auth'];
const remoteUrls = Object.fromEntries(
  remoteNames.map((name) => [name, requiredUrl(`${name}-url`)]),
);

const appConfig = `export interface AppConfig {
  apiBaseUrl: string;
  taxRate: number;
  appName: string;
}

export const appConfig: AppConfig = {
  apiBaseUrl: '${apiUrl}/api',
  taxRate: 0.19,
  appName: 'LifeOS Commerce',
};
`;

const keycloakConfig = `export interface KeycloakAppConfig {
  url: string;
  realm: string;
  spaClientId: string;
}

const DEFAULT_CONFIG: KeycloakAppConfig = {
  url: '${keycloakUrl}',
  realm: '${realm}',
  spaClientId: '${clientId}',
};

export const keycloakConfig: KeycloakAppConfig = {
  url: localStorage.getItem('keycloak.url') ?? DEFAULT_CONFIG.url,
  realm: localStorage.getItem('keycloak.realm') ?? DEFAULT_CONFIG.realm,
  spaClientId:
    localStorage.getItem('keycloak.spaClientId') ?? DEFAULT_CONFIG.spaClientId,
};
`;

const manifest = Object.fromEntries(
  remoteNames.map((name) => [
    name,
    `${remoteUrls[name]}/mf-manifest.json`,
  ]),
);

await Promise.all([
  writeFile(resolve('config/src/lib/config.ts'), appConfig),
  writeFile(resolve('shared-core/src/lib/keycloak.config.ts'), keycloakConfig),
  writeFile(
    resolve('shell/public/module-federation.manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  ),
]);

console.log(`Deployment configuration generated for ${new URL(apiUrl).host}.`);