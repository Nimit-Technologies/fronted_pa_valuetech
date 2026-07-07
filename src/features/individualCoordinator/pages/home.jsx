import React from 'react'
import GreetingHeader from '@/components/shared/greetingHeader'
import CoordinatorCard from '@/features/individualCoordinator/components/coordinatorCard'
import { caseData } from '@/features/individualCoordinator/data/case/caseTable'

const IndividualCoordinatorHome = () => {
  const { total_cases, visit_completed } = caseData.meta;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <GreetingHeader />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CoordinatorCard title="Total case" value={total_cases} />
        <CoordinatorCard title="visit completed" value={visit_completed} />
        <CoordinatorCard
          title="visit pending"
          value={total_cases - visit_completed}
        />
      </div>
    </div>
  )
}

export default IndividualCoordinatorHome
