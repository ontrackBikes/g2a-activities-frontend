# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`g2a-activities` is the Vue 3 + Vuetify frontend for go2andaman's "Activities" product (tours, bike rentals, water sports, etc.): browsing, product detail, booking, checkout, and order/payment flows. The same codebase also produces several **standalone embeddable widgets** (IIFE bundles) that third-party sites can drop in via a `<script>` tag — these share code with the main app but are built and shipped separately.

## Commands

```bash
npm run dev                 # main app dev server (mode=development)
npm run dev:staging         # main app dev server (mode=staging)

npm run build                # main app build, mode=development
npm run build:staging        # main app build, mode=staging
npm run build:production     # main app build, mode=production

npm run lint                 # eslint . --fix
npm run format                # prettier --write src/
```

There is no unit/e2e test runner configured (`test/` contains only static HTML pages for manually smoke-testing widgets in a browser — see below).

### Building widgets

There are three separate widget build paths, each with its own Vite config:

```bash
# Generic widgets under src/widgets/* (currently booking-price, product-list),
# built via vite.widget.config.js, one at a time using WIDGET env var:
npm run build:widgets                                  # loops over every src/widgets/<name>/entry.js
                                                        # and writes dist/widgets/<name>/{widget.js,widget.css}
                                                        # plus dist/widgets/manifest.json

# Booking-price widget, standalone build with its own output dir:
npm run build:booking-price-widget                      # -> dist-booking-price-widget/g2a-book-price-widget.{iife.js,css}

# Activities bike-rentals widget (Vuetify-based), standalone build:
npm run build:activities-bike-rentals-widget:dev|staging|production
                                                        # -> dist-activities-bike-rentals-widget/activities-bike-rentals-widget.{js,css}
npm run postbuild:activities-bike-rentals-widget         # copies that output into dist/widgets/

# Build main app + bike-rentals widget together for a given environment:
npm run build:all:dev | build:all:staging | build:all:production
npm run build:all                                       # alias for build:all:production
```

To manually test a widget build in a browser, open the corresponding file in `test/` (`booking-price-widget-test.html`, `product-list-widget-test.html`, `activities-bike-rentals-widget-test.html`) against the built assets.

When adding a new generic widget, drop it under `src/widgets/<name>/` with its own `entry.js` — `scripts/build-widgets.js` auto-discovers any subdirectory of `src/widgets` (except `shared`) that contains an `entry.js` and builds it via `vite.widget.config.js`, generating `dist/widgets/manifest.json` automatically. No changes to the build script are needed.

## Environment variables

Configured via `.env` / `.env.production` (see `.env.example`), consumed with `import.meta.env.*`:

- `VITE_API_BASE_URL` — backend API base (e.g. `http://localhost:3000/api` or `https://activities.go2andaman.com/api`)
- `VITE_BASE_URL` — base URL of the booking site itself, used for building redirect/deep links (widgets link back here)
- `VITE_RAZORPAY_KEY_ID` — Razorpay checkout key

## Architecture

### Path alias

`@` maps to `src/` (set independently in `vite.config.js`, each `vite.*.config.js`, and `jsconfig.json` — keep them in sync if it ever changes).

### Main app

- `src/main.js` bootstraps the app with the Vuetify instance from `src/plugins/vuetify.js` and `vue-router` from `src/router/`.
- `src/router/index.js` defines two route trees sharing the same `/` path prefix, distinguished by their wrapper layout component:
  - **`MainLayout`** — browsing surface: home, category/product-type/product listing (`:category`, `:category/:productType`, `:category/:productType/:product`), search, location pages.
  - **`CheckoutLayout`** — booking/checkout/order surface: `.../book`, `checkout/:estimate_id`, and the various `/orders/:order_id` and `/checkout/orders/:order_id/...` (payment-status/success/failed) views.
  - Route param structure (`:category/:productType/:product`) directly reflects the catalog taxonomy — component and view names follow the same category → product-type → product hierarchy (see `src/views/activities/` and `src/components/activities/`).
- `src/plugins/vuetify.js` defines the full design-token theme (light/dark), including custom semantic colors per activity category (`cat-blue`, `cat-orange`, `cat-purple`, etc. for Water Sports, Day Trips, Exclusive Experiences, Getting Around, History & Culture, Treks and Walks, Stargazing, Scuba Diving, Kayaking). Reuse these tokens rather than hardcoding colors when styling category-related UI.
- `src/store/booking.js` is a minimal hand-rolled store (no Pinia/Vuex): a `reactive()` object plus `saveBooking`/`loadBooking`/`clearBooking` helpers that mirror state to `localStorage` under `g2a_booking`, so an in-progress booking survives page reloads/navigation through the checkout flow.
- `src/services/api.js` is the axios client for the main app: attaches `Authorization: Bearer <authToken>` from `localStorage` on every request, and logs (but does not swallow) response errors via an interceptor.

### Dynamic booking fields (product booking page)

The booking form (quantity, dates, transfer type, etc.) is driven entirely by a schema the backend returns per product, not hardcoded per product type:

