<template>
  <div class="d-flex align-start justify-center py-4 px-2 flex-wrap">
    <template v-for="(label, index) in steps" :key="label">
      <div class="d-flex flex-column align-center" style="min-width: 110px">
        <v-avatar
          :size="40"
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
          <v-icon v-if="index < modelValue - 1" color="white" size="20">
            mdi-check
          </v-icon>
          <span
            v-else
            class="g2a-title-md"
            :class="index === modelValue - 1 ? 'text-brandColor2' : 'text-greyDark'"
          >
            {{ index + 1 }}
          </span>
        </v-avatar>

        <div
          class="mt-2 text-center g2a-text-14"
          :class="index <= modelValue - 1 ? '' : 'text-greyDark'"
        >
          {{ label }}
        </div>
      </div>

      <div
        v-if="index < steps.length - 1"
        class="flex-grow-1"
        style="
          height: 2px;
          margin-top: 19px;
          min-width: 24px;
          background-color: rgb(var(--v-theme-brandColor2));
        "
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
