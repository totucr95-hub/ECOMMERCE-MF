import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Keycloak, { type KeycloakTokenParsed } from 'keycloak-js';
import {
  Cart,
  Category,
  Order,
  Payment,
  Product,
  User,
} from '@ecommerce-mf/shared-models';
import { appConfig } from '@ecommerce-mf/config';
import { firstValueFrom } from 'rxjs';
import productsMock from './mocks/products.json';
import categoriesMock from './mocks/categories.json';
import usersMock from './mocks/users.json';
import ordersMock from './mocks/orders.json';
import { keycloakConfig } from './keycloak.config';

@Injectable({ providedIn: 'root' })
export class StorageService {
  get<T>(key: string, fallback: T): T {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly latencyMs = 250;

  async get<T>(payload: T): Promise<T> {
    await new Promise((resolve) => setTimeout(resolve, this.latencyMs));
    return payload;
  }
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly messages = signal<string[]>([]);

  push(message: string): void {
    this.messages.update((list) => [message, ...list].slice(0, 5));
  }

  clear(): void {
    this.messages.set([]);
  }
}

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly pendingRequests = signal(0);
  readonly isLoading = computed(() => this.pendingRequests() > 0);

  start(): void {
    this.pendingRequests.update((value) => value + 1);
  }

  stop(): void {
    this.pendingRequests.update((value) => Math.max(0, value - 1));
  }
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(StorageService);
  private readonly modeSignal = signal<'light' | 'dark'>(
    this.storage.get<'light' | 'dark'>('theme.mode', 'light'),
  );

  readonly mode = computed(() => this.modeSignal());

  toggle(): void {
    const next = this.modeSignal() === 'light' ? 'dark' : 'light';
    this.modeSignal.set(next);
    this.storage.set('theme.mode', next);
    document.documentElement.dataset['theme'] = next;
  }

  init(): void {
    document.documentElement.dataset['theme'] = this.modeSignal();
  }
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = appConfig.apiBaseUrl.replace(/\/$/, '');

  async getProducts(): Promise<Product[]> {
    return this.fetchProducts(`${this.apiBaseUrl}/products`);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return this.fetchProducts(`${this.apiBaseUrl}/products/featured`);
  }

  async getProductById(id: string): Promise<Product | undefined> {
    try {
      return await firstValueFrom(
        this.http.get<Product>(
          `${this.apiBaseUrl}/products/${encodeURIComponent(id)}`,
        ),
      );
    } catch {
      return (productsMock as Product[]).find((p) => p.id === id);
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      return await firstValueFrom(
        this.http.get<Category[]>(`${this.apiBaseUrl}/categories`),
      );
    } catch {
      return categoriesMock as Category[];
    }
  }

  private async fetchProducts(url: string): Promise<Product[]> {
    try {
      return await firstValueFrom(this.http.get<Product[]>(url));
    } catch {
      return productsMock as Product[];
    }
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(StorageService);
  private keycloak: Keycloak | null = null;
  private initPromise: Promise<void> | null = null;
  private readonly authUser = signal<User | null>(
    this.storage.get<User | null>('auth.user', null),
  );
  private readonly keycloakReady = signal(false);

  readonly currentUser = computed(() => this.authUser());
  readonly isAuthenticated = computed(() => this.authUser() !== null);
  readonly isAdmin = computed(() => this.authUser()?.role.name === 'admin');
  readonly isReady = this.keycloakReady.asReadonly();

  init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.initializeKeycloak();
    return this.initPromise;
  }

  async loginWithKeycloak(redirectUri?: string): Promise<void> {
    await this.init();

    if (!this.keycloak) {
      throw new Error('Keycloak no esta disponible.');
    }

    await this.keycloak.login({
      redirectUri: redirectUri ?? `${window.location.origin}/admin`,
    });
  }

  async registerWithKeycloak(redirectUri?: string): Promise<void> {
    await this.init();

    if (!this.keycloak) {
      throw new Error('Keycloak no esta disponible.');
    }

    await this.keycloak.register({
      redirectUri: redirectUri ?? `${window.location.origin}/auth/login`,
    });
  }

  async recoverPasswordWithKeycloak(
    email?: string,
    redirectUri?: string,
  ): Promise<void> {
    await this.runKeycloakAction('UPDATE_PASSWORD', redirectUri, email);
  }

  async changePasswordWithKeycloak(redirectUri?: string): Promise<void> {
    await this.runKeycloakAction('UPDATE_PASSWORD', redirectUri);
  }

  getAccessToken(): string | null {
    return (
      this.keycloak?.token ??
      this.storage.get<string | null>('auth.token', null)
    );
  }

  async refreshToken(minValiditySeconds = 30): Promise<string | null> {
    if (!this.keycloak || !this.keycloak.authenticated) {
      return this.getAccessToken();
    }

    try {
      await this.keycloak.updateToken(minValiditySeconds);
      this.syncUserFromToken(this.keycloak.tokenParsed);
      return this.getAccessToken();
    } catch {
      this.clearSession();
      return null;
    }
  }

  login(email: string): User | null {
    const user = (usersMock as User[]).find((u) => u.email === email) ?? null;
    this.authUser.set(user);
    this.storage.set('auth.user', user);
    return user;
  }

  async logout(): Promise<void> {
    if (this.keycloak?.authenticated) {
      await this.keycloak.logout({
        redirectUri: `${window.location.origin}/landing`,
      });
    }

    this.clearSession();
  }

  private async runKeycloakAction(
    action: string,
    redirectUri?: string,
    loginHint?: string,
  ): Promise<void> {
    await this.init();

    if (!this.keycloak) {
      throw new Error('Keycloak no esta disponible.');
    }

    await this.keycloak.login({
      action,
      redirectUri: redirectUri ?? `${window.location.origin}/auth/login`,
      ...(loginHint?.trim() ? { loginHint: loginHint.trim() } : {}),
    });
  }

