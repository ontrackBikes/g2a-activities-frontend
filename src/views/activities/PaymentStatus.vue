<template>
  <v-container class="py-16 text-center">

    <v-progress-circular
      indeterminate
      size="60"
      color="primary"
    />

    <div class="g2a-title-4 mt-6">
      Waiting for payment confirmation...
    </div>

    <div class="g2a-text-14 mt-2">
      Please don't close this page.
    </div>

    <v-chip
      class="mt-6"
      color="orange"
    >
      {{ paymentStatus }}
    </v-chip>

  </v-container>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import apiClient from "@/services/api";

const route = useRoute();

const paymentStatus = ref("pending");

let pollTimer = null;
let timeoutTimer = null;

const redirectToFailed = () => {
  clearInterval(pollTimer);
  clearTimeout(timeoutTimer);

  router.replace({
    name: "OrderFailed",
    params: {
      order_id: route.params.order_id,
    },
  });
};

const checkStatus = async () => {
  try {
    const { data } = await apiClient.get(
      `/v1/orders/${route.params.order_id}/verify-payment`
    );

    paymentStatus.value = data.data.payment_status;

    if (paymentStatus.value === "paid") {
      clearInterval(pollTimer);
      clearTimeout(timeoutTimer);

      router.replace({
        name: "OrderSuccess",
        params: {
          order_id: route.params.order_id,
        },
      });
    }

    if (paymentStatus.value === "failed") {
      redirectToFailed();
    }
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  checkStatus();

  // Poll every 3 seconds
  pollTimer = setInterval(checkStatus, 3000);

  // Maximum wait time: 60 seconds
  timeoutTimer = setTimeout(() => {
    if (paymentStatus.value !== "paid") {
      redirectToFailed();
    }
  }, 60000);
});

onUnmounted(() => {
  clearInterval(pollTimer);
  clearTimeout(timeoutTimer);
});
</script>