// Client-side checks run before a case is submitted.
//
// The server is still the authority — src/features/case/case.schema.js on the
// backend is strict and re-validates everything — so this deliberately mirrors
// only the rules a user can see being broken while they type, and says the same
// things the API says when it refuses. Anything subtler (uniqueness, scope,
// whether a bank belongs to the branch) is the server's to answer, because only
// it knows.
//
// Keys match the shape the forms already render errors from: a flat field name,
// or "address.<field>" for the nested object, which is exactly how zod reports
// the paths in a 400.
const MAX = { name: 50, place: 100 };

const required = (value, message) => (value.trim() ? null : message);

const digits = (value, length, message) =>
  new RegExp(`^\\d{${length}}$`).test(value.trim()) ? null : message;

const tooLong = (value, max, message) =>
  value.trim().length > max ? message : null;

// `fields` is the flat form state both case forms keep. `bank` and
// `businessTypeId` are passed separately because they are not text inputs; a
// form that cannot change them (the update form's business type) passes
// `skip` for the keys it does not own.
export const validateCaseFields = ({
  form,
  bank,
  businessTypeId,
  skip = [],
}) => {
  const errors = {};
  const set = (key, message) => {
    if (message && !errors[key] && !skip.includes(key)) errors[key] = message;
  };

  set("file_number", required(form.file_number, "File number is required"));
  set(
    "file_number",
    tooLong(
      form.file_number,
      MAX.name,
      `File number must be less than ${MAX.name} characters`,
    ),
  );

  set("banker_name", required(form.banker_name, "Banker name is required"));
  set(
    "banker_name",
    tooLong(
      form.banker_name,
      MAX.name,
      `Banker name must be less than ${MAX.name} characters`,
    ),
  );

  set(
    "customer_name",
    required(form.customer_name, "Customer name is required"),
  );
  set(
    "customer_name",
    tooLong(
      form.customer_name,
      MAX.name,
      `Customer name must be less than ${MAX.name} characters`,
    ),
  );

  set(
    "customer_contact_number",
    required(form.customer_contact_number, "Phone number is required"),
  );
  set(
    "customer_contact_number",
    form.customer_contact_number.trim()
      ? digits(
          form.customer_contact_number,
          10,
          "Phone number must be 10 digits",
        )
      : null,
  );

  set("case_type", required(form.case_type, "Case type is required"));
  set(
    "case_type",
    tooLong(
      form.case_type,
      MAX.name,
      `Case type must be less than ${MAX.name} characters`,
    ),
  );

  set("business_type_id", businessTypeId ? null : "Business type is required");
  set("bank_id", bank?.id ? null : "Bank is required");

  for (const [field, label] of [
    ["city", "City"],
    ["district", "District"],
    ["state", "State"],
  ]) {
    set(`address.${field}`, required(form[field], `${label} is required`));
    set(
      `address.${field}`,
      tooLong(
        form[field],
        MAX.place,
        `${label} must be less than ${MAX.place} characters`,
      ),
    );
  }

  set("address.pin_code", required(form.pin_code, "Pin code is required"));
  set(
    "address.pin_code",
    form.pin_code.trim()
      ? digits(form.pin_code, 6, "Pin code must be exactly 6 digits")
      : null,
  );

  return errors;
};
