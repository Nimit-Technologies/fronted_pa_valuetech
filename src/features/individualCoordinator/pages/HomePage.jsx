import React from "react";
import GreetingHeader from "@/components/shared/greetingHeader";
import { Button } from "@/components/ui/button";
import CoordinatorCard from "@/features/individualCoordinator/components/CoordinatorCard";
import useCaseSummary from "@/features/individualCoordinator/hooks/dashboard/useCaseSummary";

// The cards report what the case list can count for this coordinator: every
// case in scope, and how many are still live. The old "visit completed" and
// "visit pending" tiles came from the mock's hand-written meta and have no
// equivalent on the API — a case that has finished its visit moves on through
// reporting to close, so no single status answers "visit completed", and
// counting one lifecycle step would quietly drop everything past it.
const IndividualCoordinatorHome = () => {
  const { summary, loading, error, refresh } = useCaseSummary();

  // CoordinatorCard renders "—" for null, which is what a card should say
  // while it is loading or after a failed load.
  const value = (count) => (loading ? null : count);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <GreetingHeader />

      {error && !loading ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between"
        >
          <span>Couldn&apos;t load case counts: {error}</span>
          <Button type="button" variant="outline" size="sm" onClick={refresh}>
            Retry
          </Button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CoordinatorCard title="Total case" value={value(summary.total)} />
        <CoordinatorCard title="Active case" value={value(summary.active)} />
        <CoordinatorCard
          title="Finished case"
          value={value(summary.finished)}
        />
      </div>
    </div>
  );
};

export default IndividualCoordinatorHome;
