<template>
  <v-container width="800" class="g2a-container-width py-8 mx-auto">
    <div v-if="loading" class="text-center py-10">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <v-alert v-else-if="error" type="error" variant="tonal">
      {{ error }}
    </v-alert>

    <div v-else-if="order">

   
      <!-- Product -->
      <v-card rounded="lg" flat>
        <v-container>
          <v-row>
            <v-col cols="3">
              <v-img
                :src="item.thumbnail_url"
                width="150"
                height="120"
                cover
                class="rounded-lg mr-4"
              />
            </v-col>

            <v-col cols="9">
              <div class="g2a-title-3">{{ item.product_name }}</div>
              <div class="g2a-text-14 text-greyDark mt-1">
                {{ item.location_name }}
              </div>

              <div class="mt-3 g2a-subtitle-2">
                <span class="data-label">Booking ID:</span>
                <span class="g2a-text-bold ml-1">{{ order.order_id }}</span>
              </div>

              <div class="mt-2">
                <v-chip
                  v-if="order.payment_status === 'paid'"
                  color="success"
                  variant="tonal"
                  size="small"
                >
                  Paid
                </v-chip>

                <v-chip v-else color="warning" variant="tonal" size="small">
                  {{ order.payment_status }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card>

      <!-- Booking Details -->
      <g2-a-expansion-panel class="my-2" title="Booking Details">
        <v-container>
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
            <strong class="g2a-text-bold">{{ bookingData.rental_days }}</strong>
          </div>
        </v-container>
      </g2-a-expansion-panel>

      <!-- Customer -->
      <g2-a-expansion-panel class="my-2" title="Customer Info">
        <v-container>
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
      </g2-a-expansion-panel>

      <!-- Participants -->
      <g2-a-expansion-panel class="my-2"
        v-if="participants.length"
        title="Participants Info"
      >
        <v-container>
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
              <tr v-for="(participant, index) in participants" :key="index">
                <td class="g2a-text-bold g2a-subtitle-2">
                  {{ participant.first_name }} {{ participant.last_name }}
                </td>
                <td class="g2a-subtitle-2">{{ participant.age }}</td>
                <td class="g2a-subtitle-2">{{ participant.gender }}</td>
                <td class="g2a-subtitle-2">
                  {{ participant.nationality }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-container>
      </g2-a-expansion-panel>

      <g2-a-expansion-panel class="my-2" title="Payment Summary">
        <v-container>
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
            <strong class="g2a-text-bold">₹{{ currency(order.tax) }}</strong>
          </div>

          <v-divider class="my-4" />

          <div class="d-flex justify-space-between align-center">
            <span class="g2a-subtitle-4">Total Paid</span>
            <div class="g2a-title-4 text-brandColor2">
              ₹{{ currency(order.grand_total) }}
            </div>
          </div>

          <v-alert class="mt-6" type="success" variant="tonal">
            Your booking has been confirmed.
          </v-alert>
        </v-container>
      </g2-a-expansion-panel>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import apiClient from "@/services/api";
import G2AExpansionPanel from "@/components/common/G2AExpansionPanel.vue";

const route = useRoute();

const loading = ref(true);
const error = ref("");
const order = ref(null);

const item = computed(() => order.value?.items?.[0] || {});
const participants = computed(() => item.value.participants || []);

const loadOrder = async () => {
  try {
    loading.value = true;
    const { data } = await apiClient.get(`/v1/orders/${route.params.order_id}`);
    order.value = data.data;
  } catch (e) {
    console.error(e);
    error.value = "Unable to load booking.";
  } finally {
    loading.value = false;
  }
};

const currency = (value) => Number(value || 0).toLocaleString("en-IN");

const bookingData = computed(() => item.value.booking_data || {});

const formatDate = (d) => new Date(d).toLocaleDateString("en-IN");

const formatTime = (t) => {
  if (!t) return t;
  const [h, m] = t.split(":");
  const hour = +h % 12 || 12;
  return `${hour}:${m} ${+h < 12 ? "AM" : "PM"}`;
};

onMounted(loadOrder);
</script>
