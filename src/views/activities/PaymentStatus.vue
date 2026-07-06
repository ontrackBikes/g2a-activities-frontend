<template>
  <v-container class="py-16 text-center">

    <v-progress-circular
      indeterminate
      size="60"
      color="primary"
    />

    <div class="text-h5 mt-6">
      Waiting for payment confirmation...
    </div>

    <div class="text-medium-emphasis mt-2">
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

let timer = null;

const checkStatus = async () => {
  try {
    const { data } = await apiClient.get(
      `/v1/orders/${route.params.order_id}/verify-payment`,
    );

    paymentStatus.value = data.data.payment_status;

    if (data.data.payment_status === "paid") {
      clearInterval(timer);

      router.replace({
        name: "OrderSuccess",
        params: {
          order_id: route.params.order_id,
        },
      });
    }

    if (data.data.payment_status === "failed") {
      clearInterval(timer);

      router.replace({
        name: "OrderFailed",
        params: {
          order_id: route.params.order_id,
        },
      });
    }
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  checkStatus();

  timer = setInterval(checkStatus, 3000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>