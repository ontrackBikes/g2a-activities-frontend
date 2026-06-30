import SlotField from "./fields/SlotField.vue";
import GuestsField from "./fields/GuestsField.vue";
import DateField from "./fields/DateField.vue";
import PickupDateField from "./fields/PickupDateField.vue";
import ReturnDateField from "./fields/ReturnDateField.vue";

export default {
  date: DateField,
  slot: SlotField,
  guests: GuestsField,
  pickup_date: PickupDateField,
  return_date: ReturnDateField,
};
