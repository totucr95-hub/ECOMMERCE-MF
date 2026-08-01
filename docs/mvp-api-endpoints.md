# MVP API Endpoints (Landing + Auth + Shop + Admin)

Este documento define los endpoints necesarios para soportar el flujo visual actual del MVP.

## Convenciones

- Base URL: `/api/v1`
- Formato: JSON
- Auth: `Authorization: Bearer <jwt>` para rutas protegidas
- Roles esperados: `admin`, `manager`
- Moneda MVP: `COP`
- País MVP: `Colombia`

## 1. Auth y Sesion

### POST /auth/login

Autentica usuario por email/password y devuelve `accessToken`, `refreshToken`, perfil y permisos.

### POST /auth/refresh

Renueva `accessToken` usando `refreshToken`.

### POST /auth/logout

Invalida el refresh token actual (cerrar sesion segura).

### GET /auth/me

Devuelve el usuario autenticado, su rol y permisos para habilitar rutas/menus.

### POST /auth/forgot-password

Genera flujo de recuperacion de clave (token por correo).

### POST /auth/reset-password

Actualiza la clave usando el token de recuperacion.

## 2. Landing y Contacto

### GET /landing/featured-products

Devuelve productos destacados para la seccion principal del landing.

### GET /landing/benefits

Devuelve tarjetas de beneficios/comerciales que muestra el landing.

### GET /landing/brand-content

Devuelve datos de marca (titulos, claims, telefonos, correo, direccion).

### POST /contact/lead

Registra un lead del formulario de contacto.

### POST /integrations/recaptcha/verify

Valida el token de reCAPTCHA antes de aceptar el lead.

### GET /contact/leads

Listado de leads para admin con filtros por estado/fecha.

### PATCH /contact/leads/{id}/status

Cambia estado del lead (nuevo, contactado, cerrado).

## 3. Catalogo Publico (Shop)

### GET /catalog/categories

Lista categorias visibles del catalogo.

### GET /catalog/products

Lista productos con filtros y paginacion.

Query params sugeridos:

- `q` texto de busqueda
- `categoryId`
- `featured` true/false
- `minPrice`
- `maxPrice`
- `sort` (`featured`, `name-asc`, `price-asc`, `price-desc`)
- `page`
- `pageSize`

### GET /catalog/products/{id}

Detalle de producto por id.

### GET /catalog/products/slug/{slug}

Detalle de producto por slug (util para SEO y rutas amigables).

### GET /catalog/products/suggestions

Productos sugeridos para carrito/detalle.

## 4. Carrito

### POST /carts

Crea un carrito y devuelve `cartId`.

### GET /carts/{cartId}

Obtiene estado actual del carrito (items y totales).

### POST /carts/{cartId}/items

Agrega un item al carrito.

### PATCH /carts/{cartId}/items/{itemId}

Actualiza cantidad del item.

### DELETE /carts/{cartId}/items/{itemId}

Elimina item del carrito.

### GET /carts/{cartId}/totals

Recalcula subtotal, impuestos, envio y total.

### DELETE /carts/{cartId}

Vaciar/eliminar carrito.

## 5. Checkout

### POST /checkout/validate

Valida datos de checkout (contacto, direccion, stock, reglas de envio).

### GET /checkout/shipping-methods

Devuelve metodos de entrega habilitados (pickup, envio).

### POST /checkout/shipping-quote

Calcula costo de envio segun direccion/metodo.

### POST /checkout/payment-intent

Crea intento de pago con pasarela (Wompi/PayU/etc.) y devuelve referencia.

### POST /checkout/confirm

Confirma compra: congela totales, crea orden, descuenta stock y asocia pago.

## 6. Ordenes

### POST /orders

Crea orden (si no se centraliza en `checkout/confirm`).

### GET /orders/{id}

Devuelve detalle de una orden para pagina de confirmacion y tracking.

### GET /orders/number/{orderNumber}

Consulta orden por numero comercial.

### GET /orders

Listado de ordenes del usuario autenticado (si aplica en fases siguientes).

### PATCH /orders/{id}/cancel

Cancela orden segun reglas de negocio.

### PATCH /orders/{id}/status

