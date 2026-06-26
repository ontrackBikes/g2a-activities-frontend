<template>

  <component
    :is="component"
    :config="section.config"
  />

</template>

<script setup>
import { computed } from "vue";

import CustomerDetails from "./sections/CustomerDetails.vue";
import Participants from "./sections/Participants.vue";
import MedicalDeclaration from "./sections/MedicalDeclaration.vue";
import BikeDelivery from "./sections/BikeDelivery.vue";
import FerrySeatSelection from "./sections/FerrySeatSelection.vue";
import PaymentSummary from "./sections/PaymentSummary.vue";

const props = defineProps({

  section:Object

});

const registry = {

  customer_details:CustomerDetails,

  participants:Participants,

  medical_declaration:MedicalDeclaration,

  bike_delivery:BikeDelivery,

  ferry_seat_selection:FerrySeatSelection,

  payment:PaymentSummary

};

const component = computed(()=>{

  return registry[
      props.section.section
  ];

});
</script>