<template>
  <v-container class="g2a-container-width py-8 px-0 mx-auto">
    <div v-if="loading" class="text-center py-10">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <v-alert v-else-if="error" type="error" variant="tonal">
      {{ error }}
    </v-alert>

    <template v-else-if="order">
      <v-row>
        <v-col cols="12" lg="7">
          <div
            :class="!mobile ? 'position-sticky' : ''"
            v-if="order.items"
            style="top: 24px; z-index: 1"
          >
            <div v-for="item in order.items" :key="item.id">
              <v-card rounded="lg" class="border" flat>
                <!-- Product -->
                <v-card-item class="pa-5">
                  <template #prepend>
                    <v-avatar rounded="lg" size="60" class="g2a-rounded-border">
                      <v-img
                        :src="item.thumbnail_url"
                        :alt="item.thumbnail_url || 'Product image'"
                        cover
                      >
                      </v-img>
                    </v-avatar>
                  </template>
                  <template #default>
                    <div class="g2a-title-lg">{{ item.product_name }}</div>
                    <div class="g2a-text-14 text-greyDark mt-1">
                      {{ item.location_name }}
                    </div>
                  </template>
                </v-card-item>
              </v-card>

              <v-card
                flat
                class="border my-2"
                rounded="lg"
                v-if="item.booking_data"
              >
                <v-container>
                  <div class="g2a-title-lg">Booking Info</div>
                  <v-divider class="my-2" />

                  <DetailRow
                    v-if="
                      item.booking_data.guests &&
                      item.product_name !== 'Bike Rentals'
                    "
                    label="Guests"
                    :value="item.booking_data.guests"
                  />
                  <DetailRow
                    v-if="item.booking_data.quantity"
                    :label="
                      'Quantity' +
                      (item.product_name === 'Bike Rentals' ? ' (Scooty)' : '')
                    "
                    :value="item.booking_data.quantity"
                  />
                  <DetailRow
                    v-if="item.booking_data.travel_date"
                    label="Travel Date"
                    :value="formatDate(item.booking_data.travel_date)"
                  />
                  <DetailRow
                    v-if="item.booking_data.transfer_type"
                    label="Transfer Type"
                    :value="prettyTransferType(item.booking_data.transfer_type)"
                  />
                  <DetailRow
                    v-if="item.booking_data.pickup_location"
                    label="Pickup Location"
                    :value="`${item.booking_data.pickup_location.name} (${locationTypeLabel(item.booking_data.pickup_location)})`"
                  />
                  <DetailRow
                    v-if="item.booking_data.pickup_location?.address"
                    label="Pickup Address"
                    :value="item.booking_data.pickup_location.address"
                  />
                  <DetailRow
                    v-if="item.booking_data.drop_location"
                    label="Drop Location"
                    :value="`${item.booking_data.drop_location.name} (${locationTypeLabel(item.booking_data.drop_location)})`"
                  />
                  <DetailRow
                    v-if="item.booking_data.drop_location?.address"
                    label="Drop Address"
                    :value="item.booking_data.drop_location.address"
                  />
                  <DetailRow
                    v-if="
                      isKmBasedItem(item) && item.pricing?.distance_km != null
                    "
                    label="Distance"
                    :value="distanceValue(item)"
                  />
                  <DetailRow
                    v-if="
                      isKmBasedItem(item) && item.pricing?.unit_price != null
                    "
                    label="Fare"
                    :value="`₹${currency(item.pricing.unit_price)}`"
                  />
                  <v-row
                    v-if="item.booking_data.selected_slot"
                    no-gutters
                    class="py-2"
                  >
                    <v-col cols="3" class="text-capitalize">
                      {{
                        item.booking_data.selected_slot.slot_type === 'TIME' ? "Time Slot" : item.booking_data.selected_slot.slot_type
                      }}
                    </v-col>
                    <v-col cols="9" class="g2a-title-md text-right">
                      {{ item.booking_data.selected_slot.name }}

                      <span
                        v-if="
                          item.booking_data.selected_slot.start_time &&
                          item.booking_data.selected_slot.end_time
                        "
                      >
                        ({{
                          formatTime(item.booking_data.selected_slot.start_time)
                        }}
                        -
                        {{
                          formatTime(item.booking_data.selected_slot.end_time)
                        }})
                      </span>
                    </v-col>
                  </v-row>

                  <DetailRow
                    v-if="item.opt_for_pickup_and_drop != null"
                    label="Pickup & Drop"
                    :value="item.opt_for_pickup_and_drop ? 'Opted' : 'Not opted'"
                  />
                  <DetailRow
                    v-if="item.booking_data.pickup_date"
                    label="Pickup Date"
                    :value="formatDate(item.booking_data.pickup_date)"
                  />
                  <DetailRow
                    v-if="item.booking_data.pickup_time"
                    label="Pickup Time"
                    :value="formatTime(item.booking_data.pickup_time)"
                  />
                  <DetailRow
                    v-if="item.booking_data.drop_time"
                    label="Return Time"
                    :value="formatTime(item.booking_data.drop_time)"
                  />
                  <DetailRow
                    v-if="item.booking_data.return_date"
                    label="Return Date"
                    :value="formatDate(item.booking_data.return_date)"
                  />
                  <DetailRow
                    v-if="item.booking_data.rental_days"
                    label="Rental Days"
                    :value="item.booking_data.rental_days"
                  />
                </v-container>
              </v-card>

              <v-card
                flat
                class="border my-2"
                rounded="lg"
                v-if="item.flight_details"
              >
                <v-container>
                  <div class="g2a-title-lg">Flight Info</div>
                  <v-divider class="my-2" />

                  <DetailRow
                    v-if="
                      item.flight_details?.airline ||
                      item.flight_details?.custom_airline
                    "
                    label="Airline"
                    :value="
                      item.flight_details?.airline ||
                      item.flight_details?.custom_airline
                    "
                  />

                  <DetailRow
                    v-if="item.flight_details?.flight_number"
                    label="Flight Number"
                    :value="item.flight_details?.flight_number"
                  />
                </v-container>
              </v-card>

              <v-card
                flat
                class="border my-2"
                rounded="lg"
                v-if="item.rental_details"
              >
                <v-container>
                  <v-row
                    no-gutters
                    class="py-2"
                    v-if="
                      item.rental_details.pickup_type === 'hotel'
                        ? item.rental_details.pickup_hotel_name
                        : item.rental_details.pickup_point
                    "
                  >
                    <v-col cols="3">
                      Pickup Point ({{ item.rental_details?.pickup_type }})
                    </v-col>
                    <v-col cols="9" class="text-right">
                      <template
                        v-if="item.rental_details.pickup_type === 'hotel'"
                      >
                        <span class="g2a-title-lg">{{
                          item.rental_details?.pickup_hotel_name
                        }}</span>
                      </template>
                      <template v-else>
                        <span class="g2a-title-lg">{{
                          item.rental_details?.pickup_point?.name
                        }}</span>
                        <!-- <div>
                          {{ item.rental_details?.pickup_point?.address }}
                        </div> -->
                      </template>
                    </v-col>
                  </v-row>

                  <v-row
                    no-gutters
                    class="py-2"
                    v-if="
                      item.rental_details.drop_type === 'hotel'
                        ? item.rental_details.drop_hotel_name
                        : item.rental_details.drop_point
                    "
                  >
                    <v-col cols="3"
                      >Drop Point ({{ item.rental_details?.drop_type }})</v-col
                    >
                    <v-col cols="9" class="text-right">
                      <template v-if="item.rental_details.drop_type === 'hotel'">
                        <span class="g2a-title-lg">{{
                          item.rental_details?.drop_hotel_name
                        }}</span>
                      </template>
                      <template v-else>
                        <span class="g2a-title-lg">{{
                          item.rental_details?.drop_point?.name
                        }}</span>
                        <!-- <div>
                          {{ item.rental_details?.drop_point?.address }}
                        </div> -->
                      </template>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>

              <!-- Participants -->
              <v-card
                v-if="item.participants.length > 0"
                class="border my-2"
                rounded="lg"
                flat
              >
                <v-container>
                  <div class="g2a-title-lg mb-1">Participants</div>
                  <v-divider class="my-2" />

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
                      <tr v-for="(p, index) in item.participants" :key="index">
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

              <!-- Medical Declaration -->
              <v-card
                v-if="item.medical_declaration"
                class="my-2 border"
                rounded="lg"
                flat
              >
                <v-container>
                  <div class="g2a-title-lg mb-1">Medical Declaration</div>
                  <v-divider class="my-2" />

                  <div v-if="item.medical_declaration">
                    <!-- item.medical_declaration is an json lets print key and value -->
                    <div
                      v-for="(value, key) in item.medical_declaration"
                      :key="key"
                    >
                      <DetailRow
                        :label="pretty(key)"
                        :value="value ? 'Yes' : 'No'"
                      />
                    </div>

                    <div v-if="item.medical_declaration?.other_details">
                      <DetailRow
                        :label="'Comment'"
                        :value="item.medical_declaration?.other_details"
                      />
                    </div>
                  </div>

                  <div v-else class="g2a-title-2xl-2-light text-greyDark">
                    No health conditions declared.
                  </div>
                </v-container>
              </v-card>
            </div>
          </div>
        </v-col>

        <v-col cols="12" lg="5">
          <div
            :class="!mobile ? 'position-sticky' : ''"
            v-if="order.items"
            style="top: 24px; z-index: 1"
          >
            <!-- Product -->
            <v-card rounded="lg" class="border" flat>
              <v-container>
                <div
                  class="d-flex justify-space-between flex-wrap ga-2 py-2 align-center"
                >
                  <div class="g2a-title-xs">Order ID</div>
                  <div class="g2a-title-xs">{{ order.order_id }}</div>
                </div>

                <div
                  class="d-flex justify-space-between flex-wrap ga-2 py-2 align-center"
                >
                  <div>Payment Status</div>
                  <v-chip
                    size="small"
                    variant="tonal"
                    :color="
                      order.order_status == 'confirmed' ? 'success' : 'orange'
                    "
                  >
                    {{ order.order_status }}
                  </v-chip>
                </div>
              </v-container>
            </v-card>

            <!-- Customer -->
            <v-card
              v-if="order.customer_details"
              class="border my-2"
              rounded="lg"
              flat
            >
              <v-container>
                <div class="g2a-title-lg mb-1">Billing Info</div>
                <v-divider class="my-2" />

                <DetailRow
                  label="Name"
                  :value="`${order.customer_details.first_name} ${order.customer_details.last_name}`"
                />
                <DetailRow
                  label="Mobile"
                  :value="order.customer_details.phone"
                />
                <DetailRow
                  label="Email"
                  :value="order.customer_details.email"
                />
                <!-- <DetailRow
                  label="Country"
                  :value="order.customer_details.country"
                /> -->
              </v-container>
            </v-card>

            <div v-if="!mobile">
              <v-card flat rounded="lg" class="border my-2">
                <v-container>
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
                    </span>
                  </button>
                  <div v-if="order.order_status == 'pending_payment'">
                    <v-btn
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
                    <v-divider class="my-4"></v-divider>
                    <div class="mt-4 text-center">
                      By clicking "Pay Now", you agree to the
                      <a
                        href="https://go2andaman.com/terms-of-service/"
                        target="_blank"
                        class="g2a-link"
                        >terms of service</a
                      >.
                    </div>
                  </div>
                  <div v-else>
                    <div>
                      <v-icon color="success">mdi-check-circle</v-icon> Order is
                      already confirmed.
                    </div>
                    <v-btn
                      size="large"
                      flat
                      rounded="lg"
                      color="brandColor2"
                      @click="viewOrder"
                      class="my-2"
                    >
                      View Order
                    </v-btn>
                  </div>
                </v-container>
              </v-card>
            </div>
          </div>
        </v-col>

        <!-- RIGHT: desktop / tablet sticky summary card -->
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
                </span>
              </button>

              <div v-if="order.order_status == 'pending_payment'">
                <v-btn
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
              </div>
              <div v-else>
                <div>
                  <v-icon color="success">mdi-check-circle</v-icon> Order is
                  already confirmed.
                </div>
                <v-btn
                  size="large"
                  flat
                  rounded="lg"
                  color="brandColor2"
                  @click="viewOrder"
                  class="my-2"
                >
                  View Order
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <div class="mt-4 text-center">
          By clicking "Confirm & Pay", you agree to the
          <a
            href="https://go2andaman.com/terms-of-service/"
            target="_blank"
            class="g2a-link"
            >terms of service</a
          >.
        </div>

        <!-- Reserves space so page content isn't hidden behind the fixed bar -->
        <div class="mobile-summary-bar-spacer" />
      </template>
    </template>
    <v-dialog
      v-model="detailsSheet"
      max-width="700"
      scrollable
      scrim="rgba(15,23,42,.30)"
      :style="{
        backdropFilter: 'blur(5px)',
        webkitBackdropFilter: 'blur(5px)',
      }"
    >
      <v-card rounded="lg" class="d-flex flex-column" style="max-height: 90vh">
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
          <DetailRow label="Subtotal" :value="`₹${currency(order.subtotal)}`" />
          <DetailRow label="Discount" :value="`₹${currency(order.discount)}`" />
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
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, h } from "vue";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import apiClient from "@/services/api";
import router from "@/router";
import { VCol, VRow } from "vuetify/components";

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
  h(VRow, { noGutters: true, class: "py-2" }, [
    h(VCol, { md: 3, cols: 5 }, () => rowProps.label),
    h(VCol, { md: 9, cols: 7, class: "text-right" }, () =>
      h(
        "div",
        {
          class: "g2a-title-md",
          style: {
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          },
        },
        rowProps.value,
      ),
    ),
  ]);

