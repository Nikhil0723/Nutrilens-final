"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Tab,
  Tabs,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Google, Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";

export default function AuthPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const hasOnboarded = localStorage.getItem("hasOnboarded") === "true";

    if (isLoggedIn) {
      router.push(hasOnboarded ? "/" : "/onboarding");
    }
  }, []);

  const handleLogin = () => {
    const storedUser = localStorage.getItem(`user_${email}`);

    if (storedUser) {
      const user = JSON.parse(storedUser);

      if (user.password === password) {
        localStorage.setItem("isLoggedIn", "true");

        const hasOnboarded = localStorage.getItem("hasOnboarded") === "true";
        router.push(hasOnboarded ? "/" : "/onboarding"); // Redirect based on onboarding status
      } else {
        alert("Invalid password!");
      }
    } else {
      alert("User not found. Please sign up.");
    }
  };

  const handleSignup = () => {
    const existingUser = localStorage.getItem(`user_${email}`);

    if (existingUser) {
      alert("User already exists! Please log in.");
    } else {
      const userData = JSON.stringify({ email, password });
      localStorage.setItem(`user_${email}`, userData);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("hasOnboarded", "false"); // New user must complete onboarding
      router.push("/onboarding");
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" px={2}>
      <Box display="flex" flexDirection="column" alignItems="center" p={4} boxShadow={3} borderRadius={3} maxWidth={380} width="100%" bgcolor="background.paper">
        <Typography variant="h5" fontWeight={600}>Welcome</Typography>
        <Typography variant="body2" color="text.secondary">Sign in to continue</Typography>

        <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} variant="fullWidth" sx={{ mt: 2, mb: 3 }}>
          <Tab label="Login" sx={{ textTransform: "none", fontWeight: 500 }} />
          <Tab label="Sign Up" sx={{ textTransform: "none", fontWeight: 500 }} />
        </Tabs>

        <TextField
          fullWidth
          label="Email address"
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email color="action" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Password"
          margin="normal"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, py: 1.2, fontSize: "1rem" }}
          onClick={tabIndex === 0 ? handleLogin : handleSignup}
        >
          {tabIndex === 0 ? "Sign In" : "Sign Up"}
        </Button>
      </Box>
    </Box>
  );
}
