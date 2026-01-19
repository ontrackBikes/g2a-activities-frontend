import ResultPage from "@/pages/ResultPage.vue";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

import Checkout from "@/components/bike_rentals/Checkout.vue";
import DeliveryOptions from "@/components/bike_rentals/DeliveryOptions.vue";
import CheckAvailability from "@/components/bike_rentals/CheckAvailability.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
      children: [
        {
          path: "/",
          name: "Step1",
          component: CheckAvailability,
        },
        {
          path: "/select-pickup-delivery",
          name: "Step2",
          component: DeliveryOptions,
        },
        {
          path: "/bike-rentals-checkout",
          name: "Step3",
          component: Checkout,
        },
      ],
    },

    {
      path: "/payment/status",
      name: "PaymentResult",
      component: ResultPage,
    },
  ],
});

export default router;
