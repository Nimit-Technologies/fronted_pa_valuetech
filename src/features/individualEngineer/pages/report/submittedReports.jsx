import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getMySubmittedReports from "@/features/individualEngineer/services/getMySubmittedReports";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

const SubmittedReports = () => {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCurrent = true;

    const loadReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getMySubmittedReports(page);
        if (isCurrent) setResult(response.data);
      } catch (requestError) {
        if (isCurrent) {
          setError(
            extractErrorMessage(
              requestError,
              "Failed to load submitted reports.",
            ),
          );
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    loadReports();
    return () => {
      isCurrent = false;
    };
  }, [page]);

  const reports = result?.reports ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-xl font-semibold text-foreground">
          Submitted Reports
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reports submitted for your assigned cases.
        </p>
      </header>

      <div className="overflow-hidden rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Case type</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Report</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center">
                  Loading submitted reports...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-destructive"
                  role="alert"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  No submitted reports found.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.fileNumber}</TableCell>
                  <TableCell>{report.customerName}</TableCell>
                  <TableCell>{report.caseType}</TableCell>
                  <TableCell>
                    {report.submittedAt
                      ? new Date(report.submittedAt).toLocaleString()
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/engineer/report/view/${report.caseId}`}>
                        View report
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Page {result?.page ?? page} of{" "}
            {Math.max(result?.totalPages ?? 0, 1)} ({result?.totalCount ?? 0}{" "}
            reports)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={!result?.hasPreviousPage || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((current) => current + 1)}
              disabled={!result?.hasNextPage || loading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmittedReports;
