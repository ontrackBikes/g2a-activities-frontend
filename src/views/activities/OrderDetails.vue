<template>
  <v-container class="g2a-container-width py-8 mx-auto">
    <div v-if="loading" class="text-center py-10">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <v-alert v-else-if="error" type="error" variant="tonal">
      {{ error }}
    </v-alert>

    <template v-else-if="order">
      <v-row>
        <v-col cols="12" lg="7">
          <!-- Product -->
          <v-card rounded="lg" variant="outlined" class="">
            <v-container>
              <div class="d-flex">
                <v-img
                  :src="item.thumbnail_url"
                  width="140"
                  height="110"
                  cover
                  class="rounded-lg mr-4"
                />

                <div>
                  <div class="g2a-title-xl">{{ item.product_name }}</div>
                  <div class="g2a-text-14 text-greyDark mt-1">
                    {{ item.location_name }}
                  </div>

                  <div class="g2a-title-2xl-2">
                    <span class="data-label">Order ID:</span>
                    <span class="g2a-text-bold ml-1">{{ order.order_id }}</span>
                  </div>

                  <div class="mt-1">
                    <v-chip size="large" color="orange" variant="tonal">
                      {{ order.order_status }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </v-container>
          </v-card>

          <!-- Booking Details -->
          <v-card class="mt-5" rounded="lg" variant="outlined">
            <v-container>
              <div class="g2a-heading-sm mb-1">Booking Details</div>
              <v-divider class="mb-2" />

              <div
                v-if="bookingData.guests"
                class="d-flex justify-space-between py-2"
              >
                <span class="data-label">Guests</span>
                <strong class="g2a-text-bold">{{ bookingData.guests }}</strong>
              </div>

              <div
                v-if="bookingData.travel_date"
                class="d-flex justify-space-between py-2"
              >
                <span class="data-label">Travel Date</span>
                <strong class="g2a-text-bold">{{
                  formatDate(bookingData.travel_date)
                }}</strong>
              </div>

              <div
                v-if="bookingData.selected_slot"
                class="d-flex justify-space-between py-2"
              >
                <span class="data-label">Time Slot</span>
                <strong class="g2a-text-bold">
                  {{ bookingData.selected_slot.name }}
                  ({{ formatTime(bookingData.selected_slot.start_time) }} -
                  {{ formatTime(bookingData.selected_slot.end_time) }})
                </strong>
              </div>

              <div
                v-if="bookingData.pickup_date"
                class="d-flex justify-space-between py-2"
              >
                <span class="data-label">Pickup Date</span>
                <strong class="g2a-text-bold">{{
                  formatDate(bookingData.pickup_date)
                }}</strong>
              </div>

              <div
                v-if="bookingData.pickup_time"
                class="d-flex justify-space-between py-2"
              >
                <span class="data-label">Pickup Time</span>
                <strong class="g2a-text-bold">{{
                  formatTime(bookingData.pickup_time)
                }}</strong>
              </div>

              <div
                v-if="bookingData.drop_time"
                class="d-flex justify-space-between py-2"
              >
                <span class="data-label">Drop Time</span>
                <strong class="g2a-text-bold">{{
                  formatTime(bookingData.drop_time)
                }}</strong>
              </div>

              <div
                v-if="bookingData.return_date"
                class="d-flex justify-space-between py-2"
              >
                <span class="data-label">Return Date</span>
                <strong class="g2a-text-bold">{{
                  formatDate(bookingData.return_date)
                }}</strong>
              </div>

              <div
                v-if="bookingData.rental_days"
                class="d-flex justify-space-between py-2"
              >
                <span class="data-label">Rental Days</span>
                <strong class="g2a-text-bold">{{
                  bookingData.rental_days
                }}</strong>
              </div>
            </v-container>
          </v-card>

          <!-- Customer -->
          <v-card
            v-if="sectionEnabled('customer_details')"
            class="mt-5"
            rounded="lg"
            variant="outlined"
          >
            <v-container>
              <div class="g2a-title-4 mb-1">Customer</div>
              <v-divider class="mb-2" />

              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Name</span>
                <strong class="g2a-text-bold">
                  {{ order.customer_details.first_name }}
                  {{ order.customer_details.last_name }}
                </strong>
              </div>

              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Mobile</span>
                <strong class="g2a-text-bold">{{
                  order.customer_details.phone
                }}</strong>
              </div>

              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Email</span>
                <strong class="g2a-text-bold">{{
                  order.customer_details.email
                }}</strong>
              </div>

              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Country</span>
                <strong class="g2a-text-bold">{{
                  order.customer_details.country
                }}</strong>
              </div>
            </v-container>
          </v-card>

          <!-- Rental Details -->
          <v-card
            v-if="sectionEnabled('rental_details')"
            class="mt-5"
            rounded="lg"
            variant="outlined"
          >
            <v-container>
              <div class="g2a-title-4 mb-1">Rental Details</div>
              <v-divider class="mb-2" />

              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Pickup Location</span>
                <strong class="g2a-text-bold">{{
                  bikeDelivery.pickup_location
                }}</strong>
              </div>

              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Return / Drop Location</span>
                <strong class="g2a-text-bold">{{
                  bikeDelivery.drop_location
                }}</strong>
              </div>

              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Pickup Time</span>
                <strong class="g2a-text-bold">{{
                  bikeDelivery.pickup_time
                }}</strong>
              </div>

              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Return Time</span>
                <strong class="g2a-text-bold">{{
                  bikeDelivery.return_time
                }}</strong>
              </div>
            </v-container>
          </v-card>

          <!-- Medical Declaration -->
          <v-card
            v-if="sectionEnabled('medical_declaration')"
            class="mt-5"
            rounded="lg"
            variant="outlined"
          >
            <v-container>
              <div class="g2a-title-4 mb-1">Medical Declaration</div>
              <v-divider class="mb-2" />

              <div v-if="declaredConditions.length">
                <div
                  v-for="condition in declaredConditions"
                  :key="condition"
                  class="d-flex justify-space-between py-2"
                >
                  <span class="data-label">{{ pretty(condition) }}</span>
                  <strong class="g2a-text-bold">Yes</strong>
                </div>

                <div v-if="medical.other_details" class="py-2">
                  <span class="data-label">Additional Details</span>
                  <div class="g2a-text-bold mt-1">
                    {{ medical.other_details }}
                  </div>
                </div>
              </div>

              <div v-else class="g2a-title-2xl-2-light text-greyDark">
                No health conditions declared.
              </div>
            </v-container>
          </v-card>

          <!-- Participants -->
          <v-card
            v-if="sectionEnabled('participants')"
            class="mt-5"
            rounded="lg"
            variant="outlined"
          >
            <v-container>
              <div class="g2a-title-4 mb-1">Participants</div>
              <v-divider class="mb-2" />

              <v-table>
                <thead>
                  <tr>
                    <th class="data-label">Name</th>
                    <th class="data-label">Age</th>
                    <th class="data-label">Gender</th>
                    <th class="data-label">Nationality</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(p, index) in participants" :key="index">
                    <td class="g2a-text-bold g2a-title-2xl-2">
                      {{ p.first_name }} {{ p.last_name }}
                    </td>
                    <td class="g2a-title-2xl-2">{{ p.age }}</td>
                    <td class="g2a-title-2xl-2">{{ p.gender }}</td>
                    <td class="g2a-title-2xl-2">{{ p.nationality }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-container>
          </v-card>

          <!-- Ferry Seat Selection -->
          <v-card
            v-if="sectionEnabled('ferry_seat_selection')"
            class="mt-5"
            rounded="lg"
            variant="outlined"
          >
            <v-container>
              <div class="g2a-title-4 mb-1">Seat Selection</div>
              <v-divider class="mb-2" />

              <v-table>
                <thead>
                  <tr>
                    <th class="data-label">Name</th>
                    <th class="data-label">Seat Preference</th>
                    <th class="data-label">Seat Number</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(p, index) in participants" :key="index">
                    <td class="g2a-text-bold g2a-title-2xl-2">
                      {{ p.first_name }} {{ p.last_name }}
                    </td>
                    <td class="g2a-title-2xl-2">{{ p.seat_preference }}</td>
                    <td class="g2a-title-2xl-2">{{ p.seat_number }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-container>
          </v-card>
        </v-col>

        <!-- RIGHT -->
        <v-col cols="12" lg="5">
          <v-card rounded="lg" variant="outlined" class="">
            <v-container>
              <div class="g2a-heading-sm mb-1">Payment Summary</div>
              <v-divider class="mb-2" />

              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Subtotal</span>
                <strong class="g2a-text-bold"
                  >₹{{ currency(order.subtotal) }}</strong
                >
              </div>

              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Discount</span>
                <strong class="g2a-text-bold"
                  >₹{{ currency(order.discount) }}</strong
                >
              </div>

              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Tax</span>
                <strong class="g2a-text-bold"
                  >₹{{ currency(order.tax) }}</strong
                >
              </div>

              <v-divider class="my-4" />

              <div class="d-flex justify-space-between align-center">
                <span class="g2a-title-2xl-4">Total</span>
                <div class="g2a-title-4 text-brandColor2">
                  ₹{{ currency(order.grand_total) }}
                </div>
              </div>

              <div v-if="order.payment_status == 'captured'">
                <div class="g2a-title-2xl-2 text-success mt-4">
                  Payment already received for this order
                </div>
                <v-btn
                  flat
                  rounded="lg"
                  block
                  color="brandColor"
                  size="large"
                  class="mt-4"
                  @click="viewOrder"
                >
                  View
                </v-btn>
              </div>

              <v-btn
                v-else
                flat
                rounded="lg"
                block
                color="brandColor"
                size="large"
                class="mt-6"
                :disabled="order.order_status == 'confirmed'"
                :loading="paying"
                @click="payNow"
              >
                Pay Now
              </v-btn>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import apiClient from "@/services/api";
import router from "@/router";

const route = useRoute();

const loading = ref(true);
const paying = ref(false);
const error = ref("");

const order = ref(null);

const item = computed(() => order.value?.items?.[0] || {});

const enabledSections = computed(() => {
  const sections =
    item.value?.quotation?.product?.bookingTemplate?.booking_page_schema
      ?.sections || [];

  return sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.sort_order - b.sort_order);
});

const sectionEnabled = (name) =>
  enabledSections.value.some((s) => s.section === name);

const bookingData = computed(() => item.value.booking_data || {});

const formatDate = (d) => new Date(d).toLocaleDateString("en-IN");

const formatTime = (t) => {
  if (!t) return t;
  const [h, m] = t.split(":");
  const hour = +h % 12 || 12;
  return `${hour}:${m} ${+h < 12 ? "AM" : "PM"}`;
};

const payload = computed(() => item.value.booking_payload || {});

const bikeDelivery = computed(() => payload.value.bike_delivery || {});

const medical = computed(() => payload.value.medical || {});

const declaredConditions = computed(() =>
  Object.entries(medical.value)
    .filter(([key, value]) => key !== "other_details" && value === true)
    .map(([key]) => key),
);

const participants = computed(() => item.value.participants || []);

const loadOrder = async () => {
  try {
    loading.value = true;
    const { data } = await apiClient.get(`/v1/orders/${route.params.order_id}`);
    order.value = data.data;
  } catch (e) {
    console.error(e);
    error.value = "Unable to load order.";
  } finally {
    loading.value = false;
  }
};

const payNow = async () => {
  paying.value = true;

  try {
    const { data } = await apiClient.post(
      `/v1/orders/${route.params.order_id}/create-payment`,
    );

    const payment = data.data;

    const options = {
      key: payment.key,
      amount: payment.amount,
      currency: payment.currency,
      order_id: payment.razorpay_order_id,
      name: "Go2Andaman",
      description: "Activity Booking",
      prefill: payment.customer,
      handler() {
        router.push({
          name: "PaymentStatus",
          params: { order_id: route.params.order_id },
        });
      },
      modal: {
        ondismiss() {
          router.push({
            name: "PaymentStatus",
            params: { order_id: route.params.order_id },
          });
        },
      },
      theme: { color: "#4C42D8" },
    };

    new window.Razorpay(options).open();
  } finally {
    paying.value = false;
  }
};

const currency = (v) => Number(v || 0).toLocaleString("en-IN");

const pretty = (key) =>
  key.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

const viewOrder = () => {
  router.replace({
    name: "Order",
    params: { order_id: route.params.order_id },
  });
};

onMounted(loadOrder);
</script>