Actualiza estado logisitico/operativo (uso admin).

### GET /orders/{id}/timeline

Devuelve historial de eventos de la orden.

## 7. Pagos

### POST /payments

Registra pago o intento de pago.

### GET /payments/{id}

Consulta estado de un pago.

### PATCH /payments/{id}/status

Actualiza estado del pago (aprobado, rechazado, pendiente).

### POST /payments/{id}/refund

Solicita reembolso total/parcial.

### POST /payments/webhooks/{provider}

Endpoint receptor de webhooks de pasarela (aprobacion, rechazo, reversa).

## 8. Inventario

### GET /inventory/stock/{productId}

Consulta stock disponible de un producto.

### PATCH /inventory/stock/{productId}

Ajuste manual de inventario (admin).

### POST /inventory/reservations

Reserva temporal de inventario durante checkout.

### DELETE /inventory/reservations/{reservationId}

Libera reserva cuando el checkout expira o falla.

### POST /inventory/movements

Registra movimientos (entrada, salida, ajuste) para auditoria.

## 9. Admin - Productos

### GET /admin/products

Listado de productos para tabla admin con filtros.

### GET /admin/products/{id}

Detalle completo para editor.

### POST /admin/products

Crea producto.

### PUT /admin/products/{id}

Actualiza producto completo.

### PATCH /admin/products/{id}/status

Cambia estado (draft, active, archived).

### PATCH /admin/products/{id}/feature

Marca/desmarca destacado.

### DELETE /admin/products/{id}

Elimina producto.

### POST /admin/products/{id}/images

Sube/relaciona imagenes del producto.

### DELETE /admin/products/{id}/images/{imageId}

Elimina imagen asociada.

## 10. Admin - Categorias y Marcas

### GET /admin/categories

Lista categorias.

### POST /admin/categories

Crea categoria.

### PUT /admin/categories/{id}

Actualiza categoria.

### DELETE /admin/categories/{id}

Elimina categoria.

### GET /admin/brands

Lista marcas.

### POST /admin/brands

Crea marca.

### PUT /admin/brands/{id}

Actualiza marca.

### PATCH /admin/brands/{id}/status

Activa/pausa marca.

### DELETE /admin/brands/{id}

Elimina marca.

## 11. Admin - Ordenes, Pagos, Clientes, Reportes

### GET /admin/orders

Listado de ordenes para operacion.

### GET /admin/orders/{id}

Detalle de orden.

### PATCH /admin/orders/{id}

Actualiza estado, notas o datos operativos.

### GET /admin/payments

Listado de pagos.

### GET /admin/payments/{id}

Detalle de pago.

### PATCH /admin/payments/{id}

Actualiza estado/notas del pago.

### GET /admin/customers

Listado de clientes.

### GET /admin/customers/{id}

Detalle de cliente.

### GET /admin/reports/kpis

KPIs principales para dashboard admin.

### GET /admin/reports/sales

Reporte de ventas por rango de fechas.

### GET /admin/reports/orders

Reporte de ordenes por estado/canal.

### GET /admin/reports/payments

Reporte de pagos por estado/pasarela.

### GET /admin/reports/export

Exporta reportes (CSV/XLSX).

## 12. Configuracion del Negocio

### GET /settings/business

Obtiene configuracion comercial (nombre, contacto, direccion, moneda).

### PUT /settings/business

Actualiza configuracion comercial.

### GET /settings/tax

Obtiene reglas de impuestos activas.

### PUT /settings/tax

Actualiza reglas de impuestos.

### GET /settings/shipping

Obtiene reglas y tarifas de envio.

### PUT /settings/shipping

Actualiza reglas y tarifas de envio.

## 13. Utilidad Operativa

### GET /health

Salud del servicio para monitoreo.

### GET /version

Version del backend desplegado.

---

## Prioridad de implementacion (orden sugerido)

1. `auth/*`
2. `catalog/*`
3. `carts/*`
4. `checkout/*`
5. `orders/*`
6. `payments/*` + `payments/webhooks/*`
7. `inventory/*`
8. `admin/products|categories|brands`
9. `admin/orders|payments|reports`
10. `contact/*` y `settings/*`
