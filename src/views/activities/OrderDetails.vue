<template>
  <v-container class="py-8">
    <div v-if="loading" class="text-center py-10">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <v-alert v-else-if="error" type="error" variant="tonal">
      {{ error }}
    </v-alert>

    <template v-else-if="order">
      <v-row>
        <v-col cols="12" md="8">
          <!-- Product -->

          <v-card rounded="xl" variant="outlined">
            <v-card-text>
              <div class="d-flex">
                <v-img
                  :src="item.thumbnail_url"
                  width="140"
                  height="110"
                  cover
                  class="rounded-lg mr-4"
                />

                <div>
                  <div class="text-h6 font-weight-bold">
                    {{ item.product_name }}
                  </div>

                  <div class="g2a-text-14">
                    {{ item.location_name }}
                  </div>

                  <div class="mt-3">
                    Order ID :
                    <strong>{{ order.order_id }}</strong>
                  </div>

                  <div>
                    Status :
                    <v-chip size="small" color="orange">
                      {{ order.order_status }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Booking -->

          <v-card class="mt-5" rounded="xl" variant="outlined">
            <v-card-title> Booking Details </v-card-title>

            <v-divider />

            <v-card-text>
              <div
                v-for="(value, key) in item.booking_data"
                :key="key"
                class="d-flex justify-space-between py-2"
              >
                <span>{{ pretty(key) }}</span>
                <strong>{{ formatValue(key, value) }}</strong>
              </div>
            </v-card-text>
          </v-card>

          <!-- Customer -->

          <v-card class="mt-5" rounded="xl" variant="outlined">
            <v-card-title> Customer </v-card-title>

            <v-divider />

            <v-card-text>
              <div class="py-1">
                <strong>Name:</strong>

                {{ order.customer_details.first_name }}
                {{ order.customer_details.last_name }}
              </div>

              <div class="py-1">
                <strong>Mobile:</strong>
                {{ order.customer_details.mobile }}
              </div>

              <div class="py-1">
                <strong>Email:</strong>
                {{ order.customer_details.email }}
              </div>

              <div class="py-1">
                <strong>Country:</strong>
                {{ order.customer_details.country }}
              </div>
            </v-card-text>
          </v-card>

          <!-- Participants -->

          <v-card
            v-if="participants.length"
            class="mt-5"
            rounded="xl"
            variant="outlined"
          >
            <v-card-title> Participants </v-card-title>

            <v-divider />

            <v-card-text>
              <v-table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Nationality</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(p, index) in participants" :key="index">
                    <td>{{ p.first_name }} {{ p.last_name }}</td>

                    <td>{{ p.age }}</td>

                    <td>{{ p.gender }}</td>

                    <td>{{ p.nationality }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- RIGHT -->

        <v-col cols="12" md="4">
          <v-card rounded="xl" variant="outlined">
            <v-card-title> Payment Summary </v-card-title>

            <v-divider />

            <v-card-text>
              <div class="d-flex justify-space-between py-2">
                <span>Subtotal</span>
                <strong>₹{{ currency(order.subtotal) }}</strong>
              </div>

              <div class="d-flex justify-space-between py-2">
                <span>Discount</span>
                <strong>₹{{ currency(order.discount) }}</strong>
              </div>

              <div class="d-flex justify-space-between py-2">
                <span>Tax</span>
                <strong>₹{{ currency(order.tax) }}</strong>
              </div>

              <v-divider class="my-4" />

              <div class="d-flex justify-space-between">
                <strong>Total</strong>

                <div class="text-h5 text-primary">
                  ₹{{ currency(order.grand_total) }}
                </div>
              </div>

              <div v-if="order.payment_status == 'captured'">
                <div class="text-success">
                  Payment Already Received for this order
                </div>
                <v-btn
                  flat
                  rounded="lg"
                  block
                  color="brandColor"
                  size="large"
                  class="mt-6"
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
                :loading="paying"
                @click="payNow"
              >
                Pay Now
              </v-btn>
            </v-card-text>
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

const item = computed(() => {
  return order.value?.items?.[0] || {};
});

const participants = computed(() => {
  return item.value.participants || [];
});

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
          params: {
            order_id: route.params.order_id,
          },
        });
      },

      modal: {
        ondismiss() {
          router.push({
            name: "PaymentStatus",
            params: {
              order_id: route.params.order_id,
            },
          });
        },
      },

      theme: {
        color: "#4C42D8",
      },
    };

    new window.Razorpay(options).open();
  } finally {
    paying.value = false;
  }
};

const currency = (v) => Number(v || 0).toLocaleString("en-IN");

const pretty = (key) =>
  key.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

const formatValue = (key, value) => {
  if (key.includes("date")) {
    return new Date(value).toLocaleDateString("en-IN");
  }

  return value;
};

const viewOrder = () => {
  router.replace({
    name: "Order",
    params: {
      order_id: route.params.order_id,
    },
  });
};

onMounted(loadOrder);
</script>
