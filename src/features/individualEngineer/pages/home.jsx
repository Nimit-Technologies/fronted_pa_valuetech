import React from "react";
import GreetingHeader from "@/components/shared/greetingHeader";
import { Button } from "@/components/ui/button";
import EngineerCard from "@/features/individualEngineer/components/engineerCard";
import useTaskSummary from "@/features/individualEngineer/hooks/dashboard/useTaskSummary";

const IndividualEngineerHome = () => {
  const { summary, loading, error, refresh } = useTaskSummary();

  // EngineerCard renders "—" for null, which is what a card should say while
  // it is loading or after a failed load.
  const value = (count) => (loading ? null : count);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <GreetingHeader />

      {error && !loading ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between"
        >
          <span>Couldn&apos;t load task counts: {error}</span>
          <Button type="button" variant="outline" size="sm" onClick={refresh}>
            Retry
          </Button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <EngineerCard title="Total Tasks" value={value(summary.total)} />
        <EngineerCard title="Active Tasks" value={value(summary.active)} />
        <EngineerCard
          title="Completed Tasks"
          value={value(summary.completed)}
        />
      </div>
    </div>
  );
};

export default IndividualEngineerHome;
