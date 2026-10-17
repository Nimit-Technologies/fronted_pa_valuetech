import { useEffect, useRef, useState } from "react";
import AllBusinessTypesAPI from "@/features/individualCoordinator/services/businessType/allBusinessTypes";
import useSession from "@/features/auth/hooks/useSession";

// The business line this coordinator handles.
//
// The id is the session's — POST /case/create-case refuses any other with a
// 403, so it is not a choice the form offers. The list is read only to put a
// name next to it; if the name cannot be found (it sits on a later page of a
// branch with many business types) the form still submits the right id.
const useMyBusinessType = () => {
  const { user } = useSession();
  const businessTypeId = user?.business_type_id ?? null;

  const [name, setName] = useState("");
  const latestRequest = useRef(0);

  useEffect(() => {
    if (!businessTypeId) return undefined;

    const requestId = ++latestRequest.current;

    void (async () => {
      try {
        const response = await AllBusinessTypesAPI();
        if (requestId !== latestRequest.current) return;
        const match = (response?.data || []).find(
          (item) => item.id === businessTypeId,
        );
        setName(match?.name ?? "");
      } catch {
        // A missing label is cosmetic: the id is what the create needs, and a
        // failed read here must not block the form.
        if (requestId === latestRequest.current) setName("");
      }
    })();

    return () => {
      latestRequest.current += 1;
    };
  }, [businessTypeId]);

  // Derived rather than reset in the effect: with no business type there is no
  // name to show, whatever a previous session left in state.
  return { businessTypeId, name: businessTypeId ? name : "" };
};

export default useMyBusinessType;
