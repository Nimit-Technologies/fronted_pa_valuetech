import useSession from "@/features/auth/hooks/useSession";

export const useGreetingUser = () => {
  const { user } = useSession();
  return user?.first_name ?? "";
};

export const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

export const greetingDate = () => {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return today;
};
