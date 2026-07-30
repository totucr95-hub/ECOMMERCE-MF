import { Injectable, computed, signal } from '@angular/core';
import { Cart, Category, Order, Payment, Product, User } from '@ecommerce-mf/shared-models';
import productsMock from './mocks/products.json';
import categoriesMock from './mocks/categories.json';
import usersMock from './mocks/users.json';
import ordersMock from './mocks/orders.json';

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
  readonly isLoading = signal(false);

  start(): void {
    this.isLoading.set(true);
  }

  stop(): void {
    this.isLoading.set(false);
  }
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = new StorageService();
  private readonly modeSignal = signal<'light' | 'dark'>(
    this.storage.get<'light' | 'dark'>('theme.mode', 'light')
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
  private readonly api = new ApiService();

  async getProducts(): Promise<Product[]> {
    return this.api.get(productsMock as Product[]);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return this.api.get((productsMock as Product[]).filter((p) => p.featured));
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.api.get((productsMock as Product[]).find((p) => p.id === id));
  }

  async getCategories(): Promise<Category[]> {
    return this.api.get(categoriesMock as Category[]);
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = new StorageService();
  private readonly authUser = signal<User | null>(this.storage.get<User | null>('auth.user', null));

  readonly currentUser = computed(() => this.authUser());
  readonly isAuthenticated = computed(() => this.authUser() !== null);
  readonly isAdmin = computed(() => this.authUser()?.role.name === 'admin');

  login(email: string): User | null {
    const user = (usersMock as User[]).find((u) => u.email === email) ?? null;
    this.authUser.set(user);
    this.storage.set('auth.user', user);
    return user;
  }

  logout(): void {
    this.authUser.set(null);
    this.storage.remove('auth.user');
  }
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly api = new ApiService();

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
  private readonly service = new ProductService();

  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly query = signal('');
  readonly filteredProducts = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) {
      return this.products();
    }

    return this.products().filter((product) => product.name.toLowerCase().includes(q));
  });

  async load(): Promise<void> {
    this.products.set(await this.service.getProducts());
    this.categories.set(await this.service.getCategories());
  }
}

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly storage = new StorageService();
  private readonly taxRate = 0.19;

  readonly items = signal<{ product: Product; quantity: number }[]>(
    this.storage.get<{ product: Product; quantity: number }[]>('cart.items', [])
  );

  readonly subtotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  readonly taxes = computed(() => this.subtotal() * this.taxRate);
  readonly total = computed(() => this.subtotal() + this.taxes());

  readonly cart = computed<Cart>(() => ({
    items: this.items().map((item) => ({ productId: item.product.id, quantity: item.quantity })),
    subtotal: this.subtotal(),
    taxes: this.taxes(),
    total: this.total(),
  }));

  add(product: Product): void {
    const existing = this.items().find((item) => item.product.id === product.id);
    if (existing) {
      this.updateQuantity(product.id, existing.quantity + 1);
      return;
    }

    this.items.update((items) => [...items, { product, quantity: 1 }]);
    this.persist();
  }

  remove(productId: string): void {
    this.items.update((items) => items.filter((item) => item.product.id !== productId));
    this.persist();
  }

  updateQuantity(productId: string, quantity: number): void {
    this.items.update((items) =>
      items
        .map((item) => (item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter((item) => item.quantity > 0)
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
  private readonly service = new AuthService();
  readonly currentUser = this.service.currentUser;
  readonly isAuthenticated = this.service.isAuthenticated;
  readonly isAdmin = this.service.isAdmin;

  login(email: string): User | null {
    return this.service.login(email);
  }

  logout(): void {
    this.service.logout();
  }
}

@Injectable({ providedIn: 'root' })
export class ThemeStore {
  private readonly service = new ThemeService();
  readonly mode = this.service.mode;

  toggle(): void {
    this.service.toggle();
  }

  init(): void {
    this.service.init();
  }
}
