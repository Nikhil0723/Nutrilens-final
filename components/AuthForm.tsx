"use client";

import { useState } from "react";
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
import {
  Google,
  Visibility,
  VisibilityOff,
  Email,
  Lock,
} from "@mui/icons-material";

export default function AuthPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px={2}
      sx={{ padding: "0" }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={4}
        boxShadow={3}
        borderRadius={3}
        maxWidth={380}
        width="100%"
        bgcolor="background.paper"
      >
        <Box mb={2} display="flex" justifyContent="center">
          <Button
            variant="contained"
            sx={{
              borderRadius: "50%",
              minWidth: 48,
              height: 48,
              backgroundColor: "#3b82f6",
            }}
          >
            +
          </Button>
        </Box>
        <Typography variant="h5" fontWeight={600}>
          Welcome
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in to continue
        </Typography>

        <Tabs
          value={tabIndex}
          onChange={(_, newValue) => setTabIndex(newValue)}
          variant="fullWidth"
          sx={{ mt: 2, mb: 3 }}
        >
          <Tab label="Login" sx={{ textTransform: "none", fontWeight: 500 }} />
          <Tab
            label="Sign Up"
            sx={{ textTransform: "none", fontWeight: 500 }}
          />
        </Tabs>

        <TextField
          fullWidth
          label="Email address"
          margin="normal"
          type="email"
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

        <Box textAlign="right" width="100%">
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer", mt: 1 }}
          >
            Forgot password?
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            py: 1.2,
            fontSize: "1rem",
            background: "linear-gradient(to right, #2563eb, #3b82f6)",
          }}
        >
          Sign In
        </Button>

        <Divider sx={{ my: 3, width: "100%" }}>Or continue with</Divider>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<Google />}
          sx={{
            mb: 2,
            py: 1.2,
            fontSize: "1rem",
            textTransform: "none",
            borderColor: "#d1d5db",
          }}
        >
          Continue with Google
        </Button>

        <Typography variant="caption" color="text.secondary" textAlign="center">
          By continuing, you agree to our{" "}
          <Typography
            component="span"
            color="primary"
            sx={{ cursor: "pointer", fontWeight: 500 }}
          >
            Terms of Service
          </Typography>{" "}
          and{" "}
          <Typography
            component="span"
            color="primary"
            sx={{ cursor: "pointer", fontWeight: 500 }}
          >
            Privacy Policy
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
}
