import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";
import ProductDetails from "@/views/activities/ProductDetails.vue";
import ActivitiesProductType from "@/views/activities/ActivitiesProductType.vue";
import ActivitiesCategory from "@/views/activities/ActivitiesCategory.vue";
import ActivitiesHome from "@/views/activities/ActivitiesHome.vue";
import ActivitySearch from "@/layouts/ActivitySearch.vue";
import OrderDetails from "@/views/activities/OrderDetails.vue";
import PaymentStatus from "@/views/activities/PaymentStatus.vue";
import OrderSuccess from "@/views/activities/OrderSuccess.vue";
import OrderFailed from "@/views/activities/OrderFailed.vue";
import OrderView from "@/views/activities/OrderView.vue";
import ProductBooking from "@/views/activities/ProductBooking.vue";
import CheckoutForm from "@/components/activities/checkout/CheckoutForm.vue";
import ActivitiesLocation from "@/views/location/ActivitiesLocation.vue";
import CheckoutLayout from "@/layouts/CheckoutLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: MainLayout,
      children: [
     
        {
          path: "",
          name: "ActivitiesHome",
          component: ActivitiesHome,
        },

        {
          path: "/select-pickup-delivery",
          name: "Pick Delivery",
          component: ActivitySearch,
          redirect: (to) => ({
            path: "/getting-around/bike-rentals/bike-rentals-in-port-blair/book",
            query: to.query,   // retain query params
          }),
        },

        {
          path: "/search",
          name: "Search",
          component: ActivitySearch,
        },

        {
          path: "/location/:location_slug",
          name: "ActivitiesLocation",
          component: ActivitiesLocation,
        },

        {
          path: ":category",
          name: "ActivitiesCategory",
          component: ActivitiesCategory,
        },

        {
          path: ":category/:productType",
          name: "ActivitiesProductType",
          component: ActivitiesProductType,
        },

        {
          path: ":category/:productType/:product",
          name: "ProductDetails",
          component: ProductDetails,
        },

        
      ],
    },
    {
      path: "/",
      name: "Checkout Layout",
      component: CheckoutLayout,
      children: [
        {
          path: "/:category/:productType/:product/book",
          name: "ProductBooking",
          component: ProductBooking,
        },
        {
          path: "checkout/:estimate_id",
          name: "Checkout",
          component: CheckoutForm,
        },
        {
          path: "/checkout/orders/:order_id",
          name: "OrderDetails",
          component: OrderDetails,
        },

        {
          path: "/orders/:order_id",
          name: "Order",
          component: OrderView,
        },

        {
          path: "/checkout/orders/:order_id/payment-status",
          name: "PaymentStatus",
          component: PaymentStatus,
        },

        {
          path: "/checkout/orders/:order_id/success",
          name: "OrderSuccess",
          component: OrderSuccess,
        },
        {
          path: "/checkout/orders/:order_id/failed",
          name: "OrderFailed",
          component: OrderFailed,
        },
      ],
    },
  ],
});

export default router;
