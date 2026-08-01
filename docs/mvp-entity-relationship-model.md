# Modelo Entidad-Relacion para MVP Ecommerce

Este modelo esta alineado con los endpoints definidos en el MVP y cubre Landing, Auth, Shop, Checkout y Admin.

## 1. Entidades nucleares

### security_users

- id (PK, uuid)
- email (unique)
- password_hash
- first_name
- last_name
- phone
- status (active, blocked)
- created_at
- updated_at

### security_roles

- id (PK, uuid)
- code (unique) Ej: admin, manager, customer
- name

### security_permissions

- id (PK, uuid)
- code (unique) Ej: products.read, orders.update
- name

### security_user_roles

- user_id (PK/FK -> security_users.id)
- role_id (PK/FK -> security_roles.id)

### security_role_permissions

- role_id (PK/FK -> security_roles.id)
- permission_id (PK/FK -> security_permissions.id)

### customers

- id (PK, uuid)
- user_id (FK nullable -> security_users.id)
- full_name
- email
- phone
- document_type
- document_number
- created_at
- updated_at

### customer_addresses

- id (PK, uuid)
- customer_id (FK -> customers.id)
- country
- state
- city
- line1
- line2
- postal_code
- is_default
- created_at
- updated_at

## 2. Catalogo y producto

### catalog_categories

- id (PK, uuid)
- code (unique)
- name
- slug (unique)
- description
- is_active
- created_at
- updated_at

### catalog_brands

- id (PK, uuid)
- code (unique)
- name
- slug (unique)
- country
- status
- created_at
- updated_at

### catalog_products

- id (PK, uuid)
- category_id (FK -> catalog_categories.id)
- brand_id (FK -> catalog_brands.id)
- sku (unique)
- slug (unique)
- name
- short_description
- full_description
- specs_json
- price_cop
- compare_at_price_cop
- cost_cop
- currency_code (default COP)
- tax_rate
- rating_avg
- rating_count
- stock_status (in_stock, low_stock, out_of_stock)
- is_featured
- status (draft, active, archived)
- created_at
- updated_at

### catalog_product_images

- id (PK, uuid)
- product_id (FK -> catalog_products.id)
- url
- alt_text
- sort_order
- is_primary
- created_at

### catalog_product_variants

- id (PK, uuid)
- product_id (FK -> catalog_products.id)
- sku (unique)
- option_color
- option_size
- option_material
- price_cop
- stock_quantity
- is_active
- created_at
- updated_at

## 3. Inventario

### inventory_stocks

- id (PK, uuid)
- product_id (unique FK -> catalog_products.id)
- quantity_on_hand
- quantity_reserved
- reorder_level
- updated_at

### inventory_movements

- id (PK, uuid)
- product_id (FK -> catalog_products.id)
- movement_type (in, out, adjust, reserve, release)
- quantity
- reference_type (order, manual, import)
- reference_id
- notes
- created_by (FK nullable -> security_users.id)
- created_at

### inventory_reservations

- id (PK, uuid)
- product_id (FK -> catalog_products.id)
- cart_id (FK nullable -> sales_carts.id)
- order_id (FK nullable -> sales_orders.id)
- quantity
- status (active, released, consumed, expired)
- expires_at
- created_at

## 4. Carrito y checkout

### sales_carts

- id (PK, uuid)
- customer_id (FK nullable -> customers.id)
- session_key
- status (active, converted, abandoned)
- subtotal_cop
- tax_cop
- shipping_cop
- total_cop
- created_at
- updated_at

### sales_cart_items

- id (PK, uuid)
- cart_id (FK -> sales_carts.id)
- product_id (FK -> catalog_products.id)
- variant_id (FK nullable -> catalog_product_variants.id)
- unit_price_cop
- quantity
- line_subtotal_cop
- line_tax_cop
- line_total_cop
- created_at
- updated_at

### sales_checkout_sessions

- id (PK, uuid)
- cart_id (FK -> sales_carts.id)
- customer_id (FK nullable -> customers.id)
- contact_email
- delivery_method (pickup, shipping)
- payment_method (card, pse, cash)
- shipping_address_id (FK nullable -> customer_addresses.id)
- shipping_quote_cop
- status (validating, ready, confirmed, expired, failed)
- created_at
- updated_at

## 5. Ordenes y pagos

### sales_orders

- id (PK, uuid)
- order_number (unique)
- cart_id (FK nullable -> sales_carts.id)
- customer_id (FK nullable -> customers.id)
- contact_email
- delivery_method
- payment_method
- shipping_address_json
- billing_address_json
- subtotal_cop
- tax_cop
- shipping_cop
- total_cop
- currency_code (default COP)
- status (created, paid, preparing, ready_to_ship, delivered, canceled)
- created_at
- updated_at

