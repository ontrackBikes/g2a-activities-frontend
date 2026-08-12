<template>
  <v-app>
    <v-app-bar app flat height="76" class="border-b">
      <v-container
        fluid
        class="h-100 d-flex align-center justify-space-between"
      >
        <div class="d-flex align-center">
          <a
            href="https://go2andaman.com/book-experiences/"
            target="_blank"
            class="d-flex align-center text-decoration-none"
          >
            <img :src="logo" width="180" alt="Go2Andaman" />
          </a>

          <!-- <template v-if="!mobile">
            <v-divider vertical class="mx-4 my-6" style="height: 22px" />

            <div class="d-flex align-center">
              <v-icon color="brandColor2" size="24" class="mr-2">
                mdi-map-marker-outline
              </v-icon>

              <div>
                <div class="g2a-text-14">Andaman</div>

                <div class="g2a-text-11">India</div>
              </div>
            </div>
          </template> -->
        </div>
        <div class="d-flex align-center justify-center ">
          <v-icon color="success" size="14" class="mr-1">mdi-lock</v-icon>
          Secure Booking
        </div>
      </v-container>
    </v-app-bar>

    <v-main>
      <div
        class="mx-auto px-4"
        style="
          max-width: 1020px;
          min-height: calc(100vh - 220px);
          margin-bottom: 120px;
        "
      >
        <BookingStepper v-if="currentStep" :model-value="currentStep" />

       <div class="mx-auto">
         <router-view />
       </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from "vue";
import { useDisplay, useTheme } from "vuetify";
import { useRoute } from "vue-router";
import BookingStepper from "@/components/common/BookingStepper.vue";

const { mobile } = useDisplay();
const theme = useTheme();
const route = useRoute();

const STEP_BY_ROUTE_NAME = {
  ProductBooking: 1,
  Checkout: 2,
  OrderDetails: 3,
};

const currentStep = computed(() => STEP_BY_ROUTE_NAME[route.name] ?? null);

const logo = computed(() =>
  theme.global.current.value.dark
    ? "/assets/g2a_logo_dark.png"
    : "/assets/g2a_logo_light.png",
);
</script>
