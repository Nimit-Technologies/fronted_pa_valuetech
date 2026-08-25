import React from "react";
// import { useSelector } from 'react-redux'

const greetingUser = () => {
  // const { user } = useSelector((state) => state.auth);
  // console.log("redux stored user : = " + user.first_name);
  // return user.first_name;
};

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

const greetingDate = () => {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return today;
};

export { greetingUser, greeting, greetingDate };
