
<template>
  <v-container class="py-8">

    <div
      v-if="loading"
      class="text-center py-10"
    >
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </div>

    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
    >
      {{ error }}
    </v-alert>

    <template v-else-if="order">

      <v-row>

        <v-col
          cols="12"
          md="8"
        >

          <v-card
            rounded="xl"
            variant="outlined"
          >

            <v-card-text>

              <div class="d-flex">

                <v-img
                  :src="item.thumbnail_url"
                  width="150"
                  height="120"
                  cover
                  class="rounded-lg mr-4"
                />

                <div>

                  <div class="text-h5 font-weight-bold">
                    {{ item.product_name }}
                  </div>

                  <div class="g2a-text-14">
                    {{ item.location_name }}
                  </div>

                  <div class="mt-4">
                    <strong>Booking ID</strong><br>
                    {{ order.order_id }}
                  </div>

                  <div class="mt-2">

                    <v-chip
                      color="success"
                      v-if="order.payment_status==='paid'"
                    >
                      Paid
                    </v-chip>

                    <v-chip
                      color="warning"
                      v-else
                    >
                      {{ order.payment_status }}
                    </v-chip>

                  </div>

                </div>

              </div>

            </v-card-text>

          </v-card>

          <!-- Booking -->

          <v-card
            class="mt-5"
            rounded="xl"
            variant="outlined"
          >

            <v-card-title>
              Booking Details
            </v-card-title>

            <v-divider />

            <v-card-text>

              <div
                v-for="(value,key) in item.booking_data"
                :key="key"
                class="d-flex justify-space-between py-2"
              >

                <span>{{ pretty(key) }}</span>

                <strong>
                  {{ formatValue(key,value) }}
                </strong>

              </div>

            </v-card-text>

          </v-card>

          <!-- Customer -->

          <v-card
            class="mt-5"
            rounded="xl"
            variant="outlined"
          >

            <v-card-title>
              Customer
            </v-card-title>

            <v-divider />

            <v-card-text>

              <div>
                {{ order.customer_details.first_name }}
                {{ order.customer_details.last_name }}
              </div>

              <div>{{ order.customer_details.mobile }}</div>

              <div>{{ order.customer_details.email }}</div>

              <div>{{ order.customer_details.country }}</div>

            </v-card-text>

          </v-card>

          <!-- Participants -->

          <v-card
            v-if="participants.length"
            class="mt-5"
            rounded="xl"
            variant="outlined"
          >

            <v-card-title>
              Participants
            </v-card-title>

            <v-divider />

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

                <tr
                  v-for="(participant,index) in participants"
                  :key="index"
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

          </v-card>

        </v-col>

        <!-- Right -->

        <v-col
          cols="12"
          md="4"
        >

          <v-card
            rounded="xl"
            variant="outlined"
          >

            <v-card-title>
              Payment Summary
            </v-card-title>

            <v-divider />

            <v-card-text>

              <div class="d-flex justify-space-between py-2">

                <span>Subtotal</span>

                <strong>
                  ₹{{ currency(order.subtotal) }}
                </strong>

              </div>

              <div class="d-flex justify-space-between py-2">

                <span>Discount</span>

                <strong>
                  ₹{{ currency(order.discount) }}
                </strong>

              </div>

              <div class="d-flex justify-space-between py-2">

                <span>Tax</span>

                <strong>
                  ₹{{ currency(order.tax) }}
                </strong>

              </div>

              <v-divider class="my-4" />

              <div class="d-flex justify-space-between">

                <strong>Total Paid</strong>

                <div class="text-h5 text-primary">
                  ₹{{ currency(order.grand_total) }}
                </div>

              </div>

     
              <v-alert
                
                class="mt-6"
                type="success"
                variant="tonal"
              >
                Your booking has been confirmed.
              </v-alert>

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

const route = useRoute();

const loading = ref(true);

const error = ref("");

const order = ref(null);

const item = computed(() => order.value?.items?.[0] || {});

const participants = computed(() => item.value.participants || []);

const loadOrder = async () => {
  try {

    loading.value = true;

    const { data } = await apiClient.get(
      `/v1/orders/${route.params.order_id}`,
    );

    order.value = data.data;

  } catch (e) {

    console.error(e);

    error.value = "Unable to load booking.";

  } finally {

    loading.value = false;

  }
};

const currency = (value) =>
  Number(value || 0).toLocaleString("en-IN");

const pretty = (key) =>
  key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const formatValue = (key, value) => {

  if (key.includes("date")) {

    return new Date(value).toLocaleDateString("en-IN");

  }

  return value;

};

onMounted(loadOrder);
</script>