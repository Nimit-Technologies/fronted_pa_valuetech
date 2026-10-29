import useSession from "@/features/auth/hooks/useSession";
import { IST_TIME_ZONE } from "@/constants/formatDate";

export const useGreetingUser = () => {
  const { user } = useSession();
  return user?.first_name ?? "";
};

// Read in Asia/Kolkata rather than from the viewer's clock. getHours() would
// greet by whatever timezone the device is set to, so a laptop left on a US
// timezone says "Good Evening" over breakfast in Noida.
const istHour = () =>
  Number.parseInt(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: IST_TIME_ZONE,
      hour: "2-digit",
      hourCycle: "h23",
    }).format(new Date()),
    10,
  );

export const greeting = () => {
  const hour = istHour();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

export const greetingDate = () =>
  new Date().toLocaleDateString("en-GB", {
    timeZone: IST_TIME_ZONE,
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
