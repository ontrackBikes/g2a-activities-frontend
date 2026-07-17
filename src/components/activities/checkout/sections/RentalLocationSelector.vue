<template>
  <v-card rounded="xl">
    <v-toolbar flat density="comfortable">
      <v-toolbar-title class="g2a-title-lg">
        Select {{ mode === "pickup" ? "Pickup" : "Drop" }} Point
      </v-toolbar-title>

      <v-spacer />

      <v-btn
        icon="mdi-close"
        variant="text"
        @click="$emit('close')"
      />
    </v-toolbar>

    <v-divider />

    <v-card-text class="pa-4">
      <v-row>
        <v-col
          v-for="item in locations"
          :key="item.id"
          cols="12"
        >
          <v-card
            rounded="xl"
            flat
            class="location-card"
            :class="{
              'border': selected?.id === item.id
            }"
            @click="selectLocation(item)"
          >
            <v-row no-gutters>
              <!-- Image -->
              <v-col
                cols="4"
                md="4"
              >
                <v-img
                  :src="item.image"
                  height="180"
                  cover
                  class="fill-height"
                >
                  <template #error>
                    <div
                      class="d-flex align-center justify-center fill-height bg-grey-lighten-3"
                    >
                      <v-icon size="40">
                        mdi-image-off
                      </v-icon>
                    </div>
                  </template>

                  <v-chip
                    class="ma-3"
                    color="brandColor"
                    variant="flat"
                    size="small"
                  >
                    {{ item.type }}
                  </v-chip>
                </v-img>
              </v-col>

              <!-- Details -->
              <v-col
                cols="8"
                md="8"
              >
                <v-container class="">
                  <div class="d-flex justify-space-between align-start">
                    <div>
                      <div class="g2a-title-lg">
                        {{ item.name }}
                      </div>

                      <div class="text-medium-emphasis mt-2">
                        {{ item.address }}
                      </div>
                    </div>

                    
                  </div>

                  <v-spacer />

                  <div class="d-flex justify-space-between align-center mt-4">
                    <a
                      :href="item.gmapLink"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="g2a-link"
                      @click.stop
                    >
                      <v-icon
                        size="18"
                        class="mr-1"
                      >
                        mdi-open-in-new
                      </v-icon>

                      Google Map
                    </a>

                    <v-btn
                      v-if="selected?.id !== item.id"
                      color="brandColor2"
                      variant="tonal"
                      rounded="pill"
                      @click.stop="selectLocation(item)"
                    >
                      Select
                    </v-btn>

                    <v-chip
                      v-else
                      color="success"
                      variant="flat"
                    >
                      Selected
                    </v-chip>
                  </div>
                </v-container>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script setup>
import { computed } from "vue";

const props = defineProps({
  mode: {
    type: String,
    default: "pickup",
    validator: (value) => ["pickup", "drop"].includes(value),
  },

  selected: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["selected", "close"]);

/*
|--------------------------------------------------------------------------
| Rental Locations
|--------------------------------------------------------------------------
|
| TODO:
| Move this into src/constants/rentalLocations.js or load from the backend
| once an endpoint is available.
|
*/

const LOCATION_POINTS = Object.freeze([
  {
    id: 1,
    name: "Veer Savarkar International Airport",
    type: "Airport",
    image:
      "https://go2andaman.com/wp-content/uploads/2025/10/AIRPORT-IMG2025-2-e1766661382781.jpg",
    address:
      "Veer Savarkar International Airport, Lamba Line, Port Blair, Andaman & Nicobar Islands",
    gmapLink: "https://maps.app.goo.gl/FoV9GgE1QmMN9pXe6",
    pickup: true,
    drop: true,
  },

  {
    id: 2,
    name: "Phoenix Bay Jetty",
    type: "Jetty",
    image:
      "https://i0.wp.com/go2andaman.com/wp-content/uploads/2025/08/phoenix2-e1746520985255-831x468-1.webp?w=831&ssl=1",
    address:
      "Phoenix Bay Jetty, Sri Vijaya Puram, Andaman & Nicobar Islands 744101",
    gmapLink: "https://maps.app.goo.gl/1884nALfbRWtkWRm8",
    pickup: true,
    drop: true,
  },

  {
    id: 3,
    name: "Haddo Jetty",
    type: "Jetty",
    image:
      "https://i0.wp.com/go2andaman.com/wp-content/uploads/2025/08/entrance-e1746516860901.webp?w=1360&ssl=1",
    address:
      "Haddo Jetty, Chatham, Haddo, Sri Vijaya Puram, Andaman & Nicobar Islands 744102",
    gmapLink: "https://maps.app.goo.gl/NFeKkcuyeS33BiN1A",
    pickup: true,
    drop: true,
  },
]);

/*
|--------------------------------------------------------------------------
| Computed
|--------------------------------------------------------------------------
*/

const locations = computed(() => {
  return LOCATION_POINTS.filter((location) =>
    props.mode === "pickup" ? location.pickup : location.drop,
  );
});

/*
|--------------------------------------------------------------------------
| Methods
|--------------------------------------------------------------------------
*/

const selectLocation = (location) => {
  emit("selected", location);
};

const close = () => {
  emit("close");
};
</script>