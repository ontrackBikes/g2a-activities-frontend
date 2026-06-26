import { reactive } from "vue";

export const bookingStore = reactive({
  product: {},

  bookingTemplate: {},

  form: {
    travel_date: "",

    slot_id: null,

    guests: 1,

    customer: {},

    participants: [],

    emergency_contact: {},

    medical: {},

    waiver: {},

    bike_delivery: {},

    ferry: {},
  },
});

export function resetBooking() {
  bookingStore.product = {};
  bookingStore.bookingTemplate = {};

  bookingStore.form = {
    travel_date: "",
    slot_id: null,
    guests: 1,

    customer: {},
    participants: [],
    emergency_contact: {},
    medical: {},
    waiver: {},
    bike_delivery: {},
    ferry: {},
  };
}