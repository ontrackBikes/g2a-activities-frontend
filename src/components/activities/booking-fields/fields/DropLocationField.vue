<template>
  <v-card class="border" variant="outlined" rounded="lg">
    <div class="pa-2 px-4">
      <div class="g2a-title-md mb-3">
        {{ field.label || "Drop Location" }}
      </div>

      <v-text-field
        :model-value="modelValue"
        placeholder="Enter drop location"
        variant="outlined"
        density="compact"
        rounded="lg"
        hide-details="auto"
        @update:model-value="updateValue"
      />
      <div class="mt-5 text-warning">
        Within city limit INR 450, outside city limits starts from INR 800.
      </div>
    </div>
  </v-card>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  field: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const updateValue = (value) => {
  emit("update:modelValue", value);
};
</script>