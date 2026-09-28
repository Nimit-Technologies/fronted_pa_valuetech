const trim = (value) => String(value ?? "").trim();

const buildAddress = (form) => {
  const address = {
    city: trim(form.city),
    district: trim(form.district),
    state: trim(form.state),
    pin_code: trim(form.pinCode),
  };

  const country = trim(form.country);
  if (country) address.country = country;

  address.lane = trim(form.lane);
  address.landmark = trim(form.landmark);

  return address;
};

export const toCreateBankPayload = (form, branchId) => ({
  name: trim(form.name),
  display_name: trim(form.displayName),
  bank_branch: trim(form.bankBranch),
  bank_branch_code: trim(form.bankBranchCode),
  gst_number: trim(form.gstNumber),
  branch_id: branchId,
  address: buildAddress(form),
});

export const toUpdateBankPayload = (form) => ({
  name: trim(form.name),
  display_name: trim(form.displayName),
  bank_branch: trim(form.bankBranch),
  bank_branch_code: trim(form.bankBranchCode),
  gst_number: trim(form.gstNumber),
  address: buildAddress(form),
});
