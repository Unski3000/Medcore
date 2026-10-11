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

The printable quote page requires a signed-in staff session. Use the browser print dialog to save a PDF for a customer; quotation URLs are not public sharing links.

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

Configure staff accounts and the origin as described below, then run the backend and static site:

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

- `npm test` runs backend functionality and security regression tests for authorization, session lifecycle, CSRF/origin checks, login limits, configuration and private-file access. GitHub Actions runs these checks on pull requests.
- `npm run build` validates HTML references, JSON data, and required product fields.

## Deployment notes

The backend requires Node.js 22 or newer and a writable persistent data directory. Authentication is enforced by the server: the active product catalogue remains public; all product writes, hidden-product reads (`admin=true`), company settings, and quotation creation/list/detail/HTML require a staff session. Every configured staff account has the same staff permissions, including access to all customer quotations. There is no customer account or public quotation retrieval API. The public enquiry wizard remains independent and uses mailto.

### Required configuration

| Variable | Configuration |
| --- | --- |
| `MEDCORE_STAFF_USERS` | JSON array of unique `{ "username": "...", "passwordHash": "scrypt$...$...", "role": "staff" }` records. Supply through a secret manager or protected service environment, never commit credentials. Empty, malformed or unsupported-role configuration prevents startup. |
| `MEDCORE_ORIGIN` | Exact browser origin, without a trailing slash or path. Locally use `http://localhost:3000`; production must use the actual `https://` origin. |
| `NODE_ENV` | Set to `production` on deployment; this requires HTTPS and secure cookies. |
| `MEDCORE_DATA_DIR` | Absolute path to persistent private storage **outside the checkout and any web root**, readable/writable only by the service account. Defaults to `data/` for local development. |
| `MEDCORE_SESSION_TTL_SECONDS` | Optional absolute session lifetime, 60–86400 seconds; default 28800 (8 hours). |
| `HOST` / `PORT` | Defaults to `127.0.0.1` / `3000`. Set `HOST=0.0.0.0` only where container networking requires it, with the port protected from direct public traffic. |

Create a unique strong password for each staff member in a password manager. Generate its salted scrypt hash from standard input (Bash example; the password is not passed in command arguments or saved in shell history):

```bash
read -r -s -p 'Staff password (at least 14 characters): ' staff_password
printf '\n'
printf '%s' "$staff_password" | node scripts/hash-password.js
unset staff_password
```

Place the generated hash into that user's record in `MEDCORE_STAFF_USERS` through your deployment secret configuration. The hash format uses Node scrypt defaults (N=16384, r=8, p=1), a random 16-byte salt and a 64-byte derived key. No password or default account is bundled. For local use, set `MEDCORE_ORIGIN=http://localhost:3000` and provide the staff JSON through the environment before `npm start`. Open the admin interface on that exact origin. `.env` files are not automatically loaded.

### HTTPS and private storage

- Terminate HTTPS at a trusted reverse proxy and forward requests to the Node process. Proxy the application through Node; **do not serve the repository directory as a static web root**. A proxy, CDN or file server that independently exposes `data/` bypasses Node's file restrictions. Disable caching for `/api/` and `/admin` (Node sends `Cache-Control: no-store`).
- Initialize a new private data directory from the sample `data/` files, then use that directory for all runtime state. Keep real customer quotations, company configuration, environment files and backups out of Git and static publishing. Existing Git history and static-host deployments are not secured by these backend changes.
- GitHub Pages serves only static files and cannot run this authenticated backend. Publish only the public HTML and `assets/` when using static hosting; never publish the entire checkout with live data.
- Browser sessions use random opaque IDs in `HttpOnly`, `SameSite=Strict` cookies with `Secure` on HTTPS. Session IDs and passwords are not stored in browser local storage. All state-changing authenticated requests require both an exact `Origin` match and the session's `X-CSRF-Token`; login requires the allowed origin and JSON. Cross-origin API access is not enabled.
- Login attempts are limited to 10 per socket IP per 15 minutes, including successful attempts, with bounded in-memory state. Behind a proxy this limit is shared by clients on that proxy connection address. Forwarded IP headers are intentionally ignored. Add a trusted edge rate limiter for production and tune deliberately if shared limits are too restrictive.
- Sessions and rate-limit counters live in one Node process. Restarting logs everyone out; removing a user or rotating a password requires updating configuration and restarting. Run a single instance; multiple instances require a shared session/rate-limit store. JSON persistence also remains unsuitable for concurrent writers or multiple instances; use a transactional database before scaling.
- Additional recommended work: audit logging, MFA, finer-grained roles and transactional database persistence.

### Authentication API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/login` | JSON `{ "username": "...", "password": "..." }`; returns username and CSRF token and sets the session cookie. |
| `GET` | `/api/auth/session` | Returns the signed-in username and CSRF token; 401 without a valid session. |
| `POST` | `/api/auth/logout` | Requires the session, allowed Origin and CSRF token; invalidates the session and expires the cookie. |

Direct quotation links require the same staff cookie. API clients must retain the cookie and supply `Origin: <MEDCORE_ORIGIN>` and `X-CSRF-Token: <session token>` for mutations. Unknown API routes also require authentication by default. Static responses are restricted to explicitly listed public HTML/JavaScript files; JSON data, source code, dotfiles, encoded traversal and symlink aliases are not served.

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
