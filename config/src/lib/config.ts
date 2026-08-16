export interface AppConfig {
  apiBaseUrl: string;
  taxRate: number;
  appName: string;
}

export const appConfig: AppConfig = {
  apiBaseUrl: 'http://localhost:5015/api',
  taxRate: 0.19,
  appName: 'LifeOS Commerce',
};
