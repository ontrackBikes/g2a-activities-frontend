import ResultPage from "@/pages/ResultPage.vue";
import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";
import Checkout from "@/views/activities/Checkout.vue";
import Payment from "@/views/activities/Payment.vue";
import BookingConfirmation from "@/views/activities/BookingConfirmation.vue";
import ProductDetails from "@/views/activities/ProductDetails.vue";
import ActivitiesProductType from "@/views/activities/ActivitiesProductType.vue";
import ActivitiesCategory from "@/views/activities/ActivitiesCategory.vue";
import ActivitiesHome from "@/views/activities/ActivitiesHome.vue";

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

        {
          path: "checkout",
          name: "Checkout",
          component: Checkout,
        },

        {
          path: "payment",
          name: "Payment",
          component: Payment,
        },

        {
          path: "confirmation/:orderId",
          name: "BookingConfirmation",
          component: BookingConfirmation,
        },
      ],
    },
  ],
});

export default router;
