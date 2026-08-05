import SlotField from "./fields/SlotField.vue";
import GuestsField from "./fields/GuestsField.vue";
import QuantityField from "./fields/QuantityField.vue";
import DateField from "./fields/DateField.vue";
import PickupDateField from "./fields/PickupDateField.vue";
import ReturnDateField from "./fields/ReturnDateField.vue";
import PickupAndDropField from "./fields/PickupAndDropField.vue";
import DropLocationField from "./fields/DropLocationField.vue";
import TransferTypeField from "./fields/Transfertypefield.vue";
import PickupAndDropLocationField from "./fields/PickupAndDropLocationField.vue";

export default {
  date: DateField,
  slot: SlotField,
  guests: GuestsField,
  quantity: QuantityField,
  pickup_date: PickupDateField,
  return_date: ReturnDateField,
  pickup_and_drop_date: PickupAndDropField,
  drop_location: DropLocationField,
  transfer_type: TransferTypeField,
  pickup_and_drop_location: PickupAndDropLocationField,
};
