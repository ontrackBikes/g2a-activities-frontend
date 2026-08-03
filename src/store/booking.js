// src/store/booking.js

import { reactive } from "vue";

const STORAGE_KEY = "g2a_booking";

export const bookingStore = reactive({
  product: null,
  bookingTemplate: null,
  form: {},
});

export function saveBooking(payload) {
  bookingStore.product = payload.product;
  bookingStore.bookingTemplate = payload.bookingTemplate;
  bookingStore.form = payload.form;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      product: payload.product,
      bookingTemplate: payload.bookingTemplate,
      form: payload.form,
    }),
  );
}

export function loadBooking() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return;

  const data = JSON.parse(raw);

  bookingStore.product = data.product;
  bookingStore.bookingTemplate = data.bookingTemplate;
  bookingStore.form = data.form;
}

export function clearBooking() {
  bookingStore.product = null;
  bookingStore.bookingTemplate = null;
  bookingStore.form = {};

  localStorage.removeItem(STORAGE_KEY);
}