<template>
  <v-card ref="rootEl" rounded="lg" class="border" flat>
    <v-container class="py-4">
      <div class="g2a-title-xl">
        {{ config.title || "Infant Documents" }}
      </div>

      <div class="mt-1">
        {{
          config.description ||
          "Travelling with an infant? Let us know and share their documents."
        }}
      </div>
    </v-container>

    <v-divider />

    <v-container>
      <v-checkbox
        v-model="infantDocuments.has_infant"
        color="primary"
        density="compact"
        hide-details="auto"
        label="I'm travelling with an infant"
      />

      <template v-if="infantDocuments.has_infant">
        <div
          v-for="(doc, index) in infantDocuments.documents"
          :key="index"
          class="d-flex align-center justify-space-between border rounded-lg pa-3 mb-2 mt-4"
        >
          <DocumentPreview :document="doc" fancybox-group="infant-documents" />

          <v-btn
            variant="text"
            size="small"
            color="error"
            icon="mdi-close"
            @click="removeDocument(index)"
          />
        </div>

        <input
          ref="fileInputRef"
          type="file"
          accept="image/*,.pdf"
          class="d-none"
          @change="handleFileChange"
        />

        <v-btn
          variant="outlined"
          color="brandColor2"
          rounded="lg"
          block
          class="mt-2"
          :loading="uploading"
          prepend-icon="mdi-tray-arrow-up"
          @click="fileInputRef?.click()"
        >
          {{
            infantDocuments.documents.length
              ? "Add Another Document"
              : "Upload Documents"
          }}
        </v-btn>

        <div v-if="uploadError" class="text-error text-caption mt-1">
          {{ uploadError }}
        </div>
      </template>
    </v-container>
  </v-card>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { bookingStore } from "@/store/booking";
import apiClient from "@/services/api.js";
import DocumentPreview from "@/components/common/DocumentPreview.vue";

const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },

  quote: {
    type: Object,
    required: true,
  },
});

const booking = bookingStore;
const route = useRoute();

const rootEl = ref(null);

onMounted(() => {
  Fancybox.bind(rootEl.value?.$el, '[data-fancybox="infant-documents"]', {
    animated: true,
    dragToClose: true,
    Hash: false,
    placeFocusBack: false,
  });
});

onBeforeUnmount(() => {
  Fancybox.unbind(rootEl.value?.$el);
  Fancybox.close();
});

/*
|--------------------------------------------------------------------------
| Infant documents (submitted as form.infant_documents, kept separate from
| form.participants / form.kyc_per_passanger - optional, whole-booking)
|--------------------------------------------------------------------------
*/

const createInfantDocuments = () => ({
  has_infant: false,
  documents: [],
});

const infantDocuments = computed({
  get() {
    if (!booking.form.infant_documents) {
      booking.form.infant_documents = createInfantDocuments();
    }

    return booking.form.infant_documents;
  },

  set(value) {
    booking.form.infant_documents = value;
  },
});

/*
|--------------------------------------------------------------------------
| Document upload
|--------------------------------------------------------------------------
*/

const fileInputRef = ref(null);
const uploading = ref(false);
const uploadError = ref("");

watch(
  () => infantDocuments.value.has_infant,
  (hasInfant) => {
    if (!hasInfant) {
      infantDocuments.value.documents = [];
      uploadError.value = "";
    }
  },
);

const handleFileChange = async (event) => {
  const file = event.target.files?.[0];
  event.target.value = "";

  if (!file) return;

  uploading.value = true;
  uploadError.value = "";

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "name",
      `Infant Document ${infantDocuments.value.documents.length + 1}`,
    );

    const { data } = await apiClient.post(
      `/v1/booking-estimates/${route.params.estimate_id}/upload-kyc`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    const doc = data?.data || data || {};

    infantDocuments.value.documents.push({
      file_name: file.name,
      document_id: doc.id ?? doc.document_id ?? null,
      document_url: doc.url ?? doc.file_url ?? doc.document_url ?? null,
    });
  } catch (err) {
    uploadError.value =
      err.response?.data?.message ||
      err.message ||
      "Failed to upload document. Please try again.";
  } finally {
    uploading.value = false;
  }
};

const removeDocument = (index) => {
  infantDocuments.value.documents.splice(index, 1);
};
</script>
