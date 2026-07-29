<template>
  <v-card rounded="lg" class="border" flat>
    <v-container class="py-2">
      <div class="g2a-title-xl">
        {{ config.title || "Customer Details" }}
      </div>
    </v-container>

    <v-divider />

    <v-container class="py-2">
      <v-row>
        <!-- Name -->
        <v-col cols="12" md="6">
          <v-text-field
            v-model="customer_details.first_name"
            placeholder="First Name"
            density="compact"
            variant="outlined"
            rounded="lg"
            hide-details="auto"
            :rules="[rules.required('First Name')]"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="customer_details.last_name"
            placeholder="Last Name"
            density="compact"
            variant="outlined"
            rounded="lg"
            hide-details="auto"
            :rules="[rules.required('Last Name')]"
          />
        </v-col>

        <!-- Primary phone -->
        <v-col cols="12" md="6">
          <v-row no-gutters>
            <v-col cols="5" sm="4">
              <v-select
                v-model="customer_details.country_code"
                :items="countryCodeList"
                :loading="countryListLoading"
                item-title="text"
                item-value="dialCode"
                placeholder="Code"
                density="compact"
                variant="outlined"
                rounded="lg"
                hide-details="auto"
                menu-icon=""
                :rules="[rules.required('Country Code')]"
              />
            </v-col>

            <v-col cols="7" sm="8">
              <v-text-field
                class="pl-2"
                v-model="customer_details.phone"
                placeholder="Mobile Number"
                prepend-inner-icon="mdi-phone"
                density="compact"
                variant="outlined"
                rounded="lg"
                hide-details="auto"
                inputmode="numeric"
                maxlength="15"
                @keydown="blockNonDigits"
                :rules="phoneRules(customer_details.country_code, true)"
              />
            </v-col>
          </v-row>
        </v-col>

        <!-- Alternate phone (optional) -->
        <v-col cols="12" md="6">
          <v-row no-gutters>
            <v-col cols="5" sm="4">
              <v-select
                v-model="customer_details.alternate_country_code"
                :items="countryCodeList"
                :loading="countryListLoading"
                item-title="text"
                item-value="dialCode"
                placeholder="Code"
                density="compact"
                variant="outlined"
                rounded="lg"
                hide-details="auto"
                menu-icon=""
              />
            </v-col>

            <v-col cols="7" sm="8">
              <v-text-field
              class="pl-2"
                v-model="customer_details.alternate_phone"
                placeholder="Alt. Mobile Number (optional)"
                prepend-inner-icon="mdi-phone"
                density="compact"
                variant="outlined"
                rounded="lg"
                hide-details="auto"
                inputmode="numeric"
                maxlength="15"
                @keydown="blockNonDigits"
                :rules="
                  phoneRules(customer_details.alternate_country_code, false)
                "
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="customer_details.email"
            placeholder="Email Address"
            prepend-inner-icon="mdi-email-outline"
            density="compact"
            variant="outlined"
            rounded="lg"
            hide-details="auto"
            :rules="emailRules"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="customer_details.country"
            placeholder="Country"
            prepend-inner-icon="mdi-earth"
            density="compact"
            variant="outlined"
            rounded="lg"
            hide-details="auto"
            :rules="[rules.required('Country')]"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
import { computed, watch, ref, onMounted } from "vue";
import { bookingStore } from "@/store/booking";
import countriesRaw from "@/store/RawData/countries.json";

const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
});

const booking = bookingStore;

const STORAGE_KEY = "g2a_customer_details_v1";

const countryListLoading = ref(true);

const defaultCustomer = () => ({
  first_name: "",
  last_name: "",
  country_code: null,
  phone: "",
  alternate_country_code: null,
  alternate_phone: null,
  email: "",
  country: "India",
});

/*
|--------------------------------------------------------------------------
| Local Storage
|--------------------------------------------------------------------------
*/

const loadCustomer = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return defaultCustomer();
    }

    const parsed = JSON.parse(raw);

    // Guard against corrupt / partially-shaped data from an older schema version.
    if (typeof parsed !== "object" || parsed === null) {
      return defaultCustomer();
    }

    return {
      ...defaultCustomer(),
      ...parsed,
    };
  } catch (err) {
    console.warn("Failed to parse saved customer details, resetting.", err);
    return defaultCustomer();
  }
};

let saveTimeout = null;

const saveCustomer = (customer) => {
  clearTimeout(saveTimeout);

  // Debounce writes so every keystroke doesn't hit localStorage.
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          first_name: customer.first_name,
          last_name: customer.last_name,
          country_code: customer.country_code,
          phone: customer.phone,
          alternate_country_code: customer.alternate_country_code,
          alternate_phone: customer.alternate_phone,
          email: customer.email,
          country: customer.country,
        }),
      );
    } catch (err) {
      console.warn("Failed to persist customer details.", err);
    }
  }, 300);
};

/*
|--------------------------------------------------------------------------
| Country / dial codes
|--------------------------------------------------------------------------
*/

const countryCodeList = ref([]);

onMounted(() => {
  try {
    countryCodeList.value = Object.entries(countriesRaw).map(([code, c]) => ({
      text: `${code} ${c.dialCode}`,
      value: code,
      dialCode: c.dialCode,
    }));
  } catch (err) {
    console.error("Failed to load country code list.", err);
    countryCodeList.value = [];
  } finally {
    countryListLoading.value = false;
  }
});

/*
|--------------------------------------------------------------------------
| Customer Details
|--------------------------------------------------------------------------
*/

const customer_details = computed({
  get() {
    if (!booking.form.customer_details) {
      booking.form.customer_details = loadCustomer();
    }

    return booking.form.customer_details;
  },

  set(value) {
    booking.form.customer_details = value;
  },
});

/*
|--------------------------------------------------------------------------
| Auto Save
|--------------------------------------------------------------------------
*/

watch(
  customer_details,
  (value) => {
    saveCustomer(value);
  },
  {
    deep: true,
  },
);

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

const rules = {
  required: (label) => (v) => !!v || `${label} is required`,
};

const emailRules = [
  (v) => !!v || "Email Address is required",
  (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
    "Please enter a valid email address",
];

// Country-specific mobile patterns; falls back to a generic length check
// for countries not listed here rather than assuming Indian format.
const MOBILE_PATTERNS = {
  IN: /^[6-9]\d{9}$/,
  US: /^\d{10}$/,
  CA: /^\d{10}$/,
  GB: /^\d{10}$/,
};

const phoneRules = (countryCode, isRequired) => [
  (v) => {
    if (!v) {
      return isRequired ? "Mobile Number is required" : true;
    }
    return true;
  },
  (v) => {
    if (!v) return true; // empty is handled by the rule above
    const pattern = MOBILE_PATTERNS[countryCode] || /^\d{6,14}$/;
    return pattern.test(v) || "Please enter a valid mobile number";
  },
];

const blockNonDigits = (e) => {
  // Allow control keys (backspace, delete, arrows, tab, paste shortcuts, etc.)
  if (e.ctrlKey || e.metaKey || e.key.length > 1) return;
  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
};
</script>
