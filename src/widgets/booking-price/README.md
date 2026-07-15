# Booking Price Widget

Displays a configurable booking card for a single product. The widget fetches live product information from the Activities API and renders a booking card with price, availability and a call-to-action.

---

## Usage

```html
<link
  rel="stylesheet"
  href="g2a-book-price-widget.css">

<div
  class="g2a-book-price-widget"
  data-slug="scuba-diving-in-havelock"
  data-base-url="https://go2andaman.com">
</div>

<script src="g2a-book-price-widget.iife.js"></script>
```

---

## Complete Example

```html
<div
  class="g2a-book-price-widget"

  data-slug="scuba-diving-in-havelock"

  data-base-url="https://go2andaman.com"

  data-show-image="true"
  data-show-product-name="true"
  data-show-description="true"
  data-show-location="true"

  data-show-price="true"

  data-show-guests="true"
  data-show-locations="false"

  data-show-meta="true"

  data-show-button="true"

  data-button-text="Book Now"

  data-out-of-stock-text="Currently Unavailable"
  data-out-of-stock-button-text="Unavailable">
</div>
```

---

## Configuration

| Attribute | Required | Default | Description |
|------------|:--------:|:-------:|-------------|
| `data-slug` | ✅ | - | Product slug |
| `data-base-url` | ❌ | `http://localhost:5173` | Base booking website URL |
| `data-show-image` | ❌ | `true` | Display the product image |
| `data-show-product-name` | ❌ | `true` | Display the product name |
| `data-show-description` | ❌ | `true` | Display the short description |
| `data-show-location` | ❌ | `true` | Display the selected location |
| `data-show-price` | ❌ | `true` | Display the starting price |
| `data-show-guests` | ❌ | `true` | Display the maximum guests allowed |
| `data-show-locations` | ❌ | `false` | Display all available locations |
| `data-show-meta` | ❌ | `true` | Display the metadata section |
| `data-show-button` | ❌ | `true` | Display the CTA button |
| `data-button-text` | ❌ | `Book Now` | CTA button text |
| `data-out-of-stock-text` | ❌ | `Currently Unavailable` | Text shown when the product is unavailable |
| `data-out-of-stock-button-text` | ❌ | `Unavailable` | Disabled button text |

---

## Common Configurations

### Minimal

```html
<div
  class="g2a-book-price-widget"
  data-slug="scuba-diving-in-havelock"
  data-show-image="false"
  data-show-description="false"
  data-show-meta="false">
</div>
```

### CTA Only

```html
<div
  class="g2a-book-price-widget"
  data-slug="scuba-diving-in-havelock"
  data-show-image="false"
  data-show-description="false"
  data-show-price="true"
  data-button-text="Reserve Now">
</div>
```

### Blog Widget

```html
<div
  class="g2a-book-price-widget"
  data-slug="scuba-diving-in-havelock"
  data-show-locations="true"
  data-button-text="View Details">
</div>
```

---

## API

The widget fetches product information from:

```
GET /api/v1/products/app/products-list/:slug
```

Example:

```
GET /api/v1/products/app/products-list/scuba-diving-in-havelock
```

---

## Build

```bash
npm run build:booking-price-widget
```

Output:

```text
dist-booking-price-widget/
├── g2a-book-price-widget.iife.js
└── g2a-book-price-widget.css
```

---

## Project Structure

```text
booking-price/
├── BookingPriceWidget.vue
├── entry.js
├── index.js
├── schema.js
└── README.md
```

---

## Example Response

The widget consumes a product object similar to:

```json
{
  "name": "Scuba Diving",
  "slug": "scuba-diving",
  "thumbnail_url": "...",
  "starting_price": 3500,
  "price_type": "SLOT",
  "redirectUrl": "/water-sports/scuba-diving/scuba-diving-in-havelock/book",
  "out_of_stock": false,
  "selectedLocation": {
    "name": "Havelock Island"
  }
}
```