import { caseData } from "@/features/individualCoordinator/data/case/caseTable";

export function snapshotCaseData() {
  return JSON.parse(JSON.stringify(caseData));
}

export function restoreCaseData(snapshot) {
  caseData.data.length = 0;
  caseData.data.push(...snapshot.data);
  caseData.meta.total_cases = snapshot.meta.total_cases;
  caseData.meta.visit_completed = snapshot.meta.visit_completed;
}
