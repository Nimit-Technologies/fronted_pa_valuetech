import React from "react";
import {
  greeting,
  useGreetingUser,
  greetingDate,
} from "@/hooks/greeting/useGreeting";

const GreetingHeader = () => {
  const userName = useGreetingUser();

  return (
    <div className="flex justify-between items-center bg-card p-2 md:p-6  shadow-md rounded-md border border-border">
      <h1 className="text-base font-bold text-chart-1">{greetingDate()}</h1>
      <h1 className="text-base font-bold text-chart-1 capitalize">
        {greeting()}, {userName} !
      </h1>
    </div>
  );
};

export default GreetingHeader;
