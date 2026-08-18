<template>
  <a
    v-if="isImage"
    :href="resolvedUrl"
    :data-fancybox="fancyboxGroup"
    :data-caption="document?.file_name"
    class="d-flex align-center"
    style="min-width: 0"
  >
    <v-img
      :src="resolvedUrl"
      :width="size"
      :height="size"
      cover
      rounded="lg"
      class="border mr-2 flex-shrink-0"
    />
    <!-- <span class="text-truncate g2a-link">{{
      document?.file_name || "View"
    }}</span> -->
  </a>

  <a
    v-else
    :href="resolvedUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="d-flex align-center"
    style="min-width: 0"
  >
    <div
      class="d-flex align-center justify-center border rounded-lg mr-2 flex-shrink-0"
      :style="{ width: `${size}px`, height: `${size}px` }"
    >
      <v-icon icon="mdi-file-pdf-box" size="24" color="error" />
    </div>
    <span class="text-truncate g2a-link">{{
      document?.file_name || "View"
    }}</span>
  </a>
</template>

<script setup>
import { computed } from "vue";

// Renders an uploaded KYC/infant document as an image thumbnail (opening in
// a Fancybox lightbox via the `data-fancybox` attribute - the parent is
// responsible for calling Fancybox.bind() on its own root with a selector
// matching `fancyboxGroup`) or, for non-image files (PDFs), a file icon
// linking out to a new tab instead.
const props = defineProps({
  document: {
    type: Object,
    default: () => ({}),
  },

  // Fancybox group name for this document's `data-fancybox` attribute -
  // documents sharing a group can be flipped through together in the
  // lightbox; give each a unique group to keep them opening standalone.
  fancyboxGroup: {
    type: String,
    default: "documents",
  },

  size: {
    type: [Number, String],
    default: 48,
  },
});

// Uploaded document URLs come back as paths relative to the API origin
// (e.g. "/uploads/documents/..."), not under the "/api" base the axios
// client uses, so resolve against the origin instead.
const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/api\/?$/,
  "",
);

const resolvedUrl = computed(() => {
  const url = props.document?.document_url;
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_ORIGIN}${url}`;
});

const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp|bmp|heic|heif)$/i;

const isImage = computed(() =>
  IMAGE_EXTENSIONS.test(
    props.document?.file_name || props.document?.document_url || "",
  ),
);
</script>
