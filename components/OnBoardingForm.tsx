"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Paper,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function OnBoardingForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [diet, setDiet] = useState("Non-Vegetarian");
  const [allergens, setAllergens] = useState<string[]>([]);

  const allergenOptions = ["Gluten", "Nuts", "Dairy", "Eggs", "Soy", "Shellfish"];

  const toggleAllergen = (allergen: string) => {
    setAllergens((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen]
    );
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      px={2}
      sx={{
        backgroundColor: "#f9f9f9",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          width: "100%",
          maxWidth: 360,
          borderRadius: 3,
          background: "#fff",
        }}
      >
        <Typography variant="subtitle1" textAlign="center" fontWeight={500} mb={2} color="text.secondary">
          Fill in your details
        </Typography>

        {/* Full Name */}
        <TextField fullWidth label="Enter your full name" margin="dense" variant="outlined" />

        {/* Email */}
        <TextField fullWidth label="Enter your email" margin="dense" variant="outlined" />

        {/* Password */}
        <TextField
          fullWidth
          label="Create a password"
          margin="dense"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Dietary Preferences */}
        <RadioGroup value={diet} onChange={(e) => setDiet(e.target.value)} sx={{ mt: 1 }}>
          {["Non-Vegetarian", "Vegetarian", "Vegan"].map((option) => (
            <FormControlLabel
              key={option}
              value={option}
              control={<Radio />}
              label={option}
              sx={{
                width: "100%",
                bgcolor: "#f8f8f8",
                p: 1,
                borderRadius: 2,
                mb: 1,
              }}
            />
          ))}
        </RadioGroup>

        {/* Allergens Selection */}
        <Grid container spacing={1} justifyContent="center" mt={1}>
          {allergenOptions.map((allergen) => (
            <Grid item key={allergen}>
              <Button
                variant={allergens.includes(allergen) ? "contained" : "outlined"}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  px: 2,
                  backgroundColor: allergens.includes(allergen) ? "#3b82f6" : "transparent",
                  color: allergens.includes(allergen) ? "#fff" : "#000",
                  borderColor: "#d1d5db",
                }}
                onClick={() => toggleAllergen(allergen)}
              >
                {allergen}
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* Submit Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            py: 1.5,
            fontSize: "1rem",
            backgroundColor: "#2563eb",
          }}
        >
          Create Account
        </Button>
      </Paper>
    </Box>
  );
}
