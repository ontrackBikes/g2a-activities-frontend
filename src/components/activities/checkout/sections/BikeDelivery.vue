<template>
  <v-card rounded="xl" variant="outlined">

    <v-card-title>
      Bike Delivery
    </v-card-title>

    <v-divider/>

    <v-card-text>

      <v-row>

        <v-col cols="12">
          <v-text-field
            v-model="bike.pickup_location"
            label="Pickup Location"
            prepend-inner-icon="mdi-map-marker"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="bike.drop_location"
            label="Drop Location"
            prepend-inner-icon="mdi-map-marker-radius"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="bike.pickup_time"
            type="time"
            label="Pickup Time"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="bike.return_time"
            type="time"
            label="Return Time"
            variant="outlined"
          />
        </v-col>

      </v-row>

    </v-card-text>

  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { bookingStore } from "@/store/booking";

const booking=useBookingStore();

const bike=computed({
    get:()=>booking.form.bike_delivery,
    set:v=>booking.form.bike_delivery=v
});
</script>