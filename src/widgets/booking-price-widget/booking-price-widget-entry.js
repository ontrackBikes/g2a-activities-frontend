import { createApp } from "vue";
import BookingPriceWidget from "./BookingPriceWidget.vue";
import "./styles.css";

const API_BASE = "http://localhost:3000/api/v1";

async function initWidget(element) {
  const slug = element.dataset.slug;

  if (!slug) {
    element.innerHTML = "Missing data-slug.";
    return;
  }

  try {
    element.innerHTML = "Loading...";

    const response = await fetch(
      `${API_BASE}/products/app/products-list/${slug}`
    );

    if (!response.ok) {
      throw new Error("Unable to fetch product");
    }

    const json = await response.json();

    if (!json.success) {
      throw new Error("Invalid response");
    }

    const product = json.data;

    element.innerHTML = "";

    createApp(BookingPriceWidget, {
      product,
    }).mount(element);
  } catch (err) {
    console.error(err);

    element.innerHTML =
      "<div style='color:red'>Unable to load booking widget.</div>";
  }
}

document
  .querySelectorAll(".g2a-book-price-widget")
  .forEach(initWidget);