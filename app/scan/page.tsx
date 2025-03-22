"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  CircularProgress,
  Avatar,
  Grid,
  Slider,
  LinearProgress,
  IconButton,
} from "@mui/material";
import {
  CameraAlt,
  Warning,
  GridView,
  FormatListBulleted,
  Info,
  ErrorOutline,
} from "@mui/icons-material";

// Mock product data
const productData = {
  name: "Whole Grain Cereal",
  servingSize: "100g",
  calories: 245,
  macros: {
    protein: { value: 12, color: "#2e7d32" },
    carbs: { value: 28, color: "#1976d2" },
    fat: { value: 9, color: "#d32f2f" },
  },
  vitamins: [
    { name: "Vitamin A", value: "15%" },
    { name: "Vitamin C", value: "25%" },
    { name: "Calcium", value: "20%" },
    { name: "Iron", value: "10%" },
  ],
  ingredients:
    "Whole Grain Wheat, Sugar, Contains 2% or less of: Soy Lecithin, Natural Flavor, Tree Nuts, Salt, Vitamins and Minerals",
  allergens: ["Soy", "Tree Nuts"],
};

// Recent scans data
const recentScans = [
  {
    id: 1,
    name: "Product 1",
    calories: 240,
    protein: 12,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    name: "Product 2",
    calories: 240,
    protein: 12,
    image: "/placeholder.svg?height=60&width=60",
  },
];

