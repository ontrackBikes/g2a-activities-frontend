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
        <v-col cols="12" :lg="mobile ? 12 : 7">
          <!-- Product -->
          <v-card rounded="lg" class="border" flat>
            <v-container>
              <v-row>
                <v-col cols="3">
                  <v-img
                    :src="item.thumbnail_url"
                    width="140"
                    height="110"
                    cover
                    class="rounded-lg"
                  />
                </v-col>

                <v-col>
                  <div class="g2a-title-xl">{{ item.product_name }}</div>
                  <div class="g2a-text-14 text-greyDark mt-1">
                    {{ item.location_name }}
                  </div>

                  <div>
                    <span class="g2a-title-xs">Order ID:</span>
                    <span class="g2a-title-xs">{{ order.order_id }}</span>
                  </div>

                  <div class="my-2">
                    <v-chip size="small" color="orange" variant="tonal">
                      {{ order.order_status }}
                    </v-chip>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card>

          <!-- Booking Details -->
          <v-card rounded="lg" class="border my-2" flat>
            <v-container>
              <div class="g2a-title-xl mb-1">Booking Details</div>
              <v-divider class="mb-2" />

              <DetailRow
                v-if="bookingData.guests"
                label="Guests"
                :value="bookingData.guests"
              />
              <DetailRow
                v-if="bookingData.quantity"
                label="Quantity"
                :value="bookingData.quantity"
              />
              <DetailRow
                v-if="bookingData.travel_date"
                label="Travel Date"
                :value="formatDate(bookingData.travel_date)"
              />
              <DetailRow
                v-if="bookingData.transfer_type"
                label="Transfer Type"
                :value="prettyTransferType(bookingData.transfer_type)"
              />

              <DetailRow
                v-if="bookingData.pickup_location"
                label="Pickup Location"
                :value="`${bookingData.pickup_location.name} (${bookingData.pickup_location.type})`"
              />

              <DetailRow
                v-if="bookingData.drop_location"
                label="Drop Location"
                :value="`${bookingData.drop_location.name} (${bookingData.drop_location.type})`"
              />

              <DetailRow
                v-if="bookingData.selected_slot"
                label="Time Slot"
                :value="`${bookingData.selected_slot.name} (${formatTime(bookingData.selected_slot.start_time)} - ${formatTime(bookingData.selected_slot.end_time)})`"
              />

              <DetailRow
                v-if="bookingData.pickup_date"
                label="Pickup Date"
                :value="formatDate(bookingData.pickup_date)"
              />
              <DetailRow
                v-if="bookingData.pickup_time"
                label="Pickup Time"
                :value="formatTime(bookingData.pickup_time)"
              />
              <DetailRow
                v-if="bookingData.drop_time"
                label="Drop Time"
                :value="formatTime(bookingData.drop_time)"
              />
              <DetailRow
                v-if="bookingData.return_date"
                label="Return Date"
                :value="formatDate(bookingData.return_date)"
              />
              <DetailRow
                v-if="bookingData.rental_days"
                label="Rental Days"
                :value="bookingData.rental_days"
              />
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
              <div class="g2a-title-lg mb-1">Customer</div>
              <v-divider class="mb-2" />

              <DetailRow
                label="Name"
                :value="`${order.customer_details.first_name} ${order.customer_details.last_name}`"
              />
              <DetailRow label="Mobile" :value="order.customer_details.phone" />
              <DetailRow label="Email" :value="order.customer_details.email" />
              <DetailRow
                label="Country"
                :value="order.customer_details.country"
              />
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
              <div class="g2a-title-lg mb-1">Rental Details</div>
              <v-divider class="mb-2" />

              <DetailRow
                v-if="rentalDetails.quantity"
                label="Quantity"
                :value="rentalDetails.quantity"
              />
              <DetailRow
                label="Pickup Time"
                :value="formatTime(rentalDetails.pickup_time)"
              />
              <DetailRow
                label="Pickup"
                :value="
                  rentalDetails.pickup_type === 'hotel'
                    ? `Hotel Pickup - ${rentalDetails.pickup_hotel_name}`
                    : `Self Pickup - ${rentalDetails.pickup_point}`
                "
              />
              <DetailRow
                label="Drop"
                :value="
                  rentalDetails.drop_type === 'hotel'
                    ? `Hotel Drop - ${rentalDetails.drop_hotel_name}`
                    : `Self Drop - ${rentalDetails.drop_point}`
                "
              />
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
              <div class="g2a-title-lg mb-1">Medical Declaration</div>
              <v-divider class="mb-2" />

              <div v-if="declaredConditions.length">
                <DetailRow
                  v-for="condition in declaredConditions"
                  :key="condition"
                  :label="pretty(condition)"
                  value="Yes"
                />

                <div v-if="medical.other_details" class="py-2">
                  <span class="data-label">Additional Details</span>
                  <div class="g2a-title-lg mt-1">
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
              <div class="g2a-title-lg mb-1">Participants</div>
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
                    <td class="g2a-title-lg g2a-title-2xl-2">
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
              <div class="g2a-title-lg mb-1">Seat Selection</div>
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
                    <td class="g2a-title-lg g2a-title-2xl-2">
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

        <!-- RIGHT: desktop / tablet sticky summary card -->
        <v-col v-if="!mobile" cols="12" lg="5">
          <div class="position-sticky" style="top: 24px; z-index: 1">
            <v-card rounded="lg" class="border" flat>
              <v-container>
                <div class="g2a-title-xl mb-1">Payment Summary</div>
                <v-divider class="mb-2" />

                <DetailRow
                  label="Subtotal"
                  :value="`₹${currency(order.subtotal)}`"
                />
                <DetailRow
                  label="Discount"
                  :value="`₹${currency(order.discount)}`"
                />
                <DetailRow label="Tax" :value="`₹${currency(order.tax)}`" />

                <v-divider class="my-4" />

                <div class="d-flex justify-space-between align-center">
                  <span class="g2a-title-2xl-4">Total</span>
                  <div class="g2a-title-lg text-brandColor2">
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

                <div class="text-center py-2">
                  By clicking "Pay", you agree to the
                  <span class="g2a-link">terms of service</span>.
                </div>

                <v-divider class="my-2" />

                <div
                  class="d-flex align-center justify-center g2a-text-caption text-greyDark mt-3"
                >
                  <v-icon size="14" class="mr-1"
                    >mdi-shield-check-outline</v-icon
                  >
                  No Hidden Charges
                </div>
              </v-container>
            </v-card>
          </div>
        </v-col>
      </v-row>

      <!-- RIGHT: mobile fixed bottom bar + bottom sheet -->
      <template v-if="mobile">
        <div class="mobile-summary-bar">
          <v-card flat rounded="0">
            <v-card-text class="py-3">
              <button
                type="button"
                class="d-flex align-center justify-space-between w-100 bg-transparent border-0 pa-0 mb-2"
                aria-label="View payment summary"
                aria-haspopup="dialog"
                :aria-expanded="detailsSheet"
                @click="detailsSheet = true"
              >
                <span class="d-flex flex-column text-left">
                  <span class="g2a-text-caption text-greyDark"
                    >Total payable</span
                  >
                  <span class="g2a-title-xl text-brandColor2"
                    >₹{{ currency(order.grand_total) }}</span
                  >
                </span>
                <span class="g2a-link g2a-title-2xl-2 d-flex align-center">
                  Details
                  <v-icon size="18" class="ml-1">mdi-chevron-up</v-icon>
                </span>
              </button>

              <div v-if="order.payment_status == 'captured'">
                <v-btn
                  flat
                  rounded="lg"
                  block
                  color="brandColor"
                  size="large"
                  @click="viewOrder"
                  >View</v-btn
                >
              </div>
              <v-btn
                v-else
                flat
                rounded="lg"
                block
                color="brandColor"
                size="large"
                :disabled="order.order_status == 'confirmed'"
                :loading="paying"
                @click="payNow"
              >
                Pay Now
              </v-btn>
            </v-card-text>
          </v-card>
        </div>

        <!-- Reserves space so page content isn't hidden behind the fixed bar -->
        <div class="mobile-summary-bar-spacer" />

        <v-bottom-sheet v-model="detailsSheet" inset scrollable>
          <v-card
            rounded="t-xl"
            class="d-flex flex-column"
            style="max-height: 90vh"
          >
            <div class="d-flex align-center justify-space-between pa-4">
              <div class="g2a-title">Payment Summary</div>
              <v-btn
                icon="mdi-close"
                variant="text"
                size="small"
                aria-label="Close details"
                @click="detailsSheet = false"
              />
            </div>
            <v-divider />

            <div class="pa-4" style="overflow-y: auto">
              <DetailRow
                label="Subtotal"
                :value="`₹${currency(order.subtotal)}`"
              />
              <DetailRow
                label="Discount"
                :value="`₹${currency(order.discount)}`"
              />
              <DetailRow label="Tax" :value="`₹${currency(order.tax)}`" />

              <v-divider class="my-4" />

              <div class="d-flex justify-space-between align-center">
                <span class="g2a-title-2xl-4">Total</span>
                <div class="g2a-title-lg text-brandColor2">
                  ₹{{ currency(order.grand_total) }}
                </div>
              </div>
            </div>

            <v-divider />
            <div class="pa-4">
              <div v-if="order.payment_status == 'captured'">
                <div class="g2a-title-2xl-2 text-success mb-3">
                  Payment already received for this order
                </div>
                <v-btn
                  flat
                  rounded="lg"
                  block
                  color="brandColor"
                  size="large"
                  @click="viewOrder"
                  >View</v-btn
                >
              </div>

              <v-btn
                v-else
                flat
                rounded="lg"
                block
                color="brandColor"
                size="large"
                :disabled="order.order_status == 'confirmed'"
                :loading="paying"
                @click="payNow"
              >
                Pay Now
              </v-btn>

              <div class="text-center py-2">
                By clicking "Pay", you agree to the
                <span class="g2a-link">terms of service</span>.
              </div>

              <v-divider class="my-2" />

              <div
                class="d-flex align-center justify-center g2a-text-caption text-greyDark mt-3"
              >
                <v-icon size="14" class="mr-1">mdi-shield-check-outline</v-icon>
                No Hidden Charges
              </div>
            </div>
          </v-card>
        </v-bottom-sheet>
      </template>
    </template>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, h } from "vue";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import apiClient from "@/services/api";
