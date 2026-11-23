import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Input } from "@/components/ui/input";
import Address from "@/features/individualEngineer/components/sheet/address";

const ADDRESS_FIELD_KEYS = [
  "city",
  "district",
  "state",
  "pin_code",
  "country",
  "lane",
  "landmark",
];

const emptySiteAddress = () =>
  ADDRESS_FIELD_KEYS.reduce((acc, key) => ({ ...acc, [key]: "" }), {});

const RequiredLabel = ({ children }) => (
  <label className="mb-2 flex items-center gap-1 text-sm font-medium capitalize text-foreground">
    {children}
    <span className="text-destructive text-base leading-none">*</span>
  </label>
);

const READ_ONLY_INPUT_CLASS =
  "h-11 w-full border-border bg-muted text-muted-foreground cursor-not-allowed";

// File number, customer name/contact and the initiation address come from the
// case the coordinator created; the engineer sees them but cannot change them.
// A saved report's values are shown first (the submitted view must show what
// was submitted) — the server writes these from the case on every save, so the
// saved copy is the case's, not the engineer's. The live task fills in before
// the first save.
const Section1 = forwardRef(
  ({ task, initialData = {}, showInitiationAddress = false }, ref) => {
    const address = task?.address ?? {};
    const caseInfo = {
      file_number: task?.file_number || "",
      customer_name: task?.customer_name || "",
      customer_phone_number: task?.customer_contact_number || "",
      ...initialData.caseInfo,
    };
    const initiationAddress = initialData.addressAsPerInitiation ?? address;

    const initiationAddressRef = useRef(null);
    const [siteAddress, setSiteAddress] = useState(
      () =>
        initialData.addressAsPerSite ??
        ADDRESS_FIELD_KEYS.reduce(
          (acc, key) => ({ ...acc, [key]: address[key] || "" }),
          {},
        ),
    );
    const [sameAsInitiation, setSameAsInitiation] = useState(
      initialData.sameAsInitiation ?? Boolean(task),
    );

    const handleSiteFieldChange = (key, value) => {
      setSiteAddress((prev) => ({ ...prev, [key]: value }));
    };

    // Checked (the default for a new report): the site address is pre-filled
    // from the initiation address. Unchecking means "the site differs", so the
    // pre-filled values are cleared for the engineer to enter the real ones.
    // Only the user's toggle clears — a saved draft that was already unchecked
    // keeps its site address on load.
    const handleSameAsInitiationChange = (checked) => {
      setSameAsInitiation(checked);
      if (checked) {
        const initiationValues = initiationAddressRef.current?.getValues();
        if (initiationValues) setSiteAddress(initiationValues);
      } else {
        setSiteAddress(emptySiteAddress());
      }
    };

    useImperativeHandle(ref, () => ({
      getData: () => ({
        caseInfo,
        addressAsPerInitiation: initiationAddressRef.current?.getValues(),
        addressAsPerSite: siteAddress,
        sameAsInitiation,
      }),
    }));

    if (!task) {
      return (
        <div className="bg-card border border-border rounded-md py-12 shadow-sm text-center text-sm text-muted-foreground">
          Task not found.
        </div>
      );
    }

    return (
      <div className="bg-card border border-border rounded-none py-8 shadow-sm">
        <form id="case-form" className="w-full mx-auto  space-y-12 px-6">
          {/* Case Info */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <RequiredLabel>File Number</RequiredLabel>
              <Input
                value={caseInfo.file_number}
                readOnly
                className={READ_ONLY_INPUT_CLASS}
              />
            </div>

            <div>
              <RequiredLabel>Customer Name</RequiredLabel>
              <Input
                value={caseInfo.customer_name}
                readOnly
                className={READ_ONLY_INPUT_CLASS}
              />
            </div>

            <div>
              <RequiredLabel>Customer Contact</RequiredLabel>
              <Input
                value={caseInfo.customer_phone_number}
                readOnly
                className={READ_ONLY_INPUT_CLASS}
              />
            </div>
          </div>

          {/* Address Sections */}
          <div className="space-y-10">
            <Address
              ref={initiationAddressRef}
              className={showInitiationAddress ? "" : "hidden"}
              label="Address as per initiation"
              address={initiationAddress}
              readOnly
            />
            <Address
              label="Address as per site"
              value={siteAddress}
              onChange={handleSiteFieldChange}
              checked={sameAsInitiation}
              onCheckedChange={handleSameAsInitiationChange}
            />
          </div>
        </form>
      </div>
    );
  },
);

Section1.displayName = "Section1";

export default Section1;
