<template>
  <v-app>
    <v-app-bar app color="white" height="73" class="custom-shadow">
      <v-container fluid class="px-6 d-flex align-center justify-space-between">
        <RouterLink to="/" class="text-decoration-none d-flex align-center">
          <img src="/assets/g2a_logo.png" alt="Go2Andaman" height="22" />
        </RouterLink>

        <div
          class="flex-grow-1 mx-10 d-none d-md-flex"
          style="max-width: 600px"
        >
          <v-text-field
            v-model="searchTerm"
            prepend-inner-icon="mdi-magnify"
            placeholder="Search activities..."
            variant="outlined"
            rounded="xl"
            density="compact"
            hide-details
            clearable
          />
        </div>

        <div class="d-flex align-center ga-2">
          <v-btn variant="text" prepend-icon="mdi-map-marker">
            <span class="g2a-text-16 g2a-text-bold-600">Andaman</span>
          </v-btn>
          <v-btn icon variant="text">
            <v-icon>mdi-heart-outline</v-icon>
          </v-btn>
          <v-avatar color="brandColor">
            <v-icon color="white" icon="mdi-account-circle"></v-icon>
          </v-avatar>
        </div>
      </v-container>
    </v-app-bar>

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      absolute
      top
    />

    <v-main class="bg-white">
      <v-container style="max-width: 1400px; min-height: calc(100vh - 220px)">
        <router-view />
      </v-container>
    </v-main>

    <v-footer color="white" class="border-t">
      <v-container class="py-12">
        <v-row>
          <!-- Left -->
          <v-col cols="12" md="4">
            <img src="/assets/g2a_logo.png" alt="Go2Andaman" height="22" />

            <div class="g2a-text-16 mt-6">
              Andaman's independent travel platform. Plan, book, and explore the
              islands on your own terms. Based in Port Blair since 2008.
            </div>

            <div class="g2a-text-22 g2a-text-bold-600 mt-10 mb-6">
              Follow us
            </div>

            <div class="d-flex ga-4">
              <v-btn icon color="amber" size="48" elevation="0">
                <v-icon size="20" color="white">mdi-instagram</v-icon>
              </v-btn>

              <v-btn icon color="amber" size="48" elevation="0">
                <v-icon size="20" color="white">mdi-facebook</v-icon>
              </v-btn>

              <v-btn icon color="amber" size="48" elevation="0">
                <v-icon size="20" color="white">mdi-twitter</v-icon>
              </v-btn>

              <v-btn icon color="amber" size="48" elevation="0">
                <v-icon size="20" color="white">mdi-linkedin</v-icon>
              </v-btn>
            </div>
          </v-col>

          <!-- Navigation -->
          <v-col cols="6" md="3">
            <div class="g2a-text-22 g2a-text-bold-600">Navigation</div>

            <v-list density="comfortable" bg-color="transparent">
              <v-list-item title="Activities" />
              <v-list-item title="Water Sports" />
              <v-list-item title="Day Trips" />
              <v-list-item title="Book Andaman Ferry" />
              <v-list-item title="Travel Blog" />
              <v-list-item title="About us" />
              <v-list-item title="Careers" />
            </v-list>
          </v-col>

          <!-- Legal -->
          <v-col cols="6" md="2">
            <div class="g2a-text-22 g2a-text-bold-600">Legal</div>

            <v-list density="comfortable" bg-color="transparent">
              <v-list-item title="Contact Us" />
              <v-list-item title="Refunds & Cancellations" />
              <v-list-item title="Terms & Conditions" />
              <v-list-item title="Content Disclaimer" />
              <v-list-item title="Privacy Policy" />
            </v-list>
          </v-col>

          <!-- Contact -->
          <v-col cols="12" md="3">
            <div class="g2a-text-22 g2a-text-bold-600">Contact</div>

            <v-list density="comfortable" bg-color="transparent">
              <v-list-item>
                <v-icon size="20" class="mr-4">mdi-email</v-icon
                >info@go2andaman.com</v-list-item
              >
              <v-list-item>
                <v-icon size="20" class="mr-4">mdi-phone</v-icon>+91 (80)
                45686588</v-list-item
              >
            </v-list>
          </v-col>
        </v-row>

        <v-divider class="my-6" />

        <div class="text-center text-grey g2a-text-16 g2a-text-bold-500">
          © Copyright {{ new Date().getFullYear() }} All Rights Reserved by
          Go2Andaman
        </div>
      </v-container>
    </v-footer>

    <v-fab
      v-show="showTop"
      icon="mdi-arrow-up"
      location="bottom end"
      color="black"
      app
      @click="scrollTop"
    />
  </v-app>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// Global App State
const loading = ref(false);
const showTop = ref(false);
const currentYear = computed(() => new Date().getFullYear());

// Search State
const searchTerm = ref(route.query.q || "");
let searchDebounce = null;

// ---- 1. Sync Input -> URL (Debounced) ----
watch(searchTerm, (newVal) => {
  clearTimeout(searchDebounce);

  searchDebounce = setTimeout(() => {
    // Avoid redundant pushes if the URL already matches the input
    if (newVal === (route.query.q || "")) return;

    const query = { ...route.query };
    if (newVal) {
      query.q = newVal;
    } else {
      delete query.q;
    }

    // If we aren't on the search page, push to it. Otherwise replace to save history state.
    if (route.path !== "/search") {
      router.push({ path: "/search", query });
    } else {
      router.replace({ query });
    }
  }, 300);
});

// ---- 2. Sync URL -> Input (Handles Browser Back/Forward) ----
watch(
  () => route.query.q,
  (newQ) => {
    const val = newQ || "";
    if (val !== searchTerm.value) {
      searchTerm.value = val;
    }
  },
  { immediate: true },
);

// ---- Scroll Handling ----
const onScroll = () => {
  showTop.value = window.scrollY > 500;
};

const scrollTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  clearTimeout(searchDebounce);
});
</script>

<style scoped>
.custom-shadow {
  -webkit-box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15) !important;
  transition: All 600ms ease;
  -webkit-transition: All 600ms ease;
}

.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}
.v-main {
  background: #fafafa;
}
</style>
