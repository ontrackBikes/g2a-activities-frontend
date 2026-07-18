export default {
  id: "product-list",

  name: "Product List",

  category: "Products",

  selector: ".g2a-product-list-widget",

  description:
    "Displays a list of products with filters.",

  options: [
    {
      key: "baseUrl",
      type: "text",
      default: "https://go2andaman.com",
    },
    {
      key: "page",
      type: "number",
      default: 1,
    },
    {
      key: "limit",
      type: "number",
      default: 12,
    },
    {
      key: "sort",
      type: "select",
      options: [
        "price_asc",
        "price_desc",
        "featured",
      ],
    },
    {
      key: "product_type_slug",
      type: "text",
    },
    {
      key: "location_slugs",
      type: "text",
    },
    {
      key: "tag_slugs",
      type: "text",
    },
    {
      key: "redirectTemplate",
      label: "Redirect URL",
      type: "text",
      default:
        "/{category}/{productType}/{product}-in-{location}",
    },
  ],
};