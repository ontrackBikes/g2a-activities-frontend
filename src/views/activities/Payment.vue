<template>
  <v-container class="py-10">

    <v-card
      rounded="xl"
      elevation="0"
      variant="outlined"
      class="pa-8"
    >
      <div class="text-center">

        <v-avatar
          color="success"
          size="90"
        >
          <v-icon
            icon="mdi-check"
            color="white"
            size="52"
          />
        </v-avatar>

        <div class="g2a-title mt-6">
          Booking Confirmed 🎉
        </div>

        <div class="text-medium-emphasis mt-2">
          Your booking has been successfully confirmed.
        </div>

        <v-chip
          color="success"
          class="mt-5"
        >
          Booking ID :
          {{ booking.booking_number }}
        </v-chip>

      </div>

      <v-divider class="my-8" />

      <v-row>

        <!-- LEFT -->

        <v-col
          cols="12"
          md="8"
        >

          <div class="g2a-subtitle mb-5">
            Booking Details
          </div>

          <v-list lines="two">

            <v-list-item>
              <template #prepend>
                <v-icon icon="mdi-map" />
              </template>

              <v-list-item-title>
                {{ booking.product_name }}
              </v-list-item-title>

              <v-list-item-subtitle>
                Activity
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template #prepend>
                <v-icon icon="mdi-calendar" />
              </template>

              <v-list-item-title>
                {{ booking.travel_date }}
              </v-list-item-title>

              <v-list-item-subtitle>
                Travel Date
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item
              v-if="booking.slot_name"
            >
              <template #prepend>
                <v-icon icon="mdi-clock-outline" />
              </template>

              <v-list-item-title>
                {{ booking.slot_name }}
              </v-list-item-title>

              <v-list-item-subtitle>
                Slot
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template #prepend>
                <v-icon icon="mdi-account-group" />
              </template>

              <v-list-item-title>
                {{ booking.guests }}
              </v-list-item-title>

              <v-list-item-subtitle>
                Guests
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template #prepend>
                <v-icon icon="mdi-map-marker" />
              </template>

              <v-list-item-title>
                {{ booking.location }}
              </v-list-item-title>

              <v-list-item-subtitle>
                Location
              </v-list-item-subtitle>
            </v-list-item>

          </v-list>

        </v-col>

        <!-- RIGHT -->

        <v-col
          cols="12"
          md="4"
        >

          <v-card
            variant="tonal"
            rounded="xl"
          >

            <v-card-text>

              <div class="g2a-subtitle mb-4">
                Payment Summary
              </div>

              <div
                class="d-flex justify-space-between mb-2"
              >
                <span>Total Paid</span>

                <strong>
                  ₹{{ booking.amount }}
                </strong>
              </div>

              <div
                class="d-flex justify-space-between"
              >
                <span>Status</span>

                <v-chip
                  color="success"
                  size="small"
                >
                  Paid
                </v-chip>
              </div>

            </v-card-text>

          </v-card>

          <v-btn
            block
            color="primary"
            class="mt-6"
            prepend-icon="mdi-download"
          >
            Download Voucher
          </v-btn>

          <v-btn
            block
            variant="outlined"
            class="mt-3"
            prepend-icon="mdi-home"
            @click="$router.push('/')"
          >
            Explore More Activities
          </v-btn>

        </v-col>

      </v-row>

    </v-card>

  </v-container>
</template>

<script setup>
import { ref } from "vue";

/*
Later replace this with

GET /v1/orders/:bookingNumber

*/

const booking = ref({
  booking_number: "G2A24000152",
  product_name: "Discover Scuba Diving",
  location: "Havelock Island",
  travel_date: "18 July 2026",
  slot_name: "10:00 AM",
  guests: 2,
  amount: 7000,
});
</script>