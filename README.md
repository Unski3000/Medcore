# MedCore Solutions Website & Backend

MedCore is a static marketing website plus a lightweight Node.js backend for product management and automated quotation generation. The public site presents the company, product catalogue, contact information, and quote request flows, while the backend gives staff control over product visibility, featured products, company quote settings, and printable quotations.

## What this codebase contains

The project is intentionally simple and deployable without a database server. Static pages live in the repository root, while backend state is stored in JSON files under `data/`.

| File / directory | Purpose |
| --- | --- |
| `index.html` | Main landing page with hero messaging, company overview, product-category teasers, differentiators, testimonials, calls to action, responsive navigation, WhatsApp CTA, and back-to-top control. |
| `medcore-products.html` | Public product catalogue. It loads managed products from `/api/products` when the backend is running and falls back to the embedded catalogue when opened statically. |
| `medcore-quote.html` | Client-side quote request wizard retained for public enquiries. |
| `medcore-contact.html` | Contact page with phone/WhatsApp, sales/support email links, business hours, logistics notes, FAQs, a blank address area, contact form, and generic map placeholder. |
| `admin.html` | Staff dashboard for managing products, frontend visibility, featured-product flags, company quote details, and automated quote generation. Served at `/admin`. |
| `server.js` | Node.js backend that serves static pages and exposes product, company, and quotation APIs. |
| `data/products.json` | Managed product catalogue used by the backend and public product page. |
| `data/company.json` | Company quote settings: logo SVG, contact details, address lines, currency, and tax rate. |
| `data/quotations.json` | Stored generated quotations. |
| `scripts/build-check.js` | Build-time validation for HTML references, JSON data, and required product fields. |
| `test/backend.test.js` | Node test suite covering product API responses and automated quote calculations/rendering. |
| `.github/workflows/jekyll-docker.yml` | Existing GitHub Actions workflow for static site build checks on `main`. |
| `.nojekyll` | Tells GitHub Pages not to apply Jekyll-specific processing rules. |

## Backend capabilities

### Product management

The admin dashboard and `/api/products` endpoints provide full control over products displayed on the frontend:

- Create and update product name, category, SKU/code, description, image URL, unit, price, sort order, taxable flag, active/hidden status, and featured status.
- Public catalogue requests only receive active products.
- Featured products are available through `/api/products?featured=true` for homepage or campaign use.
- Admin requests can inspect all products through `/api/products?admin=true`.

### Automated quotations

The quotation API calculates quotation financials server-side:

- Subtotal from selected products and quantities.
- Tax per line item using the configurable `taxRate` in `data/company.json`.
- Grand total including tax.
- Quotation ID, creation date, and default 14-day validity date.
- Printable HTML quote with company logo, company address block, customer details, itemized lines, tax, and total.

Generated quotes can be opened at:

```text
/api/quotations/:id/html
```

The printable quote page includes a **Print / Save PDF** action for operational use.

## API overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/products` | List active products for the public frontend. |
| `GET` | `/api/products?admin=true` | List all products for management. |
| `GET` | `/api/products?featured=true` | List active featured products. |
| `POST` | `/api/products` | Create a product. |
| `PUT` | `/api/products/:id` | Update a product. |
| `DELETE` | `/api/products/:id` | Delete a product. |
| `GET` | `/api/company` | Read company quote settings. |
| `PUT` | `/api/company` | Update company quote settings. |
| `POST` | `/api/quotations` | Generate and store an automated quotation. |
| `GET` | `/api/quotations` | List generated quotations. |
| `GET` | `/api/quotations/:id` | Read a generated quotation as JSON. |
| `GET` | `/api/quotations/:id/html` | Open printable quote HTML. |

## Running locally

Install dependencies:

```bash
npm install
```

Run the backend and static site:

```bash
npm start
```

Then visit:

```text
http://localhost:3000/
http://localhost:3000/admin
```

## Quality checks

```bash
npm test
npm run build
```

- `npm test` runs backend API and quotation calculation tests.
- `npm run build` validates HTML references, JSON data, and required product fields.

## Deployment notes

The backend uses Node.js built-in modules and JSON files for persistence, so it can be deployed to a small VPS, container, or Node-compatible platform with writable storage. For a production-grade multi-user admin system, the next recommended steps are authentication, role-based access control, audit logs, and moving JSON persistence to PostgreSQL or another managed database.

## Maintenance notes

- Keep `data/company.json` up to date before issuing real quotations, especially the company address lines, logo SVG, currency, and tax rate.
- `medcore-products.html` contains an embedded product fallback for static hosting, but the managed backend catalogue in `data/products.json` is the source of truth when the backend is running.
- Contact and public quote enquiry forms still use `mailto:` links; the backend quotation system is available through `/admin` and `/api/quotations`.
- WhatsApp links currently use the placeholder number `+254700000000`; replace it with the production business number before launch.
- Product imagery is loaded from external Unsplash URLs and may change or fail independently of this repository; each product card includes a visual fallback.

## Frontend security hardening

The GitHub Pages deployment cannot rely on custom HTTP response headers, so the static pages implement defense-in-depth controls directly in the HTML and JavaScript:

- Each HTML page includes a meta tag-based Content Security Policy that limits scripts to same-origin files, blocks objects, restricts frames, limits image/font/style sources, and constrains form submissions to same-origin or `mailto:` destinations.
- Inline event handlers and inline page scripts have been moved to same-origin files under `assets/js/` so the CSP can use `script-src 'self'` instead of allowing arbitrary inline JavaScript.
- Dynamic UI rendering uses DOM APIs, `textContent`, and attribute assignment instead of string-based `innerHTML` rendering for user- or data-controlled values.
- `assets/js/security.js` provides frame-busting logic for clickjacking mitigation because GitHub Pages cannot set `X-Frame-Options` or a response-header `frame-ancestors` policy.
- Third-party iframe embeds have been removed; if an iframe is added later, it must use an explicit `sandbox` attribute and a narrowly scoped `allow` list.
- User-facing forms use strict client-side regular expressions for names, organisations, email addresses, phone numbers, subjects, messages, product codes, URLs, quantities, and prices before building mailto links or API payloads.

These browser-side fallbacks reduce XSS, DOM injection, and clickjacking risk for static hosting. They do not replace server-side validation for any future production backend, but they provide appropriate safeguards for a GitHub Pages-hosted frontend.
