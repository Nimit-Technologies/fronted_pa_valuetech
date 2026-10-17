export const normalizeBusiness = (rawBusiness) => {
  if (!rawBusiness) return null;

  const business = rawBusiness.data ?? rawBusiness;

  return {
    id: business.id,
    name: business.name ?? "",
    // The list/create/update endpoints include the parent branch as
    // { id, name }. branchId is kept on its own so the update form can
    // pre-select the dropdown even when the include is absent.
    branchId: business.branch_id ?? business.branch?.id ?? "",
    branch: business.branch
      ? { id: business.branch.id, name: business.branch.name ?? "" }
      : null,
    isActive: business.is_active ?? false,
    isDeleted: business.is_deleted ?? Boolean(business.deleted_at),
    createdAt: business.created_at ?? "",
    updatedAt: business.updated_at ?? "",
    deletedAt: business.deleted_at ?? null,
  };
};

export const normalizeBusinesses = (businessList) => {
  if (!Array.isArray(businessList)) return [];
  return businessList.map(normalizeBusiness);
};
