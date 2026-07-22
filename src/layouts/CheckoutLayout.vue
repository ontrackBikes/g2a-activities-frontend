<template>
  <v-app>
    <v-app-bar app flat height="76" class="border-b">
      <v-container
        fluid
        class="px-4 px-md-8 h-100 d-flex align-center justify-space-between"
      >
        <div class="d-flex align-center">
          <RouterLink to="/" class="d-flex align-center text-decoration-none">
            <img :src="logo" width="180" alt="Go2Andaman" />
          </RouterLink>

          <template v-if="!mobile">
            <v-divider vertical class="mx-4 my-6" style="height: 22px" />

            <div class="d-flex align-center">
              <v-icon color="brandColor2" size="24" class="mr-2">
                mdi-map-marker-outline
              </v-icon>

              <div>
                <div class="g2a-text-14 ">Andaman</div>

                <div class="g2a-text-11">India</div>
              </div>
            </div>
          </template>
        </div>
      </v-container>
    </v-app-bar>

    <v-main>
      <div class="mx-auto" style="max-width: 1020px; min-height: calc(100vh - 220px); margin-bottom: 120px">
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
