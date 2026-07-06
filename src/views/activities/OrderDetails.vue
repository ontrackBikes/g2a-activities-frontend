<template>
  <v-container
    v-if="order"
    class="py-8"
  >
    <v-row>

      <v-col
        cols="12"
        md="8"
      >
        <OrderSummaryCard
          :order="order"
        />

        <OrderCustomerCard
          class="mt-5"
          :customer="order.customer_details"
        />

        <OrderParticipantsCard
          v-if="participants.length"
          class="mt-5"
          :participants="participants"
        />
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <OrderPriceCard
          :order="order"
          :loading="paying"
          @pay="payNow"
        />
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import apiClient from "@/services/api";

const route = useRoute();

const order = ref(null);

const paying = ref(false);

const participants = computed(() => {
  if (!order.value?.items?.length) {
    return [];
  }

  return order.value.items[0].participants || [];
});

const loadOrder = async () => {
  const { data } = await apiClient.get(
    `/v1/orders/${route.params.order_id}`,
  );

  order.value = data.data;
};

const payNow = async () => {
  paying.value = true;

  try {

    const { data } = await apiClient.post(
      `/v1/orders/${route.params.order_id}/create-payment`,
    );

    const payment = data.data;

    const razorpay = new Razorpay({

      key: payment.key,

      amount: payment.amount,

      currency: payment.currency,

      order_id: payment.razorpay_order_id,

      name: "Go2Andaman",

      description: "Activity Booking",

      prefill: payment.customer,

      handler: async (response) => {

        await apiClient.post(
          "/v1/payments/verify",
          {
            order_id: route.params.order_id,

            ...response,
          },
        );

        window.location.href =
          `/checkout/orders/${route.params.order_id}/success`;
      },

      theme: {
        color: "#2563EB",
      },

    });

    razorpay.open();

  } finally {

    paying.value = false;

  }
};

onMounted(loadOrder);
</script>