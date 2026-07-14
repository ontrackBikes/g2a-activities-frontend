<template>
  <v-container class="g2a-container-width py-8 mx-auto">
    <div v-if="loading" class="text-center py-16">
      <v-progress-circular indeterminate color="brandColor" size="40" />
    </div>

    <v-alert v-else-if="error" type="error" variant="tonal" rounded="lg">
      {{ error }}
      <div class="mt-2">
        <v-btn size="small" variant="outlined" color="error" @click="loadOrder">
          Try again
        </v-btn>
      </div>
    </v-alert>

    <v-alert v-else-if="!order" type="warning" variant="tonal" rounded="lg">
      Booking not found.
    </v-alert>

    <div v-else>
      <!-- ================= Hero ================= -->
      <v-card rounded="xl" variant="outlined" class="custom-border mb-6">
        <v-container>
          <div class="d-flex align-center flex-wrap ga-4">
            <v-avatar :color="statusAlert.type" variant="tonal" size="56">
              <v-icon size="28" :color="statusAlert.type">{{
                statusAlert.icon
              }}</v-icon>
            </v-avatar>

            <div class="flex-grow-1">
              <div class="g2a-title-3">{{ statusAlert.heading }}</div>
              <div class="g2a-subtitle-2 text-greyDark mt-1">
                {{ statusAlert.text }}
              </div>
            </div>

            <div class="text-left text-sm-right">
              <div class="g2a-text-caption text-greyDark">Order ID</div>
              <div class="d-flex align-center">
                <span class="g2a-subtitle-1 g2a-text-bold-600">{{
                  order.order_id
                }}</span>
                <v-btn
                  :icon="copied ? 'mdi-check' : 'mdi-content-copy'"
                  :color="copied ? 'success' : undefined"
                  size="x-small"
                  variant="text"
                  class="ml-1"
                  aria-label="Copy order ID"
                  @click="copyOrderId"
                />
              </div>
            </div>
          </div>

          <v-divider class="my-4" />

          <div class="d-flex flex-wrap ga-6">
            <div class="d-flex align-center">
              <v-icon size="16" color="brandColor2" class="mr-1"
                >mdi-calendar-outline</v-icon
              >
              <span class="g2a-subtitle-2 text-greyDark"
                >Placed {{ formatDate(order.created_at) }}</span
              >
            </div>
            <div class="d-flex align-center">
              <v-icon size="16" color="brandColor2" class="mr-1"
                >mdi-package-variant-closed</v-icon
              >
              <span class="g2a-subtitle-2 text-greyDark">
                {{ items.length }} {{ items.length === 1 ? "item" : "items" }}
              </span>
            </div>
            <div class="d-flex align-center">
              <v-icon size="16" color="brandColor2" class="mr-1"
                >mdi-cash-check</v-icon
              >
              <span class="g2a-subtitle-2 text-greyDark"
                >{{ currency(order.grand_total) }} paid</span
              >
            </div>
          </div>
        </v-container>
      </v-card>

      <template v-for="(item, index) in items" :key="index">
        <!-- ================= Product ================= -->
        <v-card rounded="lg" variant="outlined" class="custom-border mb-4">
          <v-row no-gutters>
            <v-col cols="12" sm="3">
              <v-img
                :src="item.thumbnail_url"
                :alt="item.product_name"
                height="180"
                cover
                class="rounded-t-lg rounded-sm-s-lg rounded-sm-t-0"
              >
                <template #error>
                  <div
                    class="d-flex align-center justify-center fill-height bg-grey-lighten-3"
                  >
                    <v-icon color="grey" size="24"
                      >mdi-image-off-outline</v-icon
                    >
                  </div>
                </template>
              </v-img>
            </v-col>

            <v-col cols="12" sm="9" class="pa-6">
              <div class="g2a-title-4">{{ item.product_name }}</div>
              <div
                class="text-greyDark g2a-subtitle-2 mt-1 d-flex align-center"
              >
                <v-icon size="14" class="mr-1">mdi-map-marker-outline</v-icon>
                {{ item.location_name }}
              </div>
              <v-chip
                v-if="bookingOf(item).selected_slot?.name"
                class="mt-3"
                size="small"
                color="brandColor2"
                variant="tonal"
              >
                {{ bookingOf(item).selected_slot.name }}
              </v-chip>
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
              v-if="bookingOf(item).guests"
              class="d-flex justify-space-between py-2"
            >
              <span class="data-label">Guests</span>
              <strong>{{ bookingOf(item).guests }}</strong>
            </div>

            <div
              v-if="bookingOf(item).selected_slot"
              class="d-flex justify-space-between py-2"
            >
              <span class="data-label">
                {{
                  bookingOf(item).booking_mode === "date_range"
                    ? "Vehicle"
                    : "Time Slot"
                }}
              </span>
              <strong>{{ bookingOf(item).selected_slot.name }}</strong>
            </div>

            <!-- Rental Booking -->
            <template v-if="bookingOf(item).booking_mode === 'date_range'">
              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Pickup Date</span>
                <strong>{{ formatDate(bookingOf(item).pickup_date) }}</strong>
              </div>
              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Pickup Time</span>
                <strong>{{ formatTime(bookingOf(item).pickup_time) }}</strong>
              </div>
              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Return Date</span>
                <strong>{{ formatDate(bookingOf(item).return_date) }}</strong>
              </div>
              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Drop Time</span>
                <strong>{{ formatTime(bookingOf(item).drop_time) }}</strong>
              </div>
              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Rental Days</span>
                <strong>{{ bookingOf(item).rental_days }}</strong>
              </div>
            </template>

            <!-- Activity Booking -->
            <template v-else-if="bookingOf(item).travel_date">
              <div class="d-flex justify-space-between py-2">
                <span class="data-label">Travel Date</span>
                <strong>{{ formatDate(bookingOf(item).travel_date) }}</strong>
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
            <v-table density="comfortable" class="no-scrollbar">
              <thead>
                <tr>
                  <th class="data-label">Name</th>
                  <th class="data-label">Age</th>
                  <th class="data-label">Gender</th>
                  <th class="data-label">Nationality</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(p, pIndex) in item.participants"
                  :key="p.id ?? pIndex"
                >
                  <td class="g2a-text-bold g2a-subtitle-2">
                    {{ p.first_name }} {{ p.last_name }}
                  </td>
                  <td class="g2a-subtitle-2">{{ p.age ?? "—" }}</td>
                  <td class="g2a-subtitle-2">{{ p.gender || "—" }}</td>
                  <td class="g2a-subtitle-2">{{ p.nationality || "—" }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-container>
        </g2-a-expansion-panel>
      </template>

      <!-- Customer -->
      <g2-a-expansion-panel
        v-if="hasCustomerDetails"
        class="my-2"
        title="Customer Info"
      >
        <v-container>
          <div class="d-flex justify-space-between py-2">
            <span class="data-label">Name</span>
            <strong
              >{{ customerDetails.first_name }}
              {{ customerDetails.last_name }}</strong
            >
          </div>
          <div class="d-flex justify-space-between py-2">
            <span class="data-label">Mobile</span>
            <strong>{{ customerDetails.phone || "—" }}</strong>
          </div>
          <div class="d-flex justify-space-between py-2">
            <span class="data-label">Email</span>
            <strong>{{ customerDetails.email || "—" }}</strong>
          </div>
          <div class="d-flex justify-space-between py-2">
            <span class="data-label">Country</span>
            <strong>{{ customerDetails.country || "—" }}</strong>
          </div>
        </v-container>
      </g2-a-expansion-panel>

      <!-- Payment Summary -->
      <g2-a-expansion-panel
        :model-value="true"
        class="my-2"
        title="Payment Summary"
      >
        <v-container>
          <div class="d-flex justify-space-between py-2">
            <span class="data-label">Subtotal</span>
            <strong>{{ currency(order.subtotal) }}</strong>
          </div>

          <div v-if="order.discount" class="d-flex justify-space-between py-2">
            <span class="data-label">Discount</span>
            <strong class="text-success"
              >-{{ currency(order.discount) }}</strong
            >
          </div>

          <div v-if="order.tax" class="d-flex justify-space-between py-2">
            <span class="data-label">Tax</span>
            <strong>{{ currency(order.tax) }}</strong>
          </div>

          <v-card
            flat
            variant="tonal"
            color="brandColor2"
            rounded="lg"
            class="pa-4 mt-4"
          >
            <div class="d-flex justify-space-between align-center">
              <span class="g2a-subtitle-4">Total Paid</span>
              <div class="g2a-title-4 text-brandColor2">
                {{ currency(order.grand_total) }}
              </div>
            </div>
          </v-card>

          <template v-if="order.payments?.length">
            <div
              class="g2a-text-bold-600 g2a-subtitle-2 text-greyDark mt-5 mb-2"
            >
              Payment history
            </div>

            <v-card
              v-for="p in order.payments"
              :key="p.payment_id"
              flat
              variant="tonal"
              :color="paymentStatusColor(p.status)"
              rounded="lg"
              class="mb-3 pa-4"
            >
              <div class="d-flex justify-space-between align-center py-1">
                <span class="data-label">Payment Status</span>
                <v-chip
                  :color="paymentStatusColor(p.status)"
                  size="small"
                  variant="flat"
                >
                  {{ p.status?.toUpperCase() }}
                </v-chip>
              </div>
              <div class="d-flex justify-space-between py-1">
                <span class="data-label">Amount</span>
                <strong>{{ currency(p.amount) }}</strong>
              </div>
              <div class="d-flex justify-space-between py-1">
                <span class="data-label">Payment Date</span>
                <strong>{{ formatDateTime(p.paid_at || p.created_at) }}</strong>
              </div>
              <div class="d-flex justify-space-between py-1">
                <span class="data-label">Payment ID</span>
                <strong class="text-medium-emphasis">{{ p.payment_id }}</strong>
              </div>
            </v-card>
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
const copied = ref(false);

const items = computed(() => order.value?.items ?? []);
const bookingOf = (item) => item.booking_data ?? {};

const customerDetails = computed(() => order.value?.customer_details ?? {});
const hasCustomerDetails = computed(() =>
  Object.values(customerDetails.value).some(Boolean),
);

const statusAlert = computed(() => {
  const status = order.value?.order_status;

  if (status === "confirmed") {
    return {
      type: "success",
      icon: "mdi-check-circle",
      heading: "Booking Confirmed",
      text: "Your Andaman adventure is booked — see you there!",
    };
  }
  if (status === "cancelled") {
    return {
      type: "error",
      icon: "mdi-close-circle",
      heading: "Booking Cancelled",
      text: "This booking was cancelled. You can place a fresh order anytime.",
    };
  }
  return {
    type: "warning",
    icon: "mdi-clock-outline",
    heading: "Processing Your Booking",
    text: "We're confirming your payment. If it didn't go through, you can make a fresh order.",
  };
});

const copyOrderId = async () => {
  try {
    await navigator.clipboard.writeText(order.value.order_id);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  } catch (err) {
    console.error("[copyOrderId]", err);
  }
};

const loadOrder = async () => {
  loading.value = true;
  error.value = "";

  try {
    const { data } = await apiClient.get(
      `/v1/orders/${encodeURIComponent(route.params.order_id)}`,
    );
    order.value = data.data;
  } catch (err) {
    console.error("[loadOrder]", err);
    error.value =
      err?.response?.status === 404
        ? "This booking could not be found."
        : "Unable to load booking.";
  } finally {
    loading.value = false;
  }
};

const currency = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "-";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: order.value?.currency || "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (date) => {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatTime = (time) => {
  if (!time || typeof time !== "string" || !time.includes(":")) return "-";
  const [hour, minute] = time.split(":");
  const date = new Date();
  date.setHours(Number(hour), Number(minute));
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const paymentStatusColor = (status) => {
  return (
    {
      captured: "success",
      authorized: "warning",
      failed: "error",
      refunded: "info",
      pending: "warning",
    }[status] || "grey"
  );
};

onMounted(loadOrder);
</script>
