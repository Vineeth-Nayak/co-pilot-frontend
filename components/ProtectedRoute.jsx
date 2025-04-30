"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <Box height="80vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress size={48} color="primary" />
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;
