import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { caseData } from "@/features/individualEngineer/data/case/caseTable";
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

const RequiredLabel = ({ children }) => (
  <label className="mb-2 flex items-center gap-1 text-sm font-medium capitalize text-foreground">
    {children}
    <span className="text-destructive text-base leading-none">*</span>
  </label>
);

const Section1 = forwardRef((_props, ref) => {
  const { id } = useParams();
  const caseItem = caseData.data.find((c) => c.id === id);

  const [caseInfo, setCaseInfo] = useState({
    file_number: caseItem?.file_number || "",
    customer_name: caseItem?.customer_name || "",
    customer_phone_number: caseItem?.customer_phone_number || "",
  });

  const handleChange = (key, value) => {
    setCaseInfo((prev) => ({ ...prev, [key]: value }));
  };

  const initiationAddressRef = useRef(null);
  const [siteAddress, setSiteAddress] = useState(() =>
    ADDRESS_FIELD_KEYS.reduce((acc, key) => ({ ...acc, [key]: "" }), {}),
  );
  const [sameAsInitiation, setSameAsInitiation] = useState(false);

  const handleSiteFieldChange = (key, value) => {
    setSiteAddress((prev) => ({ ...prev, [key]: value }));
  };

  const handleSameAsInitiationChange = (checked) => {
    setSameAsInitiation(checked);
    if (checked) {
      const initiationValues = initiationAddressRef.current?.getValues();
      if (initiationValues) setSiteAddress(initiationValues);
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

  if (!caseItem) {
    return (
      <div className="bg-card border border-border rounded-md py-12 shadow-sm text-center text-sm text-muted-foreground">
        Case not found.
      </div>
    );
  }

  const address = caseItem.address ?? {};

  return (
    <div className="bg-card border border-border rounded-none py-8 shadow-sm">
      <form id="case-form" className="w-full mx-auto  space-y-12 px-6">
        {/* Case Info */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <RequiredLabel>File Number</RequiredLabel>
            <Input
              value={caseInfo.file_number}
              onChange={(e) => handleChange("file_number", e.target.value)}
              className="h-11 w-full border-border text-foreground"
            />
          </div>

          <div>
            <RequiredLabel>Customer Name</RequiredLabel>
            <Input
              value={caseInfo.customer_name}
              onChange={(e) => handleChange("customer_name", e.target.value)}
              className="h-11 w-full border-border text-foreground"
            />
          </div>

          <div>
            <RequiredLabel>Customer Contact</RequiredLabel>
            <Input
              value={caseInfo.customer_phone_number}
              onChange={(e) =>
                handleChange("customer_phone_number", e.target.value)
              }
              className="h-11 w-full border-border text-foreground"
            />
          </div>
        </div>

        {/* Address Sections */}
        <div className="space-y-10">
          <Address
            ref={initiationAddressRef}
            className="hidden"
            label="Address as per initiation"
            address={address}
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
});

Section1.displayName = "Section1";

export default Section1;