DetailRow.props = {
  label: { type: String, default: "" },
  value: { type: [String, Number], default: "" },
};

const item = computed(() => order.value?.items?.[0] || {});

const formatDate = (d) => new Date(d).toLocaleDateString("en-IN");

const formatTime = (t) => {
  if (!t) return t;
  const [h, m] = t.split(":");
  const hour = +h % 12 || 12;
  return `${hour}:${m} ${+h < 12 ? "AM" : "PM"}`;
};

const payload = computed(() => item.value.booking_payload || {});

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

// Distance-tier (KM_BASED) pricing: `item.pricing` is the full quote
// snapshot saved on the order (see order.controller.js), so distance_km /
// duration_minutes / unit_price are already available per item — no
// extra API call needed here.
const isKmBasedItem = (orderItem) =>
  orderItem?.pricing?.pricing_type === "KM_BASED";

const distanceValue = (orderItem) => {
  const km = orderItem?.pricing?.distance_km;
  if (km == null) return "";

  const minutes = orderItem?.pricing?.duration_minutes;
  return minutes != null ? `${km} km (~${minutes} min)` : `${km} km`;
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

// Configured locations carry categories in `place_types` (array); a
// customer-entered location just carries the literal `type: "custom"`
// discriminator instead - fall back to that when place_types is absent.
const locationTypeLabel = (location) =>
  location?.place_types?.length
    ? location.place_types.join(", ")
    : location?.type || "";

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
