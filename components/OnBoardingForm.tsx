"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

export default function OnBoardingForm() {
  const router = useRouter();

  // State for form inputs
  const [diet, setDiet] = useState("Non-Vegetarian");
  const [allergens, setAllergens] = useState<string[]>([]);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [activity, setActivity] = useState("Sedentary");

  const allergenOptions = ["Gluten", "Nuts", "Dairy", "Eggs", "Soy", "Shellfish"];
  const activityLevels = ["Sedentary", "Lightly Active", "Active", "Very Active"];

  // Load data from local storage when the component mounts
  useEffect(() => {
    const storedData = localStorage.getItem("onboardingData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setDiet(parsedData.diet);
      setAllergens(parsedData.allergens || []);
      setHeight(parsedData.height);
      setWeight(parsedData.weight);
      setActivity(parsedData.activity);
    }
  }, []);

  // Save data to local storage and redirect to "/"
  const handleSave = () => {
    const userData = { diet, allergens, height, weight, activity };
    localStorage.setItem("onboardingData", JSON.stringify(userData));
    router.push("/");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      px={2}
      sx={{ backgroundColor: "#f9f9f9" }}
    >
      <Paper
        elevation={3}
        sx={{ p: 3, width: "100%", maxWidth: 400, borderRadius: 3, background: "#fff" }}
      >
        <Typography variant="h6" textAlign="center" fontWeight={600} mb={2}>
          Health & Physical Details
        </Typography>

        {/* Height Input */}
        <TextField
          fullWidth
          label="Height (cm)"
          type="number"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          margin="dense"
        />

        {/* Weight Input */}
        <TextField
          fullWidth
          label="Weight (kg)"
          type="number"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          margin="dense"
        />

        {/* Dietary Preferences */}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Dietary Preference</InputLabel>
          <Select value={diet} onChange={(e) => setDiet(e.target.value)}>
            {["Non-Vegetarian", "Vegetarian", "Vegan"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Activity Level */}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Activity Level</InputLabel>
          <Select value={activity} onChange={(e) => setActivity(e.target.value)}>
            {activityLevels.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Allergens Selection */}
        <Typography variant="body1" mt={2} mb={1} fontWeight={500}>
          Allergies (Select if applicable)
        </Typography>
        <Grid container spacing={1}>
          {allergenOptions.map((allergen) => (
            <Grid item key={allergen}>
              <Button
                variant={allergens.includes(allergen) ? "contained" : "outlined"}
                onClick={() =>
                  setAllergens((prev) =>
                    prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen]
                  )
                }
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  px: 2,
                  backgroundColor: allergens.includes(allergen) ? "#3b82f6" : "transparent",
                  color: allergens.includes(allergen) ? "#fff" : "#000",
                  borderColor: "#d1d5db",
                }}
              >
                {allergen}
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* Save & Redirect Button */}
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, py: 1.5, fontSize: "1rem", backgroundColor: "#2563eb" }}
          onClick={handleSave}
        >
          Save Details
        </Button>
      </Paper>
    </Box>
  );
}
