<template>
  <div class="stepper d-flex align-start justify-center flex-wrap">
    <template v-for="(label, index) in steps" :key="label">
      <div class="stepper-step d-flex flex-column align-center">
        <v-avatar
          class="stepper-avatar"
          :color="index < modelValue - 1 ? 'brandColor2' : 'transparent'"
          :style="
            index < modelValue - 1
              ? {}
              : {
                  border: `2px solid ${
                    index === modelValue - 1
                      ? 'rgb(var(--v-theme-brandColor2))'
                      : 'rgb(var(--v-theme-greyLight))'
                  }`,
                }
          "
        >
          <v-icon v-if="index < modelValue - 1" color="white" class="stepper-check-icon">
            mdi-check
          </v-icon>
          <span
            v-else
            class="stepper-number"
            :class="index === modelValue - 1 ? 'text-brandColor2' : 'text-greyDark'"
          >
            {{ index + 1 }}
          </span>
        </v-avatar>

        <div
          class="stepper-label mt-2 text-center"
          :class="index <= modelValue - 1 ? '' : 'text-greyDark'"
        >
          {{ label }}
        </div>
      </div>

      <div
        v-if="index < steps.length - 1"
        class="stepper-line flex-grow-1"
        style="background-color: rgb(var(--v-theme-brandColor2))"
      ></div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  // 1-based index of the currently active step
  modelValue: {
    type: Number,
    default: 1,
  },
  steps: {
    type: Array,
    default: () => ["Booking Details", "Checkout", "Payment"],
  },
});
</script>

<style scoped>
.stepper {
  padding: 16px 8px;
}

.stepper-step {
  min-width: 110px;
}

.stepper-avatar {
  width: 40px;
  height: 40px;
}

.stepper-check-icon {
  font-size: 20px;
}

.stepper-number {
  font-size: 16px;
  font-weight: 600;
}

.stepper-label {
  font-size: 14px;
}

.stepper-line {
  height: 2px;
  margin-top: 19px;
  min-width: 24px;
}

@media (max-width: 600px) {
  .stepper {
    padding: 12px 4px;
  }

  .stepper-step {
    min-width: 72px;
  }

  .stepper-avatar {
    width: 28px;
    height: 28px;
  }

  .stepper-check-icon {
    font-size: 14px;
  }

  .stepper-number {
    font-size: 12px;
  }

  .stepper-label {
    font-size: 11px;
  }

  .stepper-line {
    margin-top: 13px;
    min-width: 12px;
  }
}
</style>