export default function BarcodeScanner() {
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [servingMultiplier, setServingMultiplier] = useState(1);

  // Simulate scanning process
  const handleScan = () => {
    setScanning(true);

    // Simulate scan completion after 2 seconds
    setTimeout(() => {
      setScanning(false);
      setScanComplete(true);
    }, 2000);
  };

  // Reset to scanner view
  const resetScan = () => {
    setScanComplete(false);
  };

  // Handle serving size change
  const handleServingChange = (event: Event, newValue: number | number[]) => {
    setServingMultiplier(newValue as number);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ pb: 8, bgcolor: "#f5f5f7", minHeight: "100vh" }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "white",
          borderRadius: 0,
          p: 2,
          textAlign: "center",
          borderBottom: "1px solid #eee",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Nutrition Scanner
        </Typography>
      </Paper>

      {!scanComplete ? (
        // Scanner View
        <Box>
          {/* Scanner Area */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
              bgcolor: "white",
            }}
          >
            <Box
              sx={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                border: "2px solid #e3f2fd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  border: "2px solid #bbdefb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {scanning ? (
                  <CircularProgress size={60} />
                ) : (
                  <Box sx={{ color: "#90caf9", fontSize: 60 }}>
                    <svg
                      width="60"
                      height="60"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3,3 L8,3 L8,8 L3,8 L3,3 Z M10,3 L14,3 L14,8 L10,8 L10,3 Z M16,3 L21,3 L21,8 L16,8 L16,3 Z M3,10 L8,10 L8,14 L3,14 L3,10 Z M3,16 L8,16 L8,21 L3,21 L3,16 Z M10,16 L14,16 L14,21 L10,21 L10,16 Z M16,16 L21,16 L21,21 L16,21 L16,16 Z M16,10 L18,10 L18,14 L16,14 L16,10 Z M19,10 L21,10 L21,14 L19,14 L19,10 Z" />
                    </svg>
                  </Box>
                )}
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Position barcode here
            </Typography>
            <Button
              variant="contained"
              startIcon={<CameraAlt />}
              onClick={handleScan}
              disabled={scanning}
              sx={{
                bgcolor: "#2196f3",
                color: "white",
                borderRadius: 28,
                px: 4,
                py: 1.5,
                textTransform: "none",
                width: "90%",
                "&:hover": {
                  bgcolor: "#1976d2",
                },
              }}
            >
              {scanning ? "Scanning..." : "Scan Barcode or QR Code"}
            </Button>
          </Box>

          {/* Recent Scans */}
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Recent Scans
            </Typography>
            <Grid container spacing={2}>
              {recentScans.map((scan) => (
                <Grid item xs={6} key={scan.id}>
                  <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Avatar
                        src={scan.image}
                        variant="rounded"
                        sx={{ width: 40, height: 40 }}
                      />
                      <Box>
                        <Typography variant="subtitle2">{scan.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {scan.calories} cal • {scan.protein}g protein
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Feature Buttons */}
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <GridView sx={{ color: "#2196f3" }} />
                  <Typography variant="subtitle2">Compare Products</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Side by side comparison
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <FormatListBulleted sx={{ color: "#2196f3" }} />
                  <Typography variant="subtitle2">Nutrition Facts</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Detailed breakdown
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Info sx={{ color: "#2196f3" }} />
                  <Typography variant="subtitle2">Ingredients List</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Full ingredients
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <ErrorOutline sx={{ color: "#2196f3" }} />
                  <Typography variant="subtitle2">Allergen Check</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Identify allergens
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      ) : (
        // Scan Result View
        <Box>
          {/* Camera Button */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
              bgcolor: "white",
            }}
          >
            <IconButton
              sx={{
                bgcolor: "#2196f3",
                color: "white",
                width: 80,
                height: 80,
                mb: 1,
                "&:hover": {
                  bgcolor: "#1976d2",
                },
              }}
              onClick={resetScan}
            >
              <CameraAlt sx={{ fontSize: 32 }} />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              Tap to Scan
            </Typography>
          </Box>

          {/* Product Information */}
          <Paper sx={{ borderRadius: 2, overflow: "hidden", mb: 2 }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Product Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Serving Size: {productData.servingSize}
              </Typography>

              {/* Calories */}
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                {Math.round(productData.calories * servingMultiplier)}
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                >
                  calories
                </Typography>
              </Typography>

              {/* Macros */}
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={2}>
                  {Object.entries(productData.macros).map(
                    ([key, { value, color }]) => (
                      <Grid item xs={4} key={key}>
                        <Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min((value / 50) * 100, 100)}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              mb: 1,
                              bgcolor: "#f5f5f5",
                              "& .MuiLinearProgress-bar": {
                                bgcolor: color,
                              },
                            }}
                          />
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {Math.round(value * servingMultiplier)}g
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {key}
                          </Typography>
                        </Box>
                      </Grid>
                    )
                  )}
                </Grid>
              </Box>

              {/* Vitamins & Minerals */}
              <Typography variant="h6" sx={{ mb: 2 }}>
                Vitamins & Minerals
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {productData.vitamins.map((vitamin, index) => (
                  <Grid item xs={6} key={index}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">{vitamin.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {vitamin.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Ingredients */}
              <Typography variant="h6" sx={{ mb: 1 }}>
                Ingredients
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {productData.ingredients
                  .split(/(Soy Lecithin|Tree Nuts)/)
                  .map((part, i) => {
                    // Check if this part is an allergen
                    if (
                      productData.allergens.some((allergen) =>
                        part.includes(allergen)
                      )
                    ) {
                      return (
                        <span key={i} style={{ color: "#f44336" }}>
                          {part}
                        </span>
                      );
                    }
                    return <span key={i}>{part}</span>;
                  })}
              </Typography>

              {/* Allergens */}
              <Typography variant="h6" sx={{ mb: 1 }}>
                Allergens
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "#f44336",
                  mb: 3,
                }}
              >
                <Warning sx={{ mr: 1 }} />
                <Typography variant="body2" color="error">
                  Contains {productData.allergens.join(", ")}
                </Typography>
              </Box>

              {/* Adjust Serving */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="h6">Adjust Serving</Typography>
                  <Typography variant="body2">{servingMultiplier}x</Typography>
                </Box>
                <Slider
                  value={servingMultiplier}
                  onChange={handleServingChange}
                  min={0.5}
                  max={3}
                  step={0.1}
                  sx={{
                    color: "#2196f3",
                    "& .MuiSlider-thumb": {
                      width: 20,
                      height: 20,
                    },
                  }}
                />
              </Box>

              {/* Compare Button */}
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#2e7d32",
                  color: "white",
                  borderRadius: 2,
                  py: 1.5,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#1b5e20",
                  },
                }}
              >
                Compare Product
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Container>
  );
}
