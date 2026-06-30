import CustomerDetails from "./sections/CustomerDetails.vue";
import Participants from "./sections/Participants.vue";
import MedicalDeclaration from "./sections/MedicalDeclaration.vue";
import BikeDelivery from "./sections/BikeDelivery.vue";
import FerrySeatSelection from "./sections/FerrySeatSelection.vue";

export default {
  customer_details: {
    component: CustomerDetails,
    title: "Customer Details",
  },

  participants: {
    component: Participants,
    title: "Participants",
  },

  medical_declaration: {
    component: MedicalDeclaration,
    title: "Medical Declaration",
  },

  rental_details: {
    component: BikeDelivery,
    title: "Rental Details",
  },

  ferry_seat_selection: {
    component: FerrySeatSelection,
    title: "Seat Selection",
  },
};