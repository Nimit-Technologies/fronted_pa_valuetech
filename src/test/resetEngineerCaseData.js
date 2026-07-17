import { caseData } from "@/features/individualEngineer/data/case/caseTable";

export function snapshotEngineerCaseData() {
  return JSON.parse(JSON.stringify(caseData));
}

export function restoreEngineerCaseData(snapshot) {
  caseData.data.length = 0;
  caseData.data.push(...snapshot.data);
  caseData.meta.total_cases = snapshot.meta.total_cases;
  caseData.meta.visit_completed = snapshot.meta.visit_completed;
  caseData.meta.report_submitted = snapshot.meta.report_submitted;
}
