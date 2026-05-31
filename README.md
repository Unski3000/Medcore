# MedCore Solutions Static Website

MedCore is a static, multi-page marketing website for a medical equipment and consumables supplier. It presents the company, showcases product categories, lets visitors browse a searchable product catalogue, and provides mail-client-driven contact and quote request workflows.

## What this codebase contains

This repository is intentionally lightweight: there is no package manager, build framework, server runtime, or database. Each page is a standalone HTML document with embedded CSS and vanilla JavaScript.

| File | Purpose |
| --- | --- |
| `index.html` | Main landing page with hero messaging, company overview, product-category teasers, differentiators, testimonials, calls to action, responsive navigation, scroll reveal interactions, WhatsApp CTA, and back-to-top control. |
| `medcore-products.html` | Product catalogue page with an in-page JavaScript product dataset, category tabs, text search, product cards, prices in KES, and quote links. |
| `medcore-quote.html` | Three-step quote request experience: customer details, product/quantity selection with tiered pricing, review totals, and a generated `mailto:` request to sales. |
| `medcore-contact.html` | Contact page with contact details, FAQ content, a contact form that generates a `mailto:` enquiry, WhatsApp CTA, and generic map placeholder. |
| `.github/workflows/jekyll-docker.yml` | GitHub Actions workflow that runs a Jekyll build in Docker on pushes and pull requests to `main`. |
| `.nojekyll` | Tells GitHub Pages not to process the published static files through Jekyll conventions. |

## User-facing pages

### Landing page

`index.html` is the homepage. It communicates MedCore Solutions as a supplier of certified medical equipment for healthcare providers. The page includes:

- Fixed desktop/mobile navigation.
- Hero section with primary CTAs to browse products or request a quote.
- Trust/client logo strip.
- About section and procurement/service positioning.
- Four product-category cards: large medical devices, medium medical devices, small medical devices, and consumables.
- “Why us” differentiators, testimonials, and final CTA.
- Floating WhatsApp and back-to-top buttons.

### Product catalogue

`medcore-products.html` maintains a JavaScript `PRODUCTS` array in the page itself. The catalogue currently groups products by categories such as physiotherapy, hospital equipment, orthopaedics, first aid, laboratory equipment, theatre equipment, patient monitoring, and consumables.

The catalogue JavaScript:

- Builds category tabs dynamically from the product data.
- Filters products by selected category.
- Filters products by search query across product name, category, item code, and description.
- Renders product cards with image fallback, product metadata, KES pricing, and a quote CTA.

### Quote request workflow

`medcore-quote.html` implements a client-side quote wizard using a separate tiered-pricing product dataset. The flow is:

1. Collect customer/facility details.
2. Let users choose quantities for products across large devices, medium devices, small devices, and consumables.
3. Show a review screen with line totals, estimated subtotal, and volume-discount savings against list pricing.
4. Generate a reference number and open the user's email client with a prefilled `mailto:sales@medcoresolutions.com` quote request.

Because this is a static site, the quote is not submitted to a backend. Completion depends on the visitor sending the generated email from their mail client.

### Contact page

`medcore-contact.html` provides phone/WhatsApp, sales/support email links, business hours, logistics notes, FAQs, a blank address area, and a contact form. The form validates required fields in the browser and then opens a prefilled `mailto:info@medcoresolutions.com` enquiry.

## Styling and frontend architecture

- Styles are embedded in each HTML file rather than shared through a global stylesheet.
- The visual design uses CSS custom properties for the navy, teal, gold, white, and text color palette.
- Typography is loaded from Google Fonts: `Cormorant Garamond` for display headings and `DM Sans` for body/UI text.
- The site is responsive, with mobile navigation drawers and smaller-screen layout adjustments implemented in page-level media queries.
- JavaScript is plain browser JavaScript embedded at the bottom of each page.

## Running locally

No install step is required. Open `index.html` directly in a browser, or run a local static server from the repository root:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000/
```

## Deployment notes

The repository is suitable for GitHub Pages or any static hosting provider. The included GitHub Actions workflow runs a Jekyll container build for pushes and pull requests to `main`, while `.nojekyll` keeps GitHub Pages from applying Jekyll-specific processing rules to files that are served as plain static assets.

## Maintenance notes

- Product data is duplicated between `medcore-products.html` and `medcore-quote.html`; update both pages if catalogue and quote pricing must stay aligned.
- Contact and quote submissions currently use `mailto:` links, not server-side form handling. Add a backend, serverless function, or third-party form service if reliable submission tracking is needed.
- WhatsApp links currently use the placeholder number `+254700000000`; replace it with the production business number before launch.
- Product imagery is loaded from external Unsplash URLs and may change or fail independently of this repository; each product card includes a visual fallback.
- Prices and quote totals are client-side estimates in KES and should be reviewed before being treated as final commercial pricing.
