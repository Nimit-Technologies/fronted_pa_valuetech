export const normalizeBank = (rawBank) => {
  if (!rawBank) return null;

  const bank = rawBank.data ?? rawBank;
  const address = bank.address ?? {};

  return {
    id: bank.id,
    name: bank.name ?? "",
    displayName: bank.display_name ?? "",
    bankBranch: bank.bank_branch ?? "",
    bankBranchCode: bank.bank_branch_code ?? "",
    gstNumber: bank.gst_number ?? "",
    isActive: bank.is_active ?? false,
    isDeleted: bank.is_deleted ?? Boolean(bank.deleted_at),
    branchId: bank.branch_id ?? bank.branch?.id ?? "",
    branchName: bank.branch?.name ?? "",
    address: {
      lane: address.lane ?? "",
      landmark: address.landmark ?? "",
      city: address.city ?? "",
      district: address.district ?? "",
      state: address.state ?? "",
      pinCode: address.pin_code ?? "",
      country: address.country ?? "",
    },
  };
};

export const normalizeBanks = (bankList) => {
  if (!Array.isArray(bankList)) return [];
  return bankList.map(normalizeBank);
};
