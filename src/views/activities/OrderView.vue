<template>
  <v-container class="g2a-container-width py-8 mx-auto">
    <div v-if="loading" class="text-center py-16">
      <v-progress-circular indeterminate color="brandColor" size="40" />
    </div>

    <v-alert v-else-if="error" type="error" variant="tonal" rounded="lg">
      {{ error }}
      <div class="mt-2">
        <v-btn size="large" variant="outlined" color="error" @click="loadOrder">
          Try again
        </v-btn>
      </div>
    </v-alert>

    <v-alert v-else-if="!order" type="warning" variant="tonal" rounded="lg">
      Booking not found.
    </v-alert>

    <div v-else>
      <!-- ================= Hero ================= -->
      <v-card rounded="lg" flat class="mb-6 border">
        <v-container>
          <div class="d-flex align-center flex-wrap ga-4">
            <v-avatar :color="statusAlert.type" variant="tonal" size="56">
              <v-icon size="28" :color="statusAlert.type">{{
                statusAlert.icon
              }}</v-icon>
            </v-avatar>

            <div class="flex-grow-1">
              <div class="g2a-title-xl">{{ statusAlert.heading }}</div>
              <div class="g2a-title-md text-greyDark mt-1">
                {{ statusAlert.text }}
              </div>
            </div>

            <div class="d-flex align-center text-left text-sm-right">
              <div class="g2a-text-caption text-greyDark">Order ID:</div>
              <div class="d-flex align-center">
                <span class="g2a-title-2xl-1">{{ order.order_id }}</span>
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
            <div class="d-flex align-center" v-if="order.created_at">
              <v-icon size="24" color="brandColor2" class="mr-1"
                >mdi-calendar-outline</v-icon
              >
              <span class="g2a-title-lg text-greyDark"
                >Placed {{ formatDate(order.created_at) }}</span
              >
            </div>
            <div class="d-flex align-center">
              <v-icon size="24" color="greyDark" class="mr-1"
                >mdi-package-variant-closed</v-icon
              >
              <span class="g2a-title-lg">
                {{ items.length }} {{ items.length === 1 ? "item" : "items" }}
              </span>
            </div>
            <div class="d-flex align-center">
              <v-icon size="24" color="greyDark" class="mr-1"
                >mdi-cash</v-icon
              >
              <span class="g2a-title-lg">{{
                currency(order.grand_total)
              }}</span>
            </div>
          </div>
        </v-container>
      </v-card>

      <template v-for="(item, index) in items" :key="index">
        <!-- ================= Product ================= -->
        <v-card rounded="lg" flat class="border mb-4">
          <v-row no-gutters>
            <v-col cols="3" sm="2">
              <v-img
                :src="item.thumbnail_url"
                :alt="item.product_name"
                cover
                height="100%"
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

            <v-col cols="9" sm="10" class="pa-2">
              <div class="g2a-title-xl">
                 <v-icon size="14" class="mr-1">mdi-check-circle</v-icon>
                {{ item.product_name }}</div>
              <div class="g2a-title-md text-greyDark d-flex align-center">
                <v-icon size="14" class="mr-1">mdi-map-marker-outline</v-icon>
                {{ item.location_name }}
              </div>
              <div
                v-if="bookingOf(item).selected_slot?.name"
                class="g2a-title-lg"
              >
              
                <v-icon size="14" class="mr-1">{{bookingOf(item).selected_slot.slot_type == 'TIME' ? 'mdi-timer': 'mdi-check-circle'}}</v-icon>
                {{ bookingOf(item).selected_slot.name }}

                <span v-if="bookingOf(item).selected_slot.start_time && bookingOf(item).selected_slot.end_time">
                  ({{ bookingOf(item).selected_slot.start_time }} - {{ bookingOf(item).selected_slot.end_time }})
                </span>
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
              <span class="g2a-title-md text-greyDark">Booking ID</span>
              <div class="g2a-title-md">{{ order.order_id }}</div>
            </div>

            <div
              v-if="bookingOf(item).guests"
              class="d-flex justify-space-between py-2"
            >
              <div class="g2a-title-md text-greyDark"> Guests</div>
             
              <div class="g2a-title-md">{{ bookingOf(item).guests }}</div>
            </div>
            <div
              v-if="bookingOf(item).quantity"
              class="d-flex justify-space-between py-2"
            >
               <div class="g2a-title-md text-greyDark">Quantity</div>
              <div class="g2a-title-md">{{ bookingOf(item).quantity }}</div>
            </div>
            <div
              v-if="bookingOf(item).selected_slot"
              class="d-flex justify-space-between py-2"
            >
              <span class="g2a-title-md text-greyDark">
                {{
                  bookingOf(item).booking_mode === "date_range"
                    ? "Vehicle"
                    : "Time Slot"
                }}
              </span>
              <div class="g2a-title-md">{{ bookingOf(item).selected_slot.name }}</div>
            </div>

            <!-- Rental Booking -->
            <template v-if="bookingOf(item).booking_mode === 'date_range'">
              <div class="d-flex justify-space-between py-2">
                <span class="g2a-title-md text-greyDark">Pickup Date</span>
                <div class="g2a-title-md">{{ formatDate(bookingOf(item).pickup_date) }}</div>
              </div>
              <div class="d-flex justify-space-between py-2">
                <span class="g2a-title-md text-greyDark">Pickup Time</span>
                <div class="g2a-title-md">{{ formatTime(bookingOf(item).pickup_time) }}</div>
              </div>
              <div class="d-flex justify-space-between py-2">
                <span class="g2a-title-md text-greyDark">Return Date</span>
                <div class="g2a-title-md">{{ formatDate(bookingOf(item).return_date) }}</div>
              </div>
              <div class="d-flex justify-space-between py-2">
                <span class="g2a-title-md text-greyDark">Drop Time</span>
                <div class="g2a-title-md">{{ formatTime(bookingOf(item).drop_time) }}</div>
              </div>
              <div class="d-flex justify-space-between py-2">
                <span class="g2a-title-md text-greyDark">Rental Days</span>
                <div class="g2a-title-md">{{ bookingOf(item).rental_days }}</div>
              </div>
            </template>

            <!-- Activity Booking -->
            <template v-else-if="bookingOf(item).travel_date">
              <div class="d-flex justify-space-between py-2">
                <span class="g2a-title-md text-greyDark">Travel Date</span>
                <div class="g2a-title-md">{{ formatDate(bookingOf(item).travel_date) }}</div>
              </div>
            </template>

            <!-- Airport Transfer -->
            <template v-if="bookingOf(item).transfer_type">
              <div class="d-flex justify-space-between py-2">
                <span class="g2a-title-md text-greyDark">Transfer Type</span>
                <div class="g2a-title-md">{{
                  prettyTransferType(bookingOf(item).transfer_type)
                }}</div>
              </div>

              <div
                v-if="bookingOf(item).pickup_location"
                class="d-flex justify-space-between py-2"
              >
                <span class="g2a-title-md text-greyDark">Pickup Location</span>
                <div class="g2a-title-md">
                  {{ bookingOf(item).pickup_location.name }} -
                  {{ bookingOf(item).pickup_location.address }}
                </div>
              </div>

              <div
                v-if="bookingOf(item).drop_location"
                class="d-flex justify-space-between py-2"
              >
                <span class="g2a-title-md text-greyDark">Drop Location</span>
                <div class="g2a-title-md">
                  {{ bookingOf(item).drop_location.name }} -
                  {{ bookingOf(item).drop_location.address }}
                </div>
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
          
            <v-table density="compact" class="no-scrollbar">
              <thead>
                <tr>
                  <th class="g2a-title-md text-greyDark">Name</th>
                  <th class="g2a-title-md text-greyDark">Age</th>
                  <th class="g2a-title-md text-greyDark">Gender</th>
                  <th class="g2a-title-md text-greyDark">Nationality</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(p, pIndex) in item.participants"
                  :key="p.id ?? pIndex"
                >
                  <td class="g2a-title-md">
                    {{ p.first_name }} {{ p.last_name }}
                  </td>
                  <td class="g2a-title-md">{{ p.age ?? "—" }}</td>
                  <td class="g2a-title-md">{{ p.gender || "—" }}</td>
                  <td class="g2a-title-md">{{ p.nationality || "—" }}</td>
                </tr>
              </tbody>
            </v-table>
       
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
            <span class="g2a-title-md text-greyDark">Name</span>
            <div class="g2a-title-md"
              >{{ customerDetails.first_name }}
              {{ customerDetails.last_name }}</div
            >
          </div>
          <div class="d-flex justify-space-between py-2">
            <span class="g2a-title-md text-greyDark">Mobile</span>
            <div class="g2a-title-md"
              >{{ customerDetails.country_code }}
              {{ customerDetails.phone || "—" }}</div
            >
          </div>
          <div class="d-flex justify-space-between py-2">
            <span class="g2a-title-md text-greyDark">Email</span>
            <div class="g2a-title-md">{{ customerDetails.email || "—" }}</div>
          </div>
          <div class="d-flex justify-space-between py-2">
            <span class="g2a-title-md text-greyDark">Country</span>
            <div class="g2a-title-md">{{ customerDetails.country || "—" }}</div>
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
            <span class="g2a-title-md text-greyDark">Subtotal</span>
            <div class="g2a-title-md">{{ currency(order.subtotal) }}</div>
          </div>

          <div v-if="order.discount" class="d-flex justify-space-between py-2">
            <span class="g2a-title-md text-greyDark">Discount</span>
            <div class="g2a-title-md text-success"
              >-{{ currency(order.discount) }}</div
            >
          </div>

          <div v-if="order.tax" class="d-flex justify-space-between py-2">
            <span class="g2a-title-md text-greyDark">Tax</span>
            <div class="g2a-title-md">{{ currency(order.tax) }}</div>
          </div>

          <v-card
            flat
            variant="tonal"
            color="brandColor2"
            rounded="lg"
            class="pa-4 mt-4"
          >
            <div class="d-flex justify-space-between align-center">
              <span class="g2a-title-lg">Total Paid</span>
              <div class="g2a-title-lg text-brandColor2">
                {{ currency(order.grand_total) }}
              </div>
            </div>
          </v-card>

          <template v-if="order.payments?.length">
            <div class="g2a-title-lg text-greyDark my-4 ">
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
                <span class="g2a-title-md text-greyDark">Payment Status</span>
                <v-chip :color="paymentStatusColor(p.status)" variant="flat">
                  {{ p.status?.toUpperCase() }}
                </v-chip>
              </div>
              <div class="d-flex justify-space-between py-1">
                <span class="g2a-title-md text-greyDark">Amount</span>
                <div class="g2a-title-md">{{ currency(p.amount) }}</div>
              </div>
              <div class="d-flex justify-space-between py-1">
                <span class="g2a-title-md text-greyDark">Payment Date</span>
                <div class="g2a-title-md">{{ formatDateTime(p.paid_at || p.created_at) }}</div>
              </div>
              <div class="d-flex justify-space-between py-1">
                <span class="g2a-title-md text-greyDark">Payment ID</span>
                <div class="g2a-title-md">{{ p.payment_id }}</div>
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
const prettyTransferType = (type) => {
  switch (type) {
    case "airport_to_location":
      return "Airport → Location";
    case "location_to_airport":
      return "Location → Airport";
    default:
      return type?.replaceAll("_", " ") || "-";
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
