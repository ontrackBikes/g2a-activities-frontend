<template>
  <v-app>

    <!-- ========================================= -->
    <!-- TOP APP BAR -->
    <!-- ========================================= -->

    <v-app-bar
      elevation="0"
      height="72"
      color="white"
      class="border-b"
    >
      <v-container
        fluid
        class="px-6 d-flex align-center justify-space-between"
      >
        <!-- Logo -->

        <RouterLink
          to="/"
          class="text-decoration-none d-flex align-center"
        >
          <img
            src="/assets/g2a_logo.png"
            alt="Go2Andaman"
            height="32"
          />
        </RouterLink>

        <!-- Search (Future Ready) -->

        <div
          class="flex-grow-1 mx-10 d-none d-md-flex"
          style="max-width:600px"
        >
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            placeholder="Search Activities..."
            density="comfortable"
            variant="outlined"
            hide-details
            rounded="xl"
            disabled
          />
        </div>

        <!-- Right -->

        <div class="d-flex align-center ga-2">

          <v-btn
            variant="text"
            prepend-icon="mdi-map-marker"
          >
            Andaman
          </v-btn>

          <v-btn
            icon
            variant="text"
          >
            <v-icon>
              mdi-heart-outline
            </v-icon>
          </v-btn>

          <v-btn
            icon
            variant="text"
          >
            <v-icon>
              mdi-account-outline
            </v-icon>
          </v-btn>

        </div>

      </v-container>
    </v-app-bar>

    <!-- ========================================= -->
    <!-- LOADING -->
    <!-- ========================================= -->

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      absolute
      top
    />

    <!-- ========================================= -->
    <!-- PAGE -->
    <!-- ========================================= -->

    <v-main>

      <v-container
        class="py-8"
        style="
          max-width:1400px;
          min-height:calc(100vh - 220px);
        "
      >
        <router-view />
      </v-container>

    </v-main>

    <!-- ========================================= -->
    <!-- FOOTER -->
    <!-- ========================================= -->

    <v-footer
      color="grey-lighten-5"
      class="border-t"
    >

      <v-container>

        <v-row>

          <v-col
            cols="12"
            md="4"
          >

            <img
              src="/assets/g2a_logo.png"
              height="42"
            />

            <div class="mt-3 text-medium-emphasis">

              Explore the best experiences across the
              Andaman Islands.

            </div>

          </v-col>

          <v-col
            cols="6"
            md="2"
          >

            <div class="font-weight-bold mb-3">
              Activities
            </div>

            <div class="mb-2">
              Water Sports
            </div>

            <div class="mb-2">
              Day Trips
            </div>

            <div class="mb-2">
              Ferry Tickets
            </div>

          </v-col>

          <v-col
            cols="6"
            md="2"
          >

            <div class="font-weight-bold mb-3">
              Company
            </div>

            <div class="mb-2">
              About
            </div>

            <div class="mb-2">
              Contact
            </div>

            <div class="mb-2">
              Privacy
            </div>

          </v-col>

          <v-col
            cols="12"
            md="4"
          >

            <div class="font-weight-bold mb-3">
              Need Help?
            </div>

            <div>
              📞 +91 XXXXX XXXXX
            </div>

            <div>
              ✉ hello@go2andaman.com
            </div>

          </v-col>

        </v-row>

        <v-divider class="my-5"/>

        <div
          class="text-center text-medium-emphasis"
        >
          © {{ currentYear }}
          Go2Andaman.
          All Rights Reserved.
        </div>

      </v-container>

    </v-footer>

    <!-- ========================================= -->
    <!-- BACK TO TOP -->
    <!-- ========================================= -->

    <v-fab
      v-show="showTop"
      icon="mdi-chevron-up"
      location="bottom end"
      color="primary"
      app
      @click="scrollTop"
    />

  </v-app>
</template>

<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
} from "vue";

const loading = ref(false);

const showTop = ref(false);

const currentYear = computed(() => {
  return new Date().getFullYear();
});

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
  window.addEventListener(
    "scroll",
    onScroll
  );
});

onUnmounted(() => {
  window.removeEventListener(
    "scroll",
    onScroll
  );
});
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid rgba(0,0,0,.08);
}

.border-t {
  border-top: 1px solid rgba(0,0,0,.08);
}

.v-main {
  background:#fafafa;
}
</style>