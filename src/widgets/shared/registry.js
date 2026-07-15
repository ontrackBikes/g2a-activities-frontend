import bookingPriceSchema from "../booking-price/schema";

export default {
  "booking-price": {
    schema: bookingPriceSchema,

    loader: () => import("../booking-price/entry.js"),
  },
};