  private async initializeKeycloak(): Promise<void> {
    try {
      this.keycloak = new Keycloak({
        url: keycloakConfig.url,
        realm: keycloakConfig.realm,
        clientId: keycloakConfig.spaClientId,
      });

      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        pkceMethod: 'S256',
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
      });

      if (authenticated) {
        this.syncUserFromToken(this.keycloak.tokenParsed);
      } else {
        this.clearSession();
      }
    } catch {
      this.keycloak = null;
      this.clearSession();
    } finally {
      this.keycloakReady.set(true);
    }
  }

  private syncUserFromToken(token: KeycloakTokenParsed | undefined): void {
    if (!this.keycloak?.token || !token) {
      this.clearSession();
      return;
    }

    const realmRoles = (token.realm_access?.roles ?? []) as string[];
    const roleName: 'admin' | 'manager' | 'customer' = realmRoles.includes(
      'admin',
    )
      ? 'admin'
      : realmRoles.includes('manager')
        ? 'manager'
        : 'customer';

    const userId = token['sub'] ?? token['sid'] ?? 'keycloak-user';
    const tokenName =
      token['name'] ??
      token['preferred_username'] ??
      token['email'] ??
      'Usuario';
    const tokenEmail = token['email'] ?? token['preferred_username'] ?? '';

    const user: User = {
      id: String(userId),
      name: String(tokenName) || 'Usuario',
      email: String(tokenEmail),
      role: {
        id: roleName,
        name: roleName,
      },
      permissions: [],
      addresses: [],
    };

    this.authUser.set(user);
    this.storage.set('auth.user', user);
    this.storage.set('auth.token', this.keycloak.token);
  }

  private clearSession(): void {
    this.authUser.set(null);
    this.storage.remove('auth.user');
    this.storage.remove('auth.token');
  }
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly api = inject(ApiService);

  async getOrders(): Promise<Order[]> {
    return this.api.get(ordersMock as Order[]);
  }
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  async pay(amount: number, method: Payment['method']): Promise<Payment> {
    return {
      id: `pay-${Date.now()}`,
      method,
      status: 'approved',
      amount,
      transactionRef: `TRX-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
    };
  }
}

@Injectable({ providedIn: 'root' })
export class ProductStore {
  private readonly service = inject(ProductService);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly query = signal('');
  readonly filteredProducts = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) {
      return this.products();
    }

    return this.products().filter((product) =>
      product.name.toLowerCase().includes(q),
    );
  });

  async load(): Promise<void> {
    this.products.set(await this.service.getProducts());
    this.categories.set(await this.service.getCategories());
  }
}

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly storage = inject(StorageService);
  private readonly taxRate = 0.19;
  private readonly maxQuantityPerItem = 99;

  readonly items = signal<{ product: Product; quantity: number }[]>(
    this.storage.get<{ product: Product; quantity: number }[]>(
      'cart.items',
      [],
    ),
  );

  readonly subtotal = computed(() =>
    this.items().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    ),
  );

  readonly taxes = computed(() => this.subtotal() * this.taxRate);
  readonly total = computed(() => this.subtotal() + this.taxes());

  readonly cart = computed<Cart>(() => ({
    items: this.items().map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    })),
    subtotal: this.subtotal(),
    taxes: this.taxes(),
    total: this.total(),
  }));

  add(product: Product): void {
    const existing = this.items().find(
      (item) => item.product.id === product.id,
    );
    if (existing) {
      this.updateQuantity(product.id, existing.quantity + 1);
      return;
    }

    this.items.update((items) => [...items, { product, quantity: 1 }]);
    this.persist();
  }

  remove(productId: string): void {
    this.items.update((items) =>
      items.filter((item) => item.product.id !== productId),
    );
    this.persist();
  }

  updateQuantity(productId: string, quantity: number): void {
    this.items.update((items) =>
      items
        .map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity: Math.min(
                  this.maxQuantityPerItem,
                  Math.max(1, quantity),
                ),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
    this.persist();
  }

  clear(): void {
    this.items.set([]);
    this.persist();
  }

  private persist(): void {
    this.storage.set('cart.items', this.items());
  }
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly service = inject(AuthService);
  readonly currentUser = this.service.currentUser;
  readonly isAuthenticated = this.service.isAuthenticated;
  readonly isAdmin = this.service.isAdmin;
  readonly isReady = this.service.isReady;

  init(): Promise<void> {
    return this.service.init();
  }

  loginWithKeycloak(redirectUri?: string): Promise<void> {
    return this.service.loginWithKeycloak(redirectUri);
  }

  registerWithKeycloak(redirectUri?: string): Promise<void> {
    return this.service.registerWithKeycloak(redirectUri);
  }

  recoverPasswordWithKeycloak(
    email?: string,
    redirectUri?: string,
  ): Promise<void> {
    return this.service.recoverPasswordWithKeycloak(email, redirectUri);
  }

  changePasswordWithKeycloak(redirectUri?: string): Promise<void> {
    return this.service.changePasswordWithKeycloak(redirectUri);
  }

  getAccessToken(): string | null {
    return this.service.getAccessToken();
  }

  refreshToken(minValiditySeconds?: number): Promise<string | null> {
    return this.service.refreshToken(minValiditySeconds);
  }

  login(email: string): User | null {
    return this.service.login(email);
  }

  logout(): void {
    void this.service.logout();
  }
}

@Injectable({ providedIn: 'root' })
export class ThemeStore {
  private readonly service = inject(ThemeService);
  readonly mode = this.service.mode;

  toggle(): void {
    this.service.toggle();
  }

  init(): void {
    this.service.init();
  }
}
