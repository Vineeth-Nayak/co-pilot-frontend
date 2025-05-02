"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !loading && !user) {
      router.push("/login");
    }
  }, [user, loading, hasMounted, router]);

  if (!hasMounted || loading || !user) {
    return (
      <Box height="80vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress size={48} color="primary" />
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;
