<template>
  <v-container v-if="checking" class="py-16 text-center">
    <v-progress-circular indeterminate size="60" color="primary" />
    <div class="g2a-title-lg mt-6">Confirming your payment...</div>
  </v-container>

  <v-container v-else class="py-12">
    <v-card
      max-width="620"
      class="mx-auto success-card"
      rounded="xl"
      elevation="0"
      variant="outlined"
    >
      <v-card-text class="text-center py-10 px-6 px-sm-10">
        <div class="success-icon-wrap mx-auto mb-6">
          <svg viewBox="0 0 80 80" width="96" height="96" class="success-check">
            <circle class="success-check__fill" cx="40" cy="40" r="34" />
            <circle class="success-check__ring" cx="40" cy="40" r="36" />
            <path class="success-check__tick" d="M22 41 L33 52 L58 27" />
          </svg>
        </div>

        <div class="g2a-title-xl fade-in-up delay-1">Booking Confirmed</div>

        <div class="g2a-title-base text-greyDark mt-2 fade-in-up delay-2">
          Thank you for booking with Go2Andaman. Your payment has been received
          successfully.
        </div>

        <div class="order-id-box mt-8 fade-in-up delay-3">
          <div class="g2a-title-sm text-greyDark text-uppercase">Order ID</div>

          <div class="d-flex align-center justify-center ga-1 mt-1">
            <span class="g2a-title-lg">
              {{ route.params.order_id }}
            </span>
            <v-btn
              :icon="copied ? 'mdi-check' : 'mdi-content-copy'"
              :color="copied ? 'success' : 'greyDark'"
              size="small"
              variant="text"
              aria-label="Copy order ID"
              @click="copyOrderId"
            />
          </div>
        </div>

        <v-alert
          class="mt-6 text-left fade-in-up delay-4"
          variant="tonal"
          rounded="lg"
          type="success"
          icon="mdi-email-check-outline"
        >
          A confirmation email and booking voucher will be sent shortly.
        </v-alert>

        <div
          class="d-flex flex-wrap justify-center ga-4 mt-8 fade-in-up delay-5"
        >
          <v-btn
            size="large"
            flat
            rounded="lg"
            color="brandColor2"
            prepend-icon="mdi-ticket-confirmation-outline"
            @click="viewOrder"
          >
            View Booking
          </v-btn>

          <v-btn
            size="large"
            flat
            rounded="lg"
            color="brandColor2"
            variant="outlined"
            prepend-icon="mdi-home-outline"
            @click="$router.push('/')"
          >
            Back Home
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "@/services/api";

const route = useRoute();
const router = useRouter();
const copied = ref(false);
const checking = ref(true);

const viewOrder = () => {
  router.replace({
    name: "Order",
    params: {
      order_id: route.params.order_id,
    },
  });
};

// Landing here (deep link, reload, back button) doesn't guarantee the
// payment actually succeeded — confirm with the server before showing
// the confirmation UI, and bounce to the failed page if it didn't.
const verifyPayment = async () => {
  try {
    const { data } = await apiClient.get(
      `/v1/orders/${route.params.order_id}/verify-payment`,
    );

    if (data.data.payment_status !== "paid") {
      router.replace({
        name: "OrderFailed",
        params: { order_id: route.params.order_id },
      });
      return;
    }
  } catch (err) {
    console.error(err);
  } finally {
    checking.value = false;
  }
};

onMounted(verifyPayment);

const copyOrderId = async () => {
  try {
    await navigator.clipboard.writeText(route.params.order_id);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  } catch (e) {
    // clipboard not available, ignore
  }
};
</script>

<style scoped>
.success-card {
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 24px 48px -28px rgba(0, 99, 0, 0.3);
  overflow: hidden;
}

/* Icon */

.success-icon-wrap {
  position: relative;
  width: 96px;
  height: 96px;
}

.success-icon-wrap::before,
.success-icon-wrap::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgb(var(--v-theme-success));
  opacity: 0;
  animation: success-ping 1.2s ease-out 0.9s;
}

.success-icon-wrap::after {
  animation-delay: 1.15s;
}

.success-check__fill {
  fill: rgb(var(--v-theme-successLight1));
  transform-origin: center;
  animation: success-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.success-check__ring {
  fill: none;
  stroke: rgb(var(--v-theme-success));
  stroke-width: 3;
  stroke-dasharray: 227;
  stroke-dashoffset: 227;
  animation: success-draw 0.6s ease-out 0.15s forwards;
}

.success-check__tick {
  fill: none;
  stroke: rgb(var(--v-theme-success));
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 51;
  stroke-dashoffset: 51;
  animation: success-draw 0.35s ease-out 0.65s forwards;
}

/* Order ID */

.order-id-box {
  border: 1px dashed rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  background: rgb(var(--v-theme-successLight2));
  padding: 16px;
}

/* Entrance */

.fade-in-up {
  opacity: 0;
  animation: fade-in-up 0.5s ease-out forwards;
}

.delay-1 {
  animation-delay: 0.7s;
}
.delay-2 {
  animation-delay: 0.8s;
}
.delay-3 {
  animation-delay: 0.9s;
}
.delay-4 {
  animation-delay: 1s;
}
.delay-5 {
  animation-delay: 1.1s;
}

/* Keyframes */

@keyframes success-pop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes success-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes success-ping {
  0% {
    transform: scale(0.85);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.9);
    opacity: 0;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
