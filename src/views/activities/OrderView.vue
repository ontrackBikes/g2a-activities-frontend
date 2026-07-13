<template>
  <v-container width="800" class="g2a-container-width py-8 mx-auto">
    <div v-if="loading" class="text-center py-10">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <v-alert v-else-if="error" type="error" variant="tonal">
      {{ error }}
    </v-alert>

    <div v-else-if="order">
      <v-alert
        class="mb-4"
        rounded="lg"
        v-if="order.order_status == 'confirmed'"
        type="success"
        variant="tonal"
      >
        Your booking has been confirmed.
      </v-alert>

      <template v-for="(item, index) in items" :key="index">
        <!-- ================= Product ================= -->
        <v-card rounded="lg" flat class="mb-4">
          <v-row no-gutters>
            <v-col cols="12" sm="3">
              <v-img :src="item.thumbnail_url" height="180" cover />
            </v-col>

            <v-col cols="12" sm="9" class="pa-6">
              <div class="g2a-title-4">
                {{ item.product_name }}
              </div>

              <div class="text-medium-emphasis mt-1">
                {{ item.location_name }}
              </div>

              <div
                v-if="item.booking_data.selected_slot?.name"
                class="text-brandColor2"
              >
                {{ item.booking_data.selected_slot.name }}
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- ================= Booking Details ================= -->

        <g2-a-expansion-panel
          :model-value="true"
          class="mb-4"
          title="Booking Details"
        >
          <v-container>
            <div class="d-flex justify-space-between py-2">
              <span class="data-label">Booking ID</span>
              <strong>{{ order.order_id }}</strong>
            </div>

            <div
              v-if="item.booking_data.guests"
              class="d-flex justify-space-between py-2"
            >
              <span class="data-label">Guests</span>
              <strong>{{ item.booking_data.guests }}</strong>
            </div>

            <div
              v-if="item.booking_data.selected_slot"
              class="d-flex justify-space-between py-2"
            >
              <span class="data-label">
                {{
                  item.booking_data.booking_mode === "date_range"
                    ? "Vehicle"
                    : "Time Slot"
                }}
              </span>

              <strong>
                {{ item.booking_data.selected_slot.name }}
              </strong>
            </div>

            <!-- Rental Booking -->

            <template v-if="item.booking_data.booking_mode === 'date_range'">
              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Pickup Date</span>
                <strong>
                  {{ formatDate(item.booking_data.pickup_date) }}
                </strong>
              </div>

              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Pickup Time</span>
                <strong>
                  {{ formatTime(item.booking_data.pickup_time) }}
                </strong>
              </div>

              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Return Date</span>
                <strong>
                  {{ formatDate(item.booking_data.return_date) }}
                </strong>
              </div>

              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Drop Time</span>
                <strong>
                  {{ formatTime(item.booking_data.drop_time) }}
                </strong>
              </div>

              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Rental Days</span>
                <strong>
                  {{ item.booking_data.rental_days }}
                </strong>
              </div>
            </template>

            <!-- Activity Booking -->

            <template v-else>
              <div
                v-if="item.booking_data.travel_date"
                class="d-flex justify-space-between py-2"
              >
                <span class="data-label">Travel Date</span>

                <strong>
                  {{ formatDate(item.booking_data.travel_date) }}
                </strong>
              </div>
            </template>
          </v-container>
        </g2-a-expansion-panel>

        <!-- ================= Participants ================= -->

        <g2-a-expansion-panel
          v-if="item.participants?.length"
          class="mb-4"
          title="Participants"
        >
          <v-container>
            <v-table density="comfortable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Nationality</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(participant, pIndex) in item.participants"
                  :key="pIndex"
                >
                  <td>
                    {{ participant.first_name }}
                    {{ participant.last_name }}
                  </td>

                  <td>{{ participant.age }}</td>

                  <td>{{ participant.gender }}</td>

                  <td>{{ participant.nationality }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-container>
        </g2-a-expansion-panel>
      </template>

      <!-- Customer -->
      <g2-a-expansion-panel
        class="my-2"
        title="Customer Info"
        v-if="customer_details"
      >
        <v-container>
          <div class="d-flex justify-space-between py-2">
            <span class="data-label">Name</span>
            <strong class="g2a-text-bold">
              {{ customer_details.first_name }}
              {{ customer_details.last_name }}
            </strong>
          </div>

          <div class="d-flex justify-space-between py-2">
            <span class="data-label">Mobile</span>
            <strong class="g2a-text-bold">{{ customer_details.phone }}</strong>
          </div>

          <div class="d-flex justify-space-between py-2">
            <span class="data-label">Email</span>
            <strong class="g2a-text-bold">{{ customer_details.email }}</strong>
          </div>

          <div class="d-flex justify-space-between py-2">
            <span class="data-label">Country</span>
            <strong class="g2a-text-bold">{{
              customer_details.country
            }}</strong>
          </div>
        </v-container>
      </g2-a-expansion-panel>

      <g2-a-expansion-panel class="my-2" title="Payment Summary">
        <v-container>
          <div class="d-flex justify-space-between py-2">
            <span class="data-label">Subtotal</span>
            <strong>₹{{ currency(order.subtotal) }}</strong>
          </div>

          <div class="d-flex justify-space-between py-2">
            <span class="data-label">Discount</span>
            <strong>₹{{ currency(order.discount) }}</strong>
          </div>

          <div class="d-flex justify-space-between py-2">
            <span class="data-label">Tax</span>
            <strong>₹{{ currency(order.tax) }}</strong>
          </div>

          <v-divider class="my-4" />

          <div class="d-flex justify-space-between align-center">
            <span class="g2a-subtitle-4"> Total Paid </span>

            <div class="g2a-title-4 text-brandColor2">
              ₹{{ currency(order.grand_total) }}
            </div>
          </div>

          <template v-if="order.payments?.length">
            <v-divider class="my-4" />

            <div
              v-for="payment in order.payments"
              :key="payment.payment_id"
              class="mb-4"
            >
              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Payment Status</span>

                <v-chip
                  :color="paymentStatusColor(payment.status)"
                  size="small"
                  variant="flat"
                >
                  {{ payment.status.toUpperCase() }}
                </v-chip>
              </div>

              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Amount</span>

                <strong> ₹{{ currency(payment.amount) }} </strong>
              </div>

              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Payment Date</span>

                <strong>
                  {{ formatDateTime(payment.paid_at || payment.created_at) }}
                </strong>
              </div>

              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Payment ID</span>

                <strong class="text-medium-emphasis">
                  {{ payment.payment_id }}
                </strong>
              </div>
            </div>
          </template>
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

const items = computed(() => order.value?.items ?? []);

const customer_details = computed(() => order.value?.customer_details ?? {});

const payment = computed(() => order.value?.payments?.[0] ?? null);

const loadOrder = async () => {
  try {
    loading.value = true;
    error.value = "";

    const { data } = await apiClient.get(`/v1/orders/${route.params.order_id}`);

    order.value = data.data;
  } catch (err) {
    console.error("[loadOrder]", err);

    error.value = "Unable to load booking.";
  } finally {
    loading.value = false;
  }
};

const currency = (value) => {
  return Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatTime = (time) => {
  if (!time) return "-";

  const [hour, minute] = time.split(":");

  const date = new Date();
  date.setHours(Number(hour));
  date.setMinutes(Number(minute));

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const paymentStatusColor = (status) => {
  switch (status) {
    case "captured":
      return "success";

    case "authorized":
      return "warning";

    case "failed":
      return "error";

    case "refunded":
      return "info";

    case "pending":
      return "warning";

    default:
      return "grey";
  }
};

onMounted(loadOrder);
</script>
