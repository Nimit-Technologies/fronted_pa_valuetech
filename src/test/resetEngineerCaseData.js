import { caseData } from "@/features/individualEngineer/data/case/caseTable";

// The engineer screens are still on mock data and write to it in place — adding
// a remark mutates `caseData.data[i].remarks` — so a test that exercises one of
// those writes leaves the module changed for every test that runs after it.
// Snapshot before, restore after, and each test gets the same starting data.
//
// Restoring mutates the existing object rather than replacing it: the module
// exports one shared reference, and reassigning the binding is not possible
// from here anyway.
export const snapshotEngineerCaseData = () => structuredClone(caseData);

export const restoreEngineerCaseData = (snapshot) => {
  for (const key of Object.keys(caseData)) delete caseData[key];
  Object.assign(caseData, structuredClone(snapshot));
};
