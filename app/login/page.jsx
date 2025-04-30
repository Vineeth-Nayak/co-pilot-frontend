"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Container, Box, Typography, TextField, Button, Alert, Paper } from "@mui/material";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || "Login failed");
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="py-12">
      <Paper elevation={6} sx={{ mt: 8, p: 4, borderRadius: 2 }}>
        <Typography component="h1" variant="h4" align="center" fontWeight="bold" gutterBottom>
          CMS Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#115293" } }}
          >
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
