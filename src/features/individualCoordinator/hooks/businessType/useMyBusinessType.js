import AllBusinessTypesAPI from "@/features/individualCoordinator/services/businessType/allBusinessTypes";
import useSession from "@/features/auth/hooks/useSession";
import useReferenceList from "@/hooks/reference/useReferenceList";

const RESOURCE = "business-type";

const fetchBusinessTypes = async () => ({
  rows: (await AllBusinessTypesAPI())?.data ?? [],
});

// The business line this coordinator handles.
//
// The id is the session's — POST /case/create-case refuses any other with a
// 403, so it is not a choice the form offers. The list is read only to put a
// name next to it; if the name cannot be found (it sits on a later page of a
// branch with many business types) the form still submits the right id.
//
// Through the reference cache, because the whole list is fetched to resolve
// one label: without it, every mount of the create-case form pulled the list
// again for a string that had not changed. A failed read stays cosmetic — the
// id is what the create needs, so the form still works with no name.
const useMyBusinessType = () => {
  const { user } = useSession();
  const businessTypeId = user?.business_type_id ?? null;

  const { rows } = useReferenceList({
    resource: RESOURCE,
    fetcher: fetchBusinessTypes,
    // Nothing to look up without an id, and most roles have none.
    auto: Boolean(businessTypeId),
    errorMessage: "Failed to load business types",
  });

  const name = businessTypeId
    ? (rows.find((item) => item.id === businessTypeId)?.name ?? "")
    : "";

  return { businessTypeId, name };
};

export default useMyBusinessType;
