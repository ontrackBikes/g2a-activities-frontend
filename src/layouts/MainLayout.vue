<template>
  <v-app style="background: #F4F5FA;">
    <v-app-bar app height="76" flat class="border-b">
      <v-container
        fluid
        class="px-4 px-md-8 h-100 d-flex align-center justify-space-between"
      >
        <div class="d-flex align-center">
          <RouterLink
            to="/"
            class="d-flex align-center mr-2 text-decoration-none"
          >
            <img
              :src="
                isDark ? '/assets/g2a_logo_dark.png' : '/assets/g2a_logo_light.png'
              "
              :width="mobile ? 180 : 180"
              alt="Go2Andaman"
            />
          </RouterLink>

          <v-divider
            v-if="!mobile"
            vertical
            class="mx-4 my-6"
            style="height: 22px"
          />

          <div
            v-if="!mobile"
            class="d-flex align-center"
            style="line-height: 1.2"
          >
            <v-icon color="brandColor2" size="24" class="mr-2"
              >mdi-map-marker-outline</v-icon
            >
            <div class="d-flex flex-column justify-center">
              <span class="g2a-text-14 g2a-title-lg-700 text-high-emphasis"
                >Andaman</span
              >
              <span class="g2a-text-11">India</span>
            </div>
          </div>
        </div>

        <div
          class="flex-grow-1 mx-4 mx-lg-12 d-none d-md-flex position-relative"
          style="max-width: 480px"
        >
          <v-text-field
            variant="outlined"
            readonly
            prepend-inner-icon="mdi-magnify"
            flat
            density="compact"
            hide-details
            rounded="lg"
            class="cursor-pointer"
            @click="searchDialog = true"
          />
          <v-fade-transition mode="out-in">
            <div
              :key="currentPlaceholder"
              class="position-absolute text-grey-darken-1 g2a-text-14"
              style="
                left: 44px;
                top: 50%;
                transform: translateY(-50%);
                pointer-events: none;
              "
            >
              {{ currentPlaceholder }}
            </div>
          </v-fade-transition>
        </div>

        <div class="d-flex align-center ga-3">
          <v-btn
            icon="mdi-magnify"
            variant="text"
            color="brandColor2"
            class="d-md-none"
            @click="searchDialog = true"
          />

          <v-btn
            v-if="!mobile"
            color="brandColor"
            variant="flat"
            rounded="lg"
            class="px-6 text-none"
            height="42"
            href="https://go2andaman.com/contact-us/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact Us
          </v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <v-dialog
      v-model="searchDialog"
      scrollable
      width="600"
      persistent
      min-height="600"
      :fullscreen="mobile"
      :transition="mobile ? 'dialog-bottom-transition' : false"
      scrim="rgba(15, 23, 42, 0.3)"
      :style="{
        backdropFilter: 'blur(5px)',
        webkitBackdropFilter: 'blur(5px)',
      }"
    >
      <v-card
        
        class="d-flex flex-column h-100"
        :rounded="mobile ? false : 'xl'"
      >
        <div class="border-b py-4">
          <v-container class="px-4 d-flex align-center ga-3">
            <v-text-field
              v-model="searchTerm"
              autofocus
              prepend-inner-icon="mdi-magnify"
              placeholder="Search experiences, activities..."
              variant="outlined"
              color="brandColor2"
              density="compact"
              hide-details
              clearable
              rounded="lg"
              class="flex-grow-1"
            />
            <v-btn
              icon="mdi-close"
              variant="icon"
              rounded="lg"
              @click="closeSearchDialog"
            >
            </v-btn>
          </v-container>
        </div>

        <v-card-text class="pa-0 overflow-y-auto">
          <v-container style="max-width: 800px" class="py-6 px-4">
            <ActivitySearch
              :search-term="searchTerm"
              @close="closeSearchDialog"
              @update-loading="(val) => (loading = val)"
            />
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="brandColor"
      height="3"
      absolute
      top
      style="z-index: 1010"
    />

    <v-main>
      <v-container style="max-width: 1200px; min-height: calc(100vh - 220px)" >
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import { useTheme } from "vuetify";

const theme = useTheme();

const isDark = computed(() => theme.global.current.value.dark);

import ActivitySearch from "./ActivitySearch.vue";

const { mobile } = useDisplay();

const loading = ref(false);
const searchDialog = ref(false);
const searchTerm = ref("");

const placeholders = [
  "Search experiences...",
  "Search activities...",
  "Search bike rental...",
  "Search scuba diving...",
  "Search snorkeling...",
];
const currentPlaceholder = ref(placeholders[0]);
let placeholderInterval = null;

const closeSearchDialog = () => {
  searchDialog.value = false;
  searchTerm.value = "";
};

onMounted(() => {
  let index = 0;
  placeholderInterval = setInterval(() => {
    index = (index + 1) % placeholders.length;
    currentPlaceholder.value = placeholders[index];
  }, 2500);
});

onUnmounted(() => {
  clearInterval(placeholderInterval);
});
</script>
