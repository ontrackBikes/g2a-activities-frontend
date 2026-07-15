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
        <div class="g2a-text-18 font-weight-bold">
          {{ product.name }}
        </div>

        <div v-if="product.locations.length > 1">view all locations ></div>
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
    flat
    class="border d-flex flex-column h-100 position-relative"
    :style="{
      opacity: product.out_of_stock ? '0.75' : '1',
      transition: 'all 0.2s ease',
    }"
    @click="handleClick"
    rounded="lg"
  >
    <div class="position-relative overflow-hidden" style="height: 250px">
      <v-img :src="product.thumbnail_url || fallbackImg" height="250" cover>
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-icon icon="mdi-image-outline" size="40" color="grey-lighten-1" />
          </div>
        </template>

        <div
          class="d-flex flex-column ga-1 position-absolute text-left"
          style="top: 12px; left: 12px"
        >
          <v-chip
            v-if="product.featured"
            size="large"
            color="dark"
            variant="flat"
            class="text-white glass px-2"
          >
            Featured
          </v-chip>
        </div>
      </v-img>

      <div
        v-if="product.out_of_stock || !product.available"
        class="position-absolute fill-height w-100 d-flex align-center justify-center"
        style="
          top: 0;
          left: 0;
          background-color: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(2px);
        "
      >
        <v-chip color="error" variant="flat" class="font-weight-bold px-4">
          Unavailable Currently
        </v-chip>
      </div>
    </div>

    <div class="bg-brandColor2 text-white px-2 py-1">
      <div class="g2a-title-sm" v-if="product.next_available_slot && !product.out_of_stock">
        Next Available: {{ formatDate(product.next_available_slot) }}
      </div>
    </div>

    <div class="pa-2">
      <div class="g2a-title-lg">
        {{ product.name }}
      </div>

      <div v-if="locationText" class="d-flex align-center">
        <v-icon
          icon="mdi-map-marker-outline"
          size="12"
          class="text-greyDark"
        />
        <span class="g2a-text-12 text-greyDark">{{ locationText }}</span>
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

      <div v-else class="g2a-title-lg">Product not listed</div>
    </div>
  </v-card>

  <v-dialog v-model="showLocationDialog" max-width="420">
    <v-card rounded="lg">
      <v-card-title> Choose Location </v-card-title>

      <v-divider />

      <v-list>
        <v-list-item
          v-for="location in product.locations"
          :key="location.slug"
          @click="selectLocation(location)"
        >
          <template #prepend>
            <v-icon color="brandColor"> mdi-map-marker </v-icon>
          </template>

          <v-list-item-title>
            {{ location.name }}
          </v-list-item-title>
          <v-list-item-subtitle v-if="location.available">
            Starts @{{ location.starting_price }}
          </v-list-item-subtitle>
          <v-list-item-subtitle v-else>
            <div class="text-error">Out of Stock</div>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
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