import router from "@/router";

const route = useRoute();
const { mobile } = useDisplay();

const loading = ref(true);
const paying = ref(false);
const error = ref("");
const detailsSheet = ref(false);

const order = ref(null);

/*
|--------------------------------------------------------------------------
| Reusable label/value row — used for booking details, customer info,
| rental details, medical declarations and the payment breakdown, in both
| the desktop card and the mobile bottom sheet.
|--------------------------------------------------------------------------
*/
const DetailRow = (rowProps) =>
  h("div", { class: "d-flex justify-space-between flex-wrap ga-2 py-2" }, [
    h("span", { class: "data-label" }, rowProps.label),
    h(
      "strong",
      { class: "g2a-title-lg text-right" },
      String(rowProps.value ?? ""),
    ),
  ]);
DetailRow.props = {
  label: { type: String, default: "" },
  value: { type: [String, Number], default: "" },
};

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

const rentalDetails = computed(() => payload.value.rental_details || {});

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
    //payNow()
  }
};

const prettyTransferType = (type) => {
  switch (type) {
    case "airport_to_location":
      return "Airport → Location";
    case "location_to_airport":
      return "Location → Airport";
    default:
      return type?.replaceAll("_", " ") || "";
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

<style scoped>
/* Vuetify has no utility class for "stuck to the bottom of the viewport",
   so this bit of positioning CSS is genuinely necessary. */
.mobile-summary-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  padding-bottom: env(safe-area-inset-bottom, 0);
}

/* Reserves space at the end of the page so content isn't hidden behind the fixed bar. */
.mobile-summary-bar-spacer {
  height: calc(96px + env(safe-area-inset-bottom, 0));
}
</style>