### sales_order_items

- id (PK, uuid)
- order_id (FK -> sales_orders.id)
- product_id (FK -> catalog_products.id)
- variant_id (FK nullable -> catalog_product_variants.id)
- sku_snapshot
- name_snapshot
- unit_price_cop
- quantity
- tax_rate
- line_subtotal_cop
- line_tax_cop
- line_total_cop

### sales_order_status_history

- id (PK, uuid)
- order_id (FK -> sales_orders.id)
- from_status
- to_status
- note
- changed_by (FK nullable -> security_users.id)
- changed_at

### billing_payments

- id (PK, uuid)
- order_id (FK -> sales_orders.id)
- payment_ref (unique)
- provider (wompi, payu, mercado_pago, manual)
- method (card, pse, cash)
- status (pending, approved, rejected, refunded)
- amount_cop
- currency_code
- transaction_ref
- provider_payload_json
- paid_at
- created_at
- updated_at

### billing_refunds

- id (PK, uuid)
- payment_id (FK -> billing_payments.id)
- amount_cop
- reason
- status
- provider_refund_ref
- created_at

### billing_payment_events

- id (PK, uuid)
- payment_id (FK -> billing_payments.id)
- event_type
- event_status
- provider_event_id
- payload_json
- received_at

## 6. Landing, leads y configuracion

### crm_leads

- id (PK, uuid)
- full_name
- email
- phone
- message
- source (landing_contact)
- status (new, contacted, closed)
- captcha_valid
- created_at
- updated_at

### content_landing_blocks

- id (PK, uuid)
- block_key (unique) Ej: hero, benefits, contact
- title
- subtitle
- body_json
- is_active
- updated_at

### core_settings

- id (PK, uuid)
- group_key (unique) Ej: business, tax, shipping
- value_json
- updated_by (FK nullable -> security_users.id)
- updated_at

## 7. Cardinalidades principales

- security_users N:M security_roles via security_user_roles
- security_roles N:M security_permissions via security_role_permissions
- security_users 1:0..1 customers
- customers 1:N customer_addresses
- catalog_categories 1:N catalog_products
- catalog_brands 1:N catalog_products
- catalog_products 1:N catalog_product_images
- catalog_products 1:N catalog_product_variants
- catalog_products 1:1 inventory_stocks
- catalog_products 1:N inventory_movements
- sales_carts 1:N sales_cart_items
- sales_carts 1:N sales_checkout_sessions
- sales_carts 1:0..1 sales_orders
- customers 1:N sales_orders
- sales_orders 1:N sales_order_items
- sales_orders 1:N sales_order_status_history
- sales_orders 1:N billing_payments
- billing_payments 1:N billing_payment_events
- billing_payments 1:N billing_refunds

## 8. Reglas de integridad recomendadas

- Un producto activo debe tener al menos una imagen primaria.
- quantity_reserved nunca puede superar quantity_on_hand.
- No se debe confirmar orden sin pago aprobado, excepto metodo cash configurado como permitido.
- No se debe crear sales_order_items con precio cero salvo promociones autorizadas.
- order_number debe ser unico e inmutable.
- Los snapshots de item en orden (sku_snapshot y name_snapshot) no deben cambiar por edicion posterior de catalogo.
- Si se elimina un producto, marcar archived en lugar de borrado fisico.

## 9. Indices minimos

- catalog_products: (slug), (sku), (category_id, status), (is_featured, status)
- sales_orders: (order_number), (customer_id, created_at), (status, created_at)
- billing_payments: (payment_ref), (order_id), (status, created_at)
- sales_carts: (session_key), (status, updated_at)
- crm_leads: (status, created_at)

## 10. Mapeo rapido endpoint -> tablas

- /auth/\* -> security_users, security_roles, security_permissions
- /catalog/\* -> catalog_categories, catalog_brands, catalog_products, catalog_product_images, catalog_product_variants, inventory_stocks
- /carts/\* -> sales_carts, sales_cart_items
- /checkout/\* -> sales_checkout_sessions, inventory_reservations
- /orders/\* -> sales_orders, sales_order_items, sales_order_status_history
- /payments/\* -> billing_payments, billing_payment_events, billing_refunds
- /contact/\* -> crm_leads
- /settings/\* -> core_settings
- /admin/\* -> combina tablas de catalogo, ventas, pagos, clientes y crm

---

Este modelo esta optimizado para MVP, pero permite evolucionar a V2 (cupones, registro cliente completo, promociones avanzadas, multi-bodega, multi-moneda) sin romper contratos principales.
