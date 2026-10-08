export const normalizeBusiness = (rawBusiness) => {
  if (!rawBusiness) return null;

  const business = rawBusiness.data ?? rawBusiness;

  return {
    id: business.id,
    name: business.name ?? "",
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
