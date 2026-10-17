const FIELD_RULES = [{ field: "name", label: "Business name", maxLength: 50 }];

export const validateBusinessForm = (form) => {
  const errors = {};

  for (const { field, label, maxLength } of FIELD_RULES) {
    const value = String(form[field] ?? "").trim();

    if (!value) {
      errors[field] = `${label} is required`;
    } else if (value.length > maxLength) {
      errors[field] = `${label} must be at most ${maxLength} characters`;
    }
  }

  return errors;
};
