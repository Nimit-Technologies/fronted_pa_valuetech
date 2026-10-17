// Zod reports each failure with the path it came from, so a 400 from one of the
// strict schemas can be shown on the field that caused it instead of as a
// single toast: "file_number", or "address.city" for the nested object.
//
// Shared by the create and update case forms, which read the same issue shape
// off two endpoints that validate with the same schemas.
//
// Only the first issue per path is kept — a field with two problems shows the
// first, and showing both would need the field to render a list.
export const zodFieldErrors = (err) => {
  const issues = err?.response?.data?.errors;
  if (!Array.isArray(issues)) return {};

  return issues.reduce((acc, issue) => {
    const key = Array.isArray(issue.path)
      ? issue.path.join(".")
      : String(issue.path ?? "");
    if (key && !acc[key]) acc[key] = issue.message;
    return acc;
  }, {});
};
