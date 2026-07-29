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

          <template v-if="!mobile">
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
          </template>
        </div>
        <div class="d-flex align-center justify-center ">
          <v-icon color="success" size="14" class="mr-1">mdi-lock</v-icon>
          Secure Booking
        </div>
      </v-container>
    </v-app-bar>

    <v-main>
      <div
        class="mx-auto"
        style="
          max-width: 1020px;
          min-height: calc(100vh - 220px);
          margin-bottom: 120px;
        "
      >
        <router-view />
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from "vue";
import { useDisplay, useTheme } from "vuetify";

const { mobile } = useDisplay();
const theme = useTheme();

const logo = computed(() =>
  theme.global.current.value.dark
    ? "/assets/g2a_logo_dark.png"
    : "/assets/g2a_logo_light.png",
);
</script>
