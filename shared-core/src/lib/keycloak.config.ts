export interface KeycloakAppConfig {
  url: string;
  realm: string;
  spaClientId: string;
}

const DEFAULT_CONFIG: KeycloakAppConfig = {
  url: 'http://localhost:8080',
  realm: 'ecommerce-mf',
  spaClientId: 'shell-web',
};

export const keycloakConfig: KeycloakAppConfig = {
  url: localStorage.getItem('keycloak.url') ?? DEFAULT_CONFIG.url,
  realm: localStorage.getItem('keycloak.realm') ?? DEFAULT_CONFIG.realm,
  spaClientId:
    localStorage.getItem('keycloak.spaClientId') ?? DEFAULT_CONFIG.spaClientId,
};
