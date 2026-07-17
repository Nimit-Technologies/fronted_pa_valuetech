import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import FormHeader from "@/features/individualEngineer/components/sheet/formHeader";

const floors = [
  "Basement",
  "Stilt",
  "Ground floor",
  "First floor",
  "Second floor",
  "Third floor",
  "Fourth floor & above",
  "Mezzanine",
];

const columns = [
  { key: "accommodation", label: "Accommodation" },
  { key: "carpetCovered", label: "Carpet / covered" },
  { key: "occupancy", label: "Occupancy" },
  { key: "purpose", label: "Purpose" },
];

const emptyRow = {
  accommodation: "",
  carpetCovered: "",
  occupancy: "",
  purpose: "",
};

const Step4 = forwardRef((_props, ref) => {
  const [floorData, setFloorData] = useState(() =>
    floors.reduce((acc, floor) => ({ ...acc, [floor]: { ...emptyRow } }), {}),
  );

  const handleChange = (floor, key, value) => {
    setFloorData((prev) => ({
      ...prev,
      [floor]: { ...prev[floor], [key]: value },
    }));
  };

  useImperativeHandle(ref, () => ({
    getData: () => floorData,
  }));

  return (
    <div className="bg-card p-5 space-y-10">
      <div className="space-y-6">
        <FormHeader>Floor wise : Built up area</FormHeader>

        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Floor</TableHead>
                {columns.map((col) => (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {floors.map((floor) => (
                <TableRow key={floor}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {floor}
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell className="md:min-w-xs" key={col.key}>
                      <Input
                        value={floorData[floor][col.key]}
                        onChange={(e) =>
                          handleChange(floor, col.key, e.target.value)
                        }
                        className="h-10 w-full"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
});

Step4.displayName = "Step4";

export default Step4;
