export default {
  id: "booking-price",

  name: "Booking Price",

  category: "Booking",

  selector: ".g2a-book-price-widget",

  description:
    "Displays the starting price and Book Now button.",

  options: [
    {
      key: "slug",
      label: "Product Slug",
      type: "product",
      required: true,
    },
    {
      key: "baseUrl",
      label: "Booking Website",
      type: "text",
      default: "https://go2andaman.com",
    },
  ],
};