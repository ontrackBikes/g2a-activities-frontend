<template>
  <v-card
    v-if="mini"
    flat
    rounded="lg"
    :style="{
      opacity: product.out_of_stock ? '0.75' : '1',
      transition: 'all 0.2s ease',
    }"
    @click="handleClick"
  >
    <v-row>
      <v-col cols="2">
        <v-img
          :src="product.thumbnail_url || fallbackImg"
          height="100%"
          cover
        ></v-img>
      </v-col>
      <v-col cols="10" class="py-4">
        <div class="g2a-title-lg ">
          {{ product.name }}
        </div>

        <div class="text-caption" v-if="product.locations.length > 1">view all locations ></div>
        <div v-else>
          <span
            v-if="product.next_available_slot && !product.out_of_stock"
            class="g2a-text-15 text-green-darken-3 font-weight-medium"
          >
            Next Available: {{ formatDate(product.next_available_slot) }}
          </span>
          <div v-if="product.out_of_stock || !product.available">
            <div class="text-error">Out of Stock</div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>
  <v-card
    v-else
    :ripple="false"
    flat
    class="border h-100"
    :style="{
      opacity: product.out_of_stock ? '0.75' : '1',
      transition: 'all 0.2s ease',
    }"
    @click="handleClick"
    rounded="lg"
  >
    <div class="overflow-hidden" style="height: 250px">
      <v-img :src="product.thumbnail_url || fallbackImg" height="250" cover>
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-icon icon="mdi-image-outline" size="40" color="grey-lighten-1" />
          </div>
        </template>

        <div
          v-if="product.tags?.length > 0"
          class="position-absolute text-left"
          style="top: 12px; left: 8px"
        >
          <v-chip
            v-for="tag in product.tags"
            :key="tag.slug"
            size="small"
            class="glass text-white px-2 ma-1"
          >
            <v-icon
              v-if="tagIcons[tag.name]"
              :icon="tagIcons[tag.name]"
              size="14"
              start
            />

            <span class="g2a-title-sm ">{{ tag.name }}</span>
          </v-chip>
        </div>
      </v-img>

      <div
        v-if="product.out_of_stock || !product.available"
        class="position-absolute fill-height w-100 d-flex align-center justify-center"
        style="
          top: 0;
          left: 0;
          backdrop-filter: blur(0.5px);
          -webkit-backdrop-filter: blur(5px)'
        "
      >
        <v-chip color="error" variant="flat" class=" px-4">
          Unavailable Currently
        </v-chip>
      </div>
    </div>

    <div class="brand-gradient px-2 py-1">
      <div
        class="g2a-title-sm"
        v-if="product.next_available_slot && !product.out_of_stock"
      >
        Next Available:
        <strong>{{ formatDate(product.next_available_slot) }}</strong>
      </div>
    </div>

    <div class="pa-2">
      <div class="g2a-title-lg">
        {{ product.name }}
      </div>

      <div v-if="locationText" class="d-flex align-center">
        <v-icon icon="mdi-map-marker-outline" size="12" class="text-greyDark" />
        <span class=" text-greyDark">{{ locationText }}</span>
      </div>

      <div v-if="product.starting_price" class="text-brandColor2">
        <div class="d-flex align-baseline ga-1">
          <span class="g2a-title-lg">
            ₹{{ formatPrice(product.starting_price) }}
          </span>
          <div class="g2a-title-sm">
            {{ product.price_type === "SLOT" ? "onwards" : "" }}
          </div>
        </div>
      </div>

      <!-- <div v-else class="g2a-title-lg">Product not listed</div> -->
    </div>
  </v-card>

  <v-dialog
    v-model="showLocationDialog"
    max-width="420"
    scrim="rgba(15, 23, 42, 0.3)"
    :style="{
      backdropFilter: 'blur(2px)',
      webkitBackdropFilter: 'blur(2px)',
    }"
  >
    <v-card rounded="lg" elevation="6">
      <v-container>
        <div class="d-flex justify-space-between align-center">
          <div>
            <div class="g2a-title-xl">Choose Location</div>
            <div>Select the location you'd like to continue with.</div>
          </div>
          <v-btn
            size="small"
            flat
            icon
            variant="icon"
            @click="showLocationDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-container>

      <v-divider />

      <v-container>
        <v-card
          v-for="location in product.locations"
          :key="location.slug"
          rounded="lg"
          flat
          class="pa-2 mb-4"
          :class="selectedLocation?.slug === location.slug ? 'border' : ''"
          @click="selectLocation(location)"
        >
          <div class="d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <div>
                <v-avatar size="38" color="brandColor2" variant="tonal">
                  <v-icon size="20">mdi-map-marker</v-icon>
                </v-avatar>
              </div>

              <div class="ml-2">
                <div class="g2a-title-md">
                  {{ location.name }}
                </div>
                <div class="g2a-title-xs" v-if="location.available">
                  Starts @{{ location.starting_price }}
                </div>
                <div v-else>
                  <div class="g2a-title-md text-error">Out of Stock</div>
                </div>
              </div>
            </div>
            <v-icon size="18" color="grey"> mdi-chevron-right </v-icon>
          </div>
        </v-card>
      </v-container>

      <v-divider />
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref } from "vue";
const showLocationDialog = ref(false);

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  mini: {
    type: Boolean,
    required: false,
  },
});

const emit = defineEmits(["click"]);

const tagIcons = {
  Premium: "mdi-crown",
  "Best Seller": "mdi-fire",
  Trending: "mdi-trending-up",
  New: "mdi-star-circle",
  Popular: "mdi-thumb-up",
  Recommended: "mdi-thumb-up-outline",
  Featured: "mdi-star",
  Exclusive: "mdi-diamond-stone",
  Limited: "mdi-clock-alert-outline",
};

const fallbackImg =
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600";

// Standardizing Localized Array Mappings cleanly
const locationText = computed(() => {
  const locations = props.product.locations || [];
  if (!locations.length) return null;
  if (locations.length === 1) return locations[0].name;
  if (locations.length === 2) return locations.map((l) => l.name).join(", ");
  return `${locations[0].name} & ${locations.length - 1} more locations`;
});

function formatPrice(val) {
  if (!val && val !== 0) return "—";
  return Number(val).toLocaleString("en-IN");
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const handleClick = () => {
  if (props.product.out_of_stock) {
    console.log("Product out of stock");
    return;
  }

  const locations = props.product.locations || [];

  if (locations.length <= 1) {
    emit("click", {
      product: props.product,
      location: locations[0] || null,
    });

    return;
  }

  showLocationDialog.value = true;
};

const selectLocation = (location) => {
  showLocationDialog.value = false;

  emit("click", {
    product: props.product,
    location,
  });
};
</script>

<style scoped></style>
