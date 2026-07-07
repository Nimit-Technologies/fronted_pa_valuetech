import React from "react";
import { userProfileData } from "@/data/userProfile";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const GreetingHeader = () => {
  const user = userProfileData.data[0];
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex justify-between items-center bg-card p-2 md:p-6  shadow-md rounded-md border border-border">
      <h1 className="text-base font-bold text-chart-1">{today}</h1>
      <h1 className="text-base font-bold text-chart-1 capitalize">
        {getGreeting()}, {user?.first_name || "there"}!
      </h1>
    </div>
  );
};

export default GreetingHeader;
