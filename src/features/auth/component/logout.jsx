import React from "react";
import { Button } from "@/components/ui/button";
import useLogout from "@/features/auth/hooks/useLogout";

const Logout = () => {
  const { logout, loading } = useLogout();

  return (
    <Button variant="destructive" size="sm" onClick={logout} disabled={loading}>
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
};

export default Logout;
