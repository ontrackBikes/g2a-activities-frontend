import ProductListWidget from "./ProductListWidget.vue";
import { mountWidget } from "../shared/mount";
import { getProducts } from "../shared/api";

console.log("Product List Widget Loaded");
document
  .querySelectorAll(".g2a-product-list-widget")
  .forEach((element) => {
    console.log("Found widgets:", element);
    mountWidget({
      element,

      component: ProductListWidget,

      loader: async () => {

        const {
          redirectTemplate,
          baseUrl = "http://localhost:5173",
        } = element.dataset;


        const products = await getProducts({
          page: element.dataset.page || 1,
          limit: element.dataset.limit || 12,
          sort: element.dataset.sort,
          product_type_slug:
            element.dataset.productTypeSlug,
          location_slugs:
            element.dataset.locationSlugs,
          tag_slugs:
            element.dataset.tagSlugs,
        });
        

        return {
          products,
          baseUrl,
          redirectTemplate
        };
      },
    });
  });