import CustomerDetails from "./sections/CustomerDetails.vue";
import Participants from "./sections/Participants.vue";
import KycDetails from "./sections/KycDetails.vue";
import InfantDocuments from "./sections/InfantDocuments.vue";
import MedicalDeclaration from "./sections/MedicalDeclaration.vue";
import FerrySeatSelection from "./sections/FerrySeatSelection.vue";
import RentalDetails from "./sections/RentalDetails.vue";
import FlightDetails from "./sections/FlightDetails.vue";
import FerryDetails from "./sections/FerryDetails.vue";
import OptForPickupAndDrop from "./sections/OptForPickupAndDrop.vue";

export default {
  customer_details: {
    component: CustomerDetails,
    title: "Customer Details",
  },

  participants: {
    component: Participants,
    title: "Participants",
  },

  kyc_per_passanger: {
    component: KycDetails,
    title: "KYC Details",
  },

  infant_documents: {
    component: InfantDocuments,
    title: "Infant Documents",
  },

  medical_declaration: {
    component: MedicalDeclaration,
    title: "Medical Declaration",
  },

  rental_details: {
    component: RentalDetails,
    title: "Rental Details",
  },

  ferry_seat_selection: {
    component: FerrySeatSelection,
    title: "Seat Selection",
  },

  flight_details: {
    component: FlightDetails,
    title: "Flight Details",
  },

  ferry_details: {
    component: FerryDetails,
    title: "Ferry Details",
  },

  opt_for_pickup_and_drop: {
    component: OptForPickupAndDrop,
    title: "Pickup & Drop",
  },
};