- `src/components/activities/booking-fields/fieldRegistry.js` maps a schema field's `field` key (e.g. `"date"`, `"transfer_type"`, `"quantity"`) to the Vue component that renders it (`src/components/activities/booking-fields/fields/*.vue`).
- `src/components/activities/booking-fields/BookingFieldRenderer.vue` looks up and renders the right component via `<component :is>` for each entry in the schema's `fields` array, forwarding `field`, `modelValue`, and — importantly — the whole shared `form` object as a prop.
- `src/views/activities/ProductBooking.vue` is the actual live parent: it holds a single flat `reactive` `form` object keyed by field name (`form.date`, `form.transfer_type`, `form.pickup_location`, ...) and loops `v-for="field in fields"` over `BookingFieldRenderer`, passing that same `form` down to every field. Field components that need to know another field's value (e.g. `Transfertypefield.vue` reading `form.date` to restrict pickup times to 2+ hours from now, or `ReturnDateField.vue` reading `form.pickup_date`) just declare a `form` prop and read off it — the plumbing already exists, adding cross-field logic is opt-in per component.
  - Note: `ActivityBookingCard.vue` also imports `BookingFieldRenderer` and keeps its own local `form`/`fields`, but never actually renders it — that code is dead. `ProductBooking.vue` is the one that matters.
- New field types: add the component under `fields/`, register it in `fieldRegistry.js` under the schema key the backend will send, and add a `form` prop if it needs to read sibling fields.

### Dynamic checkout sections

Same registry pattern, one layer up, for the checkout page:

- `src/components/activities/checkout/sectionRegistry.js` maps a schema section's `section` key (e.g. `"customer_details"`, `"rental_details"`, `"flight_details"`) to its component (`src/components/activities/checkout/sections/*.vue`) and a display title.
- `CheckoutRenderer.vue` reads `bookingTemplate.booking_page_schema.sections`, filters to `enabled`, sorts by `sort_order` (descending), and renders each through `SectionRenderer.vue`, which resolves the component from the registry and passes it `config` (the section's own schema config) and `quote`.
- Section components read/write their own slice of state directly on `bookingStore.form` (e.g. `booking.form.rental_details`, `booking.form.flight_details`), usually via a `computed({ get, set })` that lazily initializes the slice with sensible defaults. `CheckoutForm.vue` submits `bookingStore.form` as-is to `POST /v1/orders/:estimate_id` — there is no separate payload-assembly step, so a new section just needs to write into its own `booking.form.<key>` to be included in the order.
- New sections: add the component under `sections/`, register it in `sectionRegistry.js` under the schema key the backend will send.

### Dialog-based pickers

Several pickers (`LocationPicker.vue`, `RentalDetails.vue`'s pickup/drop dialogs, `Transfertypefield.vue`'s pickup-time dialog, `FlightDetails.vue`'s airline dialog) use the same `v-dialog` styling convention for consistency — reuse it verbatim for new dialogs rather than Vuetify's defaults:

```html
<v-dialog
  v-model="dialog"
  max-width="500"
  scrollable
  :fullscreen="mobile"
  scrim="rgba(15,23,42,.30)"
  :style="{ backdropFilter: 'blur(5px)', webkitBackdropFilter: 'blur(5px)' }"
>
```

`mobile` comes from `const { mobile } = useDisplay()` (from `"vuetify"`) so the dialog goes fullscreen on small screens. (`LocationPicker.vue` references `mobile` without importing `useDisplay` — a pre-existing bug there; don't copy that omission into new dialogs.)

### Widgets (`src/widgets/`)

Widgets are independently bundled (IIFE, no code-splitting, terser-minified with console/debugger stripped) so they can be embedded on arbitrary third-party pages. There are two different integration patterns in use:

1. **Registry-driven widgets** (`booking-price`, `product-list`): a host page includes a generic loader (`src/widgets/widget-loader.js`) that scans for `[data-widget]` elements, looks up the widget name in `src/widgets/shared/registry.js`, and dynamically imports its `entry.js`. Each widget's `entry.js` queries the DOM for its own root selector (e.g. `.g2a-product-list-widget`), reads configuration from `data-*` attributes, fetches data via `src/widgets/shared/api.js` (a plain `fetch`-based client hitting `${VITE_API_BASE_URL}/v1/...`, distinct from the axios client used by the main app), and mounts via the shared `mountWidget()` helper (`src/widgets/shared/mount.js`), which shows a loading state, then the Vue component, or an inline error trace on failure.
2. **Self-contained class-based widget** (`activities-bike-rentals-widget-entry.js`): exposes a global `window.ActivitiesBikeRentalsWidget` class with its own `mount()`/`destroy()` lifecycle, builds its own Vuetify instance inline (separate theme from the main app's), and auto-mounts on `DOMContentLoaded` for any `[data-activities-bike-rentals-widget-auto]` element. It also emits `activitiesBikeRentalsWidgetResize` events and auto-adjusts the host container's `min-height` via `ResizeObserver`/`MutationObserver`, since it's expected to run inside an iframe/embed on an external site.

When adding a new widget, prefer the registry-driven pattern unless there's a specific reason (like Vuetify/theme needs or standalone global-API requirements) to follow the bike-rentals pattern.
