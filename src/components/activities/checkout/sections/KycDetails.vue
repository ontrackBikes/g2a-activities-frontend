<template>
  <v-card rounded="lg" class="border" flat>
    <v-container class="py-4">
      <div class="g2a-title-xl">
        {{ config.title || "KYC Details" }}
      </div>

      <div class="mt-1">
        {{
          config.description ||
          "Please provide a valid ID proof for every participant."
        }}
      </div>
    </v-container>

    <v-divider />

    <div>
      <div v-for="(kyc, index) in kycEntries" :key="index">
        <v-container>
          <div class="my-2 g2a-title-md">Participant {{ index + 1 }}</div>

          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="kyc.nationality"
                :items="nationalities"
                label="Select Nationality"
                density="compact"
                variant="outlined"
                rounded="lg"
                hide-details="auto"
                :rules="[(v) => !!v || 'Nationality is required']"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="kyc.id_proof_type"
                :items="idProofOptions"
                label="Select ID Proof"
                density="compact"
                variant="outlined"
                rounded="lg"
                hide-details="auto"
                :rules="[(v) => !!v || 'ID Proof is required']"
                @update:model-value="() => onIdProofTypeChange(kyc)"
              />
            </v-col>

            <v-col cols="12" :md="kyc.id_proof_type === 'passport' ? 6 : 12">
              <v-text-field
                v-model="kyc.id_number"
                :label="idNumberLabel(kyc.id_proof_type)"
                density="compact"
                variant="outlined"
                rounded="lg"
                hide-details="auto"
                :rules="[
                  (v) =>
                    !!v || `${idNumberLabel(kyc.id_proof_type)} is required`,
                ]"
              />
            </v-col>

            <v-col v-if="kyc.id_proof_type === 'passport'" cols="12" md="6">
              <v-text-field
                v-model="kyc.id_expiry_date"
                type="date"
                label="Passport Expiry Date"
                density="compact"
                variant="outlined"
                rounded="lg"
                hide-details="auto"
                :rules="[(v) => !!v || 'Expiry Date is required']"
              />
            </v-col>

            <v-col cols="12">
              <input
                :ref="(el) => setFileInputRef(el, index)"
                type="file"
                accept="image/*,.pdf"
                class="d-none"
                @change="(e) => handleFileChange(e, index)"
              />

              <v-btn
                v-if="!kyc.document?.document_id"
                variant="outlined"
                color="brandColor2"
                rounded="lg"
                block
                :disabled="!kyc.id_proof_type"
                :loading="uploadState[index]?.uploading"
                prepend-icon="mdi-tray-arrow-up"
                @click="fileInputRefs.get(index)?.click()"
              >
                Upload Documents
              </v-btn>

              <div
                v-else
                class="d-flex align-center justify-space-between border rounded-lg pa-3"
              >
                <div class="d-flex align-center">
                  <v-icon
                    icon="mdi-check-circle"
                    color="success"
                    size="20"
                    class="mr-2"
                  />
                  <span class="text-truncate">
                    {{ kyc.document.file_name }}
                  </span>
                </div>

                <v-btn
                  variant="text"
                  size="small"
                  color="error"
                  icon="mdi-close"
                  :loading="uploadState[index]?.uploading"
                  @click="removeDocument(kyc, index)"
                />
              </div>

              <div
                v-if="uploadState[index]?.error"
                class="text-error text-caption mt-1"
              >
                {{ uploadState[index].error }}
              </div>
            </v-col>
          </v-row>
        </v-container>
        <v-divider
          v-if="index + 1 < kycEntries.length"
          class="mt-2"
        ></v-divider>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { computed, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import { bookingStore } from "@/store/booking";
import apiClient from "@/services/api.js";

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

const nationalities = ["Indian", "Foreigner"];

const idProofOptions = [
  { title: "Passport", value: "passport" },
  { title: "Aadhaar Card", value: "aadhaar_card" },
  { title: "Voter Id", value: "voter_id" },
  { title: "Driving Licence", value: "driving_licence" },
  { title: "Other Valid Govt Id Proof", value: "other" },
];

const idProofLabel = (type) =>
  idProofOptions.find((option) => option.value === type)?.title || "ID Proof";

const idNumberLabel = (type) => {
  switch (type) {
    case "passport":
      return "Passport Number";
    case "aadhaar_card":
      return "Aadhaar Number";
    case "voter_id":
      return "Voter Id Number";
    case "driving_licence":
      return "Driving Licence Number";
    default:
      return "ID Number";
  }
};

const onIdProofTypeChange = (kyc) => {
  if (kyc.id_proof_type !== "passport") {
    kyc.id_expiry_date = null;
  }
};

/*
|--------------------------------------------------------------------------
| KYC entries (submitted as form.kyc_per_passanger, one per guest, kept
| separate from form.participants)
|--------------------------------------------------------------------------
*/

const createKycDocument = () => ({
  file_name: "",
  document_id: null,
  document_url: null,
});

const createKyc = () => ({
  nationality: "Indian",
  id_proof_type: "",
  id_number: "",
  id_expiry_date: null,
  document: createKycDocument(),
});

const kycEntries = computed({
  get() {
    if (!Array.isArray(booking.form.kyc_per_passanger)) {
      booking.form.kyc_per_passanger = [];
    }

    return booking.form.kyc_per_passanger;
  },

  set(value) {
    booking.form.kyc_per_passanger = value;
  },
});

watch(
  () => props.quote?.booking?.guests,
  (guests) => {
    const count = Number(guests || 1);

    if (!Array.isArray(booking.form.kyc_per_passanger)) {
      booking.form.kyc_per_passanger = [];
    }

    while (booking.form.kyc_per_passanger.length < count) {
      booking.form.kyc_per_passanger.push(createKyc());
    }

    booking.form.kyc_per_passanger.splice(count);
  },
  {
    immediate: true,
  },
);

/*
|--------------------------------------------------------------------------
| Document upload
|--------------------------------------------------------------------------
*/

const fileInputRefs = new Map();

const setFileInputRef = (el, index) => {
  if (el) {
    fileInputRefs.set(index, el);
  } else {
    fileInputRefs.delete(index);
  }
};

// Local-only upload progress/error state, kept out of booking.form so it
// never gets submitted as part of the order payload.
const uploadState = reactive({});

const handleFileChange = async (event, index) => {
  const file = event.target.files?.[0];
  event.target.value = "";

  if (!file) return;

  const kyc = kycEntries.value[index];
  if (!kyc) return;

  uploadState[index] = { uploading: true, error: "" };

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", idProofLabel(kyc.id_proof_type));

    const { data } = await apiClient.post(
      `/v1/booking-estimates/${route.params.estimate_id}/upload-kyc`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    const doc = data?.data || data || {};

    kyc.document = {
      file_name: file.name,
      document_id: doc.id ?? doc.document_id ?? null,
      document_url: doc.url ?? doc.file_url ?? doc.document_url ?? null,
    };

    uploadState[index] = { uploading: false, error: "" };
  } catch (err) {
    uploadState[index] = {
      uploading: false,
      error:
        err.response?.data?.message ||
        err.message ||
        "Failed to upload document. Please try again.",
    };
  }
};

const removeDocument = (kyc, index) => {
  kyc.document = createKycDocument();
  uploadState[index] = { uploading: false, error: "" };
};
</script>
