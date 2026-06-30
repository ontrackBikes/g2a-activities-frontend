export default function validateCheckout(booking) {
  const errors = [];

  const sections =
    booking.bookingTemplate?.booking_page_schema?.sections || [];

  for (const section of sections) {
    if (!section.required) continue;

    const fields = section.config?.fields || [];

    let source = {};

    switch (section.section) {
      case "customer_details":
        source = booking.form.customer || {};
        break;

      case "rental_details":
        source = booking.form.bike_delivery || {};
        break;

      case "medical_declaration":
        source = booking.form.medical || {};
        break;

      case "participants":
        source = booking.form.participants || [];
        break;

      default:
        source = booking.form;
    }

    for (const field of fields) {
      if (!field.required) continue;

      const value = source[field.field];

      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        errors.push({
          section: section.section,
          field: field.field,
          message: `${pretty(field.field)} is required.`,
        });
      }
    }
  }

  return errors;
}

function pretty(field) {
  return field
    .replaceAll("_", " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}