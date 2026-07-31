<template>
  <v-card rounded="lg" flat
    class="g2a-expansion-panel"
    :class="{ open: isOpen, border }"
  >
    <button
      class="g2a-expansion-header"
      type="button"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <div class="g2a-expansion-title" :class="titleClass">
        <slot name="title">
          {{ title }}
        </slot>
      </div>

      <svg
        class="g2a-expansion-icon"
        :class="{ open: isOpen }"
        width="22"
        height="22"
        viewBox="0 0 24 24"
      >
        <path
          d="M7 10l5 5 5-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <div
      ref="body"
      class="g2a-expansion-wrapper"
    >
      <div class="g2a-expansion-body">
        <slot />
      </div>
    </div>
  </v-card>
</template>
<script setup>
import { ref, computed, watch, nextTick, onMounted } from "vue";

const titleSizeClasses = {
  lg: "g2a-title-lg",
  md: "g2a-title-md",
  sm: "g2a-title-sm",
  default: "g2a-title-base",
};

const props = defineProps({
  title: String,

  modelValue: {
    type: Boolean,
    default: false,
  },

  border: {
    type: Boolean,
    default: true,
  },

  titleSize: {
    type: String,
    default: "lg",
    validator: (value) => ["lg", "md", "sm", "default"].includes(value),
  },
});

const emit = defineEmits([
  "update:modelValue",
  "open",
  "close",
]);

const isOpen = ref(props.modelValue);
const body = ref(null);

const titleClass = computed(() => titleSizeClasses[props.titleSize]);

watch(
  () => props.modelValue,
  value => {
    isOpen.value = value;
  }
);

watch(isOpen, async value => {
  emit("update:modelValue", value);
  emit(value ? "open" : "close");

  await nextTick();
  animate();
});

onMounted(() => {
  animate(false);
});

function animate(animated = true) {
  if (!body.value) return;

  const el = body.value;

  if (!animated) {
    el.style.transition = "none";
  } else {
    el.style.transition =
      "height .38s cubic-bezier(.22,1,.36,1), opacity .3s ease";
  }

  if (isOpen.value) {
    el.style.height = el.scrollHeight + "px";
    el.style.opacity = "1";

    const removeHeight = () => {
      if (isOpen.value) {
        el.style.height = "auto";
      }
      el.removeEventListener("transitionend", removeHeight);
    };

    el.addEventListener("transitionend", removeHeight);
  } else {
    if (el.style.height === "auto") {
      el.style.height = el.scrollHeight + "px";
      void el.offsetHeight;
    }

    el.style.height = "0px";
    el.style.opacity = "0";
  }

  requestAnimationFrame(() => {
    el.style.transition =
      "height .38s cubic-bezier(.22,1,.36,1), opacity .3s ease";
  });
}

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>
<style scoped>
.g2a-expansion-panel {
  

  transition:
    border-color .25s ease,
    box-shadow .25s ease,
    transform .2s ease;
}


.g2a-expansion-header {
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 15px;

  transition: background .2s ease;
}



.g2a-expansion-title {
  flex: 1;
  text-align: left;
  font-weight: 600;
}

.g2a-expansion-icon {
  color: #6b7280;

  transition:
    transform .38s cubic-bezier(.22,1,.36,1),
    color .25s ease;
}

.g2a-expansion-icon.open {
  transform: rotate(180deg);
  color: #111827;
}

.g2a-expansion-wrapper {
  overflow: hidden;
  height: 0;
  opacity: 0;
}

.g2a-expansion-body {
  line-height: 1.65;
}
</style>