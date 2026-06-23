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
        {
          path: "/activities",
          name: "Activities",
          component: HomePage,
        },
        {
          path: "/v2",
          component: ActivitiesLayout,
          children: [
            {
              path: "",
              name: "ActivitiesHome",
              component: ActivityHomeView,
            },
            {
              path: "scuba",
              name: "Scuba",
              component: ScubaView,
            },
            {
              path: "kayaking",
              name: "Kayaking",
              component: KayakingView,
            },
            {
              path: "day-trips",
              name: "DayTrips",
              component: DayTripsView,
            },
            {
              path: "water-sports",
              name: "WaterSports",
              component: WaterSportsView,
            },
            {
              path: "getting-around",
              name: "GettingAround",
              component: GettingAroundView,
            },
            {
              path: "history",
              name: "History",
              component: HistoryView,
            },
          ],
        },
        // {
        //   path: "/activities-list",
        //   name: "ActivitiesList",
        //   component: ActivitiesList,
        // },
        {
          path: "/activities/:id",
          name: "ProductDetail",
          component: ProductDetails,
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
