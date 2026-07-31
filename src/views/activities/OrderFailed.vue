<template>
  <v-container class="py-12">
    <v-card
      max-width="620"
      class="mx-auto failed-card"
      rounded="xl"
      elevation="0"
      variant="outlined"
    >
      <v-card-text class="text-center py-10 px-6 px-sm-10">
        <div class="failed-icon-wrap mx-auto mb-6">
          <svg viewBox="0 0 80 80" width="96" height="96" class="failed-cross">
            <circle class="failed-cross__fill" cx="40" cy="40" r="34" />
            <circle class="failed-cross__ring" cx="40" cy="40" r="36" />
            <path class="failed-cross__mark" d="M26 26 L54 54 M54 26 L26 54" />
          </svg>
        </div>

        <div class="g2a-title-xl fade-in-up delay-1">Payment Failed</div>

        <div class="g2a-title-base text-greyDark mt-2 fade-in-up delay-2">
          We couldn't confirm your payment. Don't worry — your booking is
          still saved.
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
          type="warning"
          variant="tonal"
          rounded="lg"
          icon="mdi-bank-outline"
        >
          If money was deducted from your account, it will either be
          confirmed shortly or automatically refunded by your bank.
        </v-alert>

        <div
          class="d-flex flex-wrap justify-center ga-4 mt-8 fade-in-up delay-5"
        >
          <v-btn
            size="large"
            flat
            rounded="lg"
            color="brandColor2"
            prepend-icon="mdi-reload"
            @click="retryPayment"
          >
            Retry Payment
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

        <div
          class="g2a-title-sm text-greyDark mt-8 fade-in-up delay-5"
        >
          Still stuck?
          <a
            href="https://go2andaman.com/contact-us/"
            target="_blank"
            rel="noopener noreferrer"
            class="g2a-link"
            >Contact our support team</a
          >
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const copied = ref(false);

const retryPayment = () => {
  router.replace({
    name: "OrderDetails",
    params: {
      order_id: route.params.order_id,
    },
  });
};

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
.failed-card {
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 24px 48px -28px rgba(99, 0, 0, 0.3);
  overflow: hidden;
}

/* Icon */

.failed-icon-wrap {
  position: relative;
  width: 96px;
  height: 96px;
  animation: failed-shake 0.5s ease-out 0.75s;
}

.failed-cross__fill {
  fill: rgb(var(--v-theme-errorLight1));
  transform-origin: center;
  animation: failed-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.failed-cross__ring {
  fill: none;
  stroke: rgb(var(--v-theme-error));
  stroke-width: 3;
  stroke-dasharray: 227;
  stroke-dashoffset: 227;
  animation: failed-draw 0.6s ease-out 0.15s forwards;
}

.failed-cross__mark {
  fill: none;
  stroke: rgb(var(--v-theme-error));
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 80;
  stroke-dashoffset: 80;
  animation: failed-draw 0.35s ease-out 0.65s forwards;
}

/* Order ID */

.order-id-box {
  border: 1px dashed rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  background: rgb(var(--v-theme-errorLight2));
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

@keyframes failed-pop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes failed-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes failed-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-6px);
  }
  40% {
    transform: translateX(5px);
  }
  60% {
    transform: translateX(-3px);
  }
  80% {
    transform: translateX(2px);
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
