const FIELD_RULES = [
  { field: "name", label: "Bank name", maxLength: 50 },
  { field: "displayName", label: "Display bank name", maxLength: 100 },
  { field: "bankBranch", label: "Bank branch", maxLength: 100 },
  { field: "bankBranchCode", label: "Branch code", maxLength: 20 },
  { field: "gstNumber", label: "GST number", maxLength: 20 },
  { field: "city", label: "City", maxLength: 100 },
  { field: "district", label: "District", maxLength: 100 },
  { field: "state", label: "State", maxLength: 100 },
  { field: "country", label: "Country", maxLength: 100 },
];

const OPTIONAL_RULES = [
  { field: "lane", label: "Lane", maxLength: 200 },
  { field: "landmark", label: "Landmark", maxLength: 200 },
];

export const validateBankForm = (form) => {
  const errors = {};

  for (const { field, label, maxLength } of FIELD_RULES) {
    const value = String(form[field] ?? "").trim();

    if (!value) {
      errors[field] = `${label} is required`;
    } else if (value.length > maxLength) {
      errors[field] = `${label} must be at most ${maxLength} characters`;
    }
  }

  for (const { field, label, maxLength } of OPTIONAL_RULES) {
    const value = String(form[field] ?? "").trim();

    if (value.length > maxLength) {
      errors[field] = `${label} must be at most ${maxLength} characters`;
    }
  }

  const pinCode = String(form.pinCode ?? "").trim();
  if (!pinCode) {
    errors.pinCode = "Pin code is required";
  } else if (!/^\d{6}$/.test(pinCode)) {
    errors.pinCode = "Pin code must be exactly 6 digits";
  }

  return errors;
};
