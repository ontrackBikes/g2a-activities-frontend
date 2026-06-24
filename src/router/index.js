import ResultPage from "@/pages/ResultPage.vue";
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

import Checkout from "@/components/bike_rentals/Checkout.vue";
import DeliveryOptions from "@/components/bike_rentals/DeliveryOptions.vue";
import CheckAvailability from "@/components/bike_rentals/CheckAvailability.vue";
import HomePage from "@/components/activities/HomePage.vue";
import ActivitiesList from "@/views/Activitieslistview.vue";
import ProductDetails from "@/components/activities/ProductDetails.vue";
import ActivitiesLayout from "@/layouts/ActivitiesLayout.vue";
import ScubaView from "@/views/activities/ScubaView.vue";
import ActivityHomeView from "@/views/activities/HomeView.vue";
import HistoryView from "@/views/activities/HistoryView.vue";
import GettingAroundView from "@/views/activities/GettingAroundView.vue";
import WaterSportsView from "@/views/activities/WaterSportsView.vue";
import DayTripsView from "@/views/activities/DayTripsView.vue";
import KayakingView from "@/views/activities/KayakingView.vue";
import ProductLayout from "@/layouts/ProductLayout.vue";
import ActivitiesHome from "@/views/activities/ActivitiesHome.vue";
import ActivitiesCategory from "@/views/activities/ActivitiesCategory.vue";
import ActivitiesProductType from "@/views/activities/ActivitiesProductType.vue";
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

        // {
        //   path: "/v2",
        //   component: ActivitiesLayout,
        //   children: [

        //   ],
        // },

        // {
        //   path: "/v2/:id",
        //   component: ActivitiesLayout,
        //   children: [
        //     {
        //       path: "/",
        //       name: "ActivitiesHome",
        //       component: ActivityHomeView,
        //     },
        //     {
        //       path: ":id",
        //       name: "ActivitiesCategory",
        //       component: ProductLayout,
        //     },
        //   ]
        //   },
        // {
        //   path: "/activities-list",
        //   name: "ActivitiesList",
        //   component: ActivitiesList,
        // },
        {
          path: "/activities/product/:slug",
          name: "ProductDetail",
          component: ProductDetails,
        },
      ],
    },
    {
      path: "/v2",
      name: "Activities",
      component: ActivitiesHome,
    },

    {
      path: "/activities/:category",
      name: "ActivitiesCategory",
      component: ActivitiesCategory,
    },

    {
      path: "/activities/:category/:productType",
      name: "ActivitiesProductType",
      component: ActivitiesProductType,
    },

    {
      path: "/payment/status",
      name: "PaymentResult",
      component: ResultPage,
    },
  ],
});

export default router;
