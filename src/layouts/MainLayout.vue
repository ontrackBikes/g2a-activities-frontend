<template>
  <v-app>
    <v-app-bar app color="white" height="73" class="custom-shadow">
      <v-container
        fluid
        class="px-4 px-md-8 h-100 d-flex align-center justify-space-between"
      >
        <div class="d-flex align-center">
          <RouterLink to="/" class="logo-link d-flex align-center mr-2">
            <img
              src="/assets/g2a_logo.png"
              :height="mobile ? 20 : 26"
              alt="Go2Andaman Logo"
              class="logo-img"
            />
          </RouterLink>

          <div
            v-if="!mobile"
            class="location-divider mx-4 d-none d-sm-block"
          ></div>

          <div
            v-if="!mobile"
            class="d-flex align-center location-wrapper px-2 py-1 rounded-lg d-none d-sm-flex"
          >
            <v-icon color="brandColor2" size="24" class="mr-2">
              mdi-map-marker-outline
            </v-icon>
            <div class="d-flex flex-column justify-center">
              <span class="g2a-text-14 g2a-text-bold-700 line-height-tight"
                >Andaman</span
              >
              <span class="g2a-text-11 line-height-tight">India</span>
            </div>
          </div>
        </div>

        <div
          class="flex-grow-1 mx-4 mx-lg-12 d-none d-md-flex search-container"
        >
          <v-text-field
            v-model="searchTerm"
            prepend-inner-icon="mdi-magnify"
            variant="solo"
            flat
            density="comfortable"
            hide-details
            clearable
            class="custom-search-field"
            @focus="handleSearchFocus"
          />

          <v-fade-transition mode="out-in">
            <div
              v-if="!searchTerm && !isSearchFocused"
              :key="currentPlaceholder"
              class="animated-placeholder"
            >
              {{ currentPlaceholder }}
            </div>
          </v-fade-transition>
        </div>

        <div class="d-flex align-center ga-3">
          <v-btn
            v-if="mobile"
            icon="mdi-magnify"
            variant="text"
            color="brandColor2"
            @click="handleMobileSearch"
            aria-label="Search"
          />

          <v-btn
            v-else
            color="brandColor"
            variant="flat"
            rounded="xl"
            class="px-6 text-none font-weight-medium contact-btn"
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

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="brandColor"
      height="3"
      absolute
      top
      style="z-index: 1010"
    />

    <v-main class="bg-white">
      <v-container style="max-width: 1200px; min-height: calc(100vh - 220px)">
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
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

const router = useRouter();
const route = useRoute();

const loading = ref(false);
const showTop = ref(false);
const isSearchFocused = ref(false);

const placeholders = [
  "Search experiences...",
  "Search activities...",
  "Search ferries...",
  "Search scuba diving...",
  "Search snorkeling...",
  "Search sea walk...",
];

const currentPlaceholder = ref(placeholders[0]);
let placeholderInterval = null;

// Search Logic State
const searchTerm = ref(route.query.q || "");
let searchDebounce = null;

const handleSearchFocus = () => {
  isSearchFocused.value = true;
  // Route to search page immediately on user interaction
  if (route.path !== "/search") {
    router.push({
      path: "/search",
      query: searchTerm.value ? { q: searchTerm.value } : {},
    });
  }
};

const handleMobileSearch = () => {
  router.push({ path: "/search" });
};

// Sync inputs to Search queries dynamically
watch(searchTerm, (newVal) => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    if (newVal === (route.query.q || "")) return;

    const query = { ...route.query };
    if (newVal) {
      query.q = newVal;
    } else {
      delete query.q;
    }

    if (route.path !== "/search") {
      router.push({ path: "/search", query });
    } else {
      router.replace({ query });
    }
  }, 300);
});

// Sync Address query changes outwards (Back/Forward actions)
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

// Focus Watcher to restore placeholder if clicked away
watch(
  () => route.path,
  (newPath) => {
    if (newPath !== "/search") {
      isSearchFocused.value = false;
    }
  },
);

// Component Lifecycles
onMounted(() => {
  let index = 0;
  placeholderInterval = setInterval(() => {
    index = (index + 1) % placeholders.length;
    currentPlaceholder.value = placeholders[index];
  }, 2500);

  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  clearInterval(placeholderInterval);
  window.removeEventListener("scroll", onScroll);
  clearTimeout(searchDebounce);
});

const onScroll = () => {
  showTop.value = window.scrollY > 500;
};

const scrollTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<style scoped>
.custom-shadow {
  -webkit-box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15) !important;
  transition: All 600ms ease;
  -webkit-transition: All 600ms ease;
}

/* Modern Soft Divider */
.location-divider {
  width: 1px;
  height: 22px;
  background-color: rgba(0, 0, 0, 0.1);
}
.line-height-tight {
  line-height: 1.2;
}
.line-height-relaxed {
  line-height: 1.6;
}

/* Clean Custom Input Elements */
.search-container {
  max-width: 480px;
  position: relative;
}
:deep(.custom-search-field .v-field) {
  background-color: #f3f4f6 !important;
  border-radius: 28px !important;
  border: 1px solid transparent;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
:deep(.custom-search-field .v-field--focused) {
  background-color: #ffffff !important;
  border-color: rgba(var(--v-theme-brandColor2), 0.6) !important;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06) !important;
}
:deep(.custom-search-field .v-field__input) {
  min-height: 44px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  font-size: 0.95rem;
}

/* Floating Inline Placeholder Layout */
.animated-placeholder {
  position: absolute;
  left: 44px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  font-size: 0.92rem;
  font-weight: 400;
}
</style>
