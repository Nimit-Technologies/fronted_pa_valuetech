import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Input } from "@/components/ui/input";
import FormHeader from "@/features/individualEngineer/components/sheet/formHeader";
import Locality from "@/features/individualEngineer/components/sheet/step2/locality";
import Colony from "@/features/individualEngineer/components/sheet/step2/colony";

import { sheetData } from "@/features/individualEngineer/data/sheet.js";
import Ownership from "@/features/individualEngineer/components/sheet/step2/ownership";
import Neighborhood from "@/features/individualEngineer/components/sheet/step2/neighborhood";
import Property from "@/features/individualEngineer/components/sheet/step2/property";
import Construction from "@/features/individualEngineer/components/sheet/step2/construction";
import Occupation from "@/features/individualEngineer/components/sheet/step2/occupation";
import RentedDetails from "@/features/individualEngineer/components/sheet/step2/rentedDetails";
const RequiredLabel = ({ children }) => (
  <label className="mb-2 flex items-center gap-1 text-sm font-medium capitalize text-foreground">
    {children}
    <span className="text-destructive text-base leading-none">*</span>
  </label>
);

const Step2 = forwardRef((_props, ref) => {
  const [personInfo, setPersonInfo] = useState({
    name: "",
    contactNumber: "",
    relation: "",
  });

  const handleChange = (key, value) => {
    setPersonInfo((prev) => ({ ...prev, [key]: value }));
  };

  const localityRef = useRef(null);
  const colonyRef = useRef(null);
  const ownershipRef = useRef(null);
  const neighborhoodRef = useRef(null);
  const propertyRef = useRef(null);
  const constructionRef = useRef(null);
  const occupationRef = useRef(null);
  const rentedDetailsRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getData: () => ({
      personInfo,
      locality: localityRef.current?.getData(),
      colony: colonyRef.current?.getData(),
      ownership: ownershipRef.current?.getData(),
      neighborhood: neighborhoodRef.current?.getData(),
      property: propertyRef.current?.getData(),
      construction: constructionRef.current?.getData(),
      occupation: occupationRef.current?.getData(),
      rentedDetails: rentedDetailsRef.current?.getData(),
    }),
  }));

  return (
    <div className=" bg-card p-5 space-y-10">
      <div className="space-y-6">
        <FormHeader>Person meet at the site</FormHeader>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <RequiredLabel>Pearson Name</RequiredLabel>
            <Input
              value={personInfo.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="h-11 w-full"
            />
          </div>

          <div>
            <RequiredLabel>Pearson contact number</RequiredLabel>
            <Input
              value={personInfo.contactNumber}
              onChange={(e) => handleChange("contactNumber", e.target.value)}
              className="h-11 w-full"
            />
          </div>

          <div>
            <RequiredLabel>relation with client</RequiredLabel>
            <Input
              value={personInfo.relation}
              onChange={(e) => handleChange("relation", e.target.value)}
              className="h-11 w-full"
            />
          </div>
        </div>
      </div>

      <Locality ref={localityRef} data={sheetData.locality} />
      <Colony ref={colonyRef} data={sheetData.colony} />
      <Ownership ref={ownershipRef} data={sheetData.ownership} />
      <Neighborhood ref={neighborhoodRef} data={sheetData.neighborhood} />
      <Property ref={propertyRef} data={sheetData.property} />
      <Construction ref={constructionRef} data={sheetData.construction} />
      <Occupation ref={occupationRef} data={sheetData.occupation} />

      <RentedDetails ref={rentedDetailsRef} data={sheetData.rentedDetails} />
    </div>
  );
});

Step2.displayName = "Step2";

export default Step2;
