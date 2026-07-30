import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '@ecommerce-mf/shared-core';
import { Product } from '@ecommerce-mf/shared-models';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-landing-entry',
  template: `
    <div class="landing">
      <header class="navbar">
        <strong>LifeOS Commerce</strong>
        <nav>
          <a href="#hero">Inicio</a>
          <a href="#featured">Destacados</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contacto</a>
        </nav>
      </header>

      <section id="hero" class="hero">
        <h1>Tu e-commerce modular para escalar sin limites</h1>
        <p>Frontend profesional con Angular + Nx + arquitectura por dominios.</p>
      </section>

      <section id="featured" class="grid-block">
        <h2>Productos destacados</h2>
        <div class="cards">
          @for (product of featuredProducts; track product.id) {
            <article class="card">
              <img [src]="product.image" [alt]="product.name" />
              <h3>{{ product.name }}</h3>
              <p>{{ product.price | currency:'USD':'symbol':'1.2-2' }}</p>
            </article>
          }
        </div>
      </section>

      <section class="benefits grid-block">
        <h2>Beneficios</h2>
        <div class="cols">
          <article><h3>Escalable</h3><p>Microfrontends listos para crecer por equipos.</p></article>
          <article><h3>Mantenible</h3><p>DDD y Feature Architecture para aislar cambios.</p></article>
          <article><h3>Performante</h3><p>Lazy loading, standalone y señales por defecto.</p></article>
        </div>
      </section>

      <section id="faq" class="grid-block">
        <h2>FAQ</h2>
        <details><summary>Es production-ready?</summary><p>Si, con linting, formato, hooks y arquitectura modular.</p></details>
        <details><summary>Soporta backend NestJS?</summary><p>Si, los servicios estan desacoplados y listos para API real.</p></details>
        <details><summary>Usa estado global?</summary><p>Se utilizan stores con Angular Signals, sin NgRx.</p></details>
      </section>

      <section id="contact" class="grid-block contact">
        <h2>Contacto</h2>
        <p>Escribenos a arquitectura@lifeos.local para acelerar tu roadmap.</p>
      </section>

      <footer class="footer">© 2026 LifeOS Commerce. All rights reserved.</footer>
    </div>
  `,
  styles: [
    `.landing{display:block}.navbar{display:flex;justify-content:space-between;align-items:center;padding:1rem 0;border-bottom:1px solid #e2e8f0}.navbar nav{display:flex;gap:.8rem}.navbar a{text-decoration:none;color:#334155}.hero{padding:3rem 0}.hero h1{font-size:clamp(2rem,4vw,3.2rem);max-width:16ch}.hero p{color:#475569;max-width:60ch}.grid-block{padding:1.75rem 0}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:1rem}.card{border:1px solid #e2e8f0;border-radius:16px;padding:1rem;background:#fff}.card img{width:100%;height:120px;object-fit:cover;border-radius:10px}.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem}.cols article{border:1px solid #e2e8f0;border-radius:14px;padding:1rem;background:#fff}.contact{border-top:1px solid #e2e8f0}.footer{border-top:1px solid #e2e8f0;padding:1rem 0;color:#64748b}`,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoteEntry {
  private readonly productService = inject(ProductService);
  featuredProducts: Product[] = [];

  constructor() {
    void this.loadFeatured();
  }

  private async loadFeatured(): Promise<void> {
    this.featuredProducts = (await this.productService.getFeaturedProducts()).slice(0, 6);
  }
}
