"use client";

import { useState, useRef, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import { CameraAlt, Warning, Close, Refresh, Info } from "@mui/icons-material";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import axios from "axios";

type ProductNutriments = {
  energy?: number;
  proteins?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sugars?: number;
  salt?: number;
};

type ProductData = {
  product: {
    product_name: string;
    brands?: string;
    serving_size?: string;
    nutriments?: ProductNutriments;
    nutrients?: {
      "vitamin-a"?: string;
      "vitamin-c"?: string;
      calcium?: string;
      iron?: string;
    };
    ingredients_text?: string;
    allergens?: string;
    image_url?: string;
    nova_group?: number;
    ecoscore_grade?: string;
  };
};

type RecentScan = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  image?: string;
  date: number;
};

export default function BarcodeScanner() {
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = new BrowserMultiFormatReader();

  // Load recent scans from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure client-side execution
      const savedScans = localStorage.getItem("recentScans");
      if (savedScans) {
        try {
          const parsedScans = JSON.parse(savedScans);
          const sortedScans = parsedScans
            .sort((a: RecentScan, b: RecentScan) => b.date - a.date)
            .slice(0, 10);
          setRecentScans(sortedScans);
        } catch (e) {
          console.error("Failed to parse recent scans", e);
        }
      }
    }
  }, []);

  // Save recent scans to localStorage
  useEffect(() => {
    if (recentScans.length > 0) {
      localStorage.setItem("recentScans", JSON.stringify(recentScans));
    }
  }, [recentScans]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      codeReader.reset();
    };
  }, []);

  const fetchProductData = async (barcode: string) => {
    try {
      setScanning(true);
      setError(null);

      const response = await axios.get(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );

      if (response.data.status === 0) {
        throw new Error("Product not found in database");
      }

      const data = response.data as ProductData;
      setProductData(data);

      // Add to recent scans if valid product
      if (data.product?.product_name) {
        const newScan: RecentScan = {
          id: barcode,
          name: data.product.product_name,
          calories: data.product.nutriments?.energy
            ? Math.round(data.product.nutriments.energy / 4.184)
            : 0,
          protein: data.product.nutriments?.proteins || 0,
          image: data.product.image_url,
          date: Date.now(),
        };

        setRecentScans((prev) => {
          const existingIndex = prev.findIndex((scan) => scan.id === barcode);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = newScan;
            return updated;
          }
          return [newScan, ...prev.slice(0, 9)]; // Keep only 10 most recent
        });
      }

      setScanComplete(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch product data"
      );
      setScanComplete(false);
    } finally {
      setScanning(false);
    }
  };

  const startCameraScan = async () => {
    setCameraOpen(true);
    setError(null);
    setCameraError(null);

    try {
      const devices = await codeReader.listVideoInputDevices();

      if (devices.length === 0) {
        throw new Error("No camera devices found");
      }

      const deviceId = devices[0].deviceId;

      if (videoRef.current) {
        setIsScanningActive(true);
        codeReader.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              setIsScanningActive(false);
              handleBarcodeDetected(result.getText());
            }
            if (err) {
              if (!(err instanceof DOMException)) {
                if (!(err instanceof NotFoundException)) {
                  setCameraError(
                    "Barcode scanning failed. Try adjusting the camera position."
                  );
                }
              }
            }
          }
        );
      }
    } catch (err) {
      setIsScanningActive(false);
      if (err instanceof Error) {
        if (err.message.includes("Permission denied")) {
          setCameraError(
            "Camera access was denied. Please enable camera permissions."
          );
        } else if (err.message.includes("No camera devices found")) {
          setCameraError("No camera found. Please check your device.");
        } else {
          setCameraError("Failed to initialize camera. Please try again.");
        }
      }
    }
  };

  const stopCameraScan = () => {
    try {
      codeReader.reset();
      setIsScanningActive(false);
    } catch (err) {
      console.error("Error stopping scanner:", err);
    }
    setCameraOpen(false);
  };

  const handleBarcodeDetected = (barcode: string) => {
    stopCameraScan();
    fetchProductData(barcode);
  };

  const retryScanning = () => {
    stopCameraScan();
    setTimeout(startCameraScan, 500);
  };

  const resetScan = () => {
    setScanComplete(false);
    setProductData(null);
  };

  const handleServingChange = (event: Event, newValue: number | number[]) => {
    setServingMultiplier(newValue as number);
  };

  const formatNutrient = (value?: number, unit?: string) => {
    if (value === undefined || isNaN(value)) return "N/A";
    const multipliedValue = value * servingMultiplier;
    return `${Math.round(multipliedValue * 10) / 10}${unit || ""}`;
  };

  const parseAllergens = (allergensString?: string) => {
    if (!allergensString) return [];
    return allergensString
      .split(",")
      .map((a) => a.replace("en:", "").trim())
      .filter((a) => a.length > 0);
  };

  const getNutritionScoreColor = (grade?: string) => {
    if (!grade) return "default";
    const gradeLower = grade.toLowerCase();
    if (gradeLower === "a") return "success";
    if (gradeLower === "b") return "info";
    if (gradeLower === "c") return "warning";
    if (gradeLower === "d" || gradeLower === "e") return "error";
    return "default";
  };

  const getNovaGroupInfo = (group?: number) => {
    if (!group) return null;
    return (
      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          Processing level:
        </Typography>
        <Chip
          label={`NOVA ${group}`}
          size="small"
          color={
            group === 1
              ? "success"
              : group === 2
              ? "info"
              : group === 3
              ? "warning"
              : "error"
          }
        />
        <IconButton size="small" sx={{ ml: 0.5 }}>
          <Info fontSize="small" />
        </IconButton>
      </Box>
    );
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        pb: 8,
        bgcolor: "#f5f5f7",
        minHeight: "100vh",
        position: "relative",
      }}
      disableGutters
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

      {/* Error Dialog */}
      <Dialog open={!!error} onClose={() => setError(null)}>
        <DialogContent>
          <Typography>{error}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setError(null)}>OK</Button>
        </DialogActions>
      </Dialog>

      {/* Camera Dialog */}
      <Dialog
        open={cameraOpen}
        onClose={stopCameraScan}
        fullWidth
        maxWidth="sm"
        fullScreen={window.innerWidth < 600}
      >
        <DialogContent
          sx={{
            p: 0,
            position: "relative",
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            bgcolor: "black",
          }}
        >
          <video
            ref={videoRef}
            style={{
              width: "100%",
              height: "auto",
              display: cameraError ? "none" : "block",
            }}
          />

          {cameraError && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
                textAlign: "center",
                flex: 1,
              }}
            >
              <Warning sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom color="white">
                Scanning Error
              </Typography>
              <Typography sx={{ mb: 3 }} color="white">
                {cameraError}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={retryScanning}
              >
                Try Again
              </Button>
            </Box>
          )}

          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              bgcolor: "rgba(0,0,0,0.5)",
              borderRadius: "50%",
            }}
          >
            <IconButton onClick={stopCameraScan} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </Box>

          {!cameraError && (
            <>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "70%",
                  height: "30%",
                  border: "4px solid rgba(255, 255, 255, 0.7)",
                  borderRadius: 2,
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  bottom: 20,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "white",
                    bgcolor: "rgba(0,0,0,0.5)",
                    display: "inline-block",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                  }}
                >
                  {isScanningActive ? "Scanning..." : "Point camera at barcode"}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>

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
              mb: 2,
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
              onClick={startCameraScan}
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
              {scanning ? "Scanning..." : "Scan Barcode"}
            </Button>

            {/* Demo button - remove in production */}
            <Button
              variant="outlined"
              onClick={() => fetchProductData("7622210449283")} // Oreo cookies
              disabled={scanning}
              sx={{
                mt: 2,
                borderRadius: 28,
                px: 4,
                py: 1.5,
                textTransform: "none",
                width: "90%",
              }}
            >
              Demo Scan (Oreo)
            </Button>
          </Box>

          {/* Recent Scans */}
          {recentScans.length > 0 && (
            <Box sx={{ p: 2, bgcolor: "white", borderRadius: 2, mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Recent Scans
              </Typography>
              <Grid container spacing={2}>
                {recentScans.map((scan) => (
                  <Grid item xs={6} key={scan.id}>
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        cursor: "pointer",
                        "&:hover": {
                          boxShadow: 2,
                        },
                      }}
                      onClick={() => fetchProductData(scan.id)}
                    >
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Avatar
                          src={scan.image}
                          variant="rounded"
                          sx={{ width: 40, height: 40 }}
                        />
                        <Box>
                          <Typography variant="subtitle2" noWrap>
                            {scan.name}
                          </Typography>
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
          )}

          {/* Tips Section */}
          <Paper sx={{ p: 2, mb: 2, bgcolor: "white" }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Scanning Tips
            </Typography>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li>
                <Typography variant="body2">Ensure good lighting</Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Hold steady about 6 inches away
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Center the barcode in the frame
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Clean your camera lens if blurry
                </Typography>
              </li>
            </ul>
          </Paper>
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
              mb: 2,
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
              Tap to Scan Again
            </Typography>
          </Box>

          {/* Product Information */}
          {productData?.product && (
            <Paper sx={{ borderRadius: 2, overflow: "hidden", mb: 2 }}>
              <Box sx={{ p: 3 }}>
                {/* Product Name and Image */}
                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                  {productData.product.image_url && (
                    <Avatar
                      src={productData.product.image_url}
                      variant="rounded"
                      sx={{ width: 80, height: 80, flexShrink: 0 }}
                    />
                  )}
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {productData.product.product_name || "Unknown Product"}
                    </Typography>
                    {productData.product.brands && (
                      <Typography variant="body2" color="text.secondary">
                        {productData.product.brands}
                      </Typography>
                    )}

                    {/* Nutrition Score */}
                    {productData.product.ecoscore_grade && (
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={`Eco-Score: ${productData.product.ecoscore_grade.toUpperCase()}`}
                          size="small"
                          color={getNutritionScoreColor(
                            productData.product.ecoscore_grade
                          )}
                          sx={{ mr: 1 }}
                        />
                      </Box>
                    )}

                    {/* Nova Group */}
                    {getNovaGroupInfo(productData.product.nova_group)}
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Serving Size: {productData.product.serving_size || "100g"}
                </Typography>

                {/* Calories */}
                <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
                  {productData.product.nutriments?.energy
                    ? Math.round(
                        (productData.product.nutriments.energy / 4.184) *
                          servingMultiplier
                      )
                    : "N/A"}
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {" "}
                    calories
                  </Typography>
                </Typography>

                {/* Macros */}
                <Box sx={{ mb: 4 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Box>
                        <LinearProgress
                          variant="determinate"
                          value={
                            productData.product.nutriments?.proteins
                              ? Math.min(
                                  (productData.product.nutriments.proteins /
                                    50) *
                                    100,
                                  100
                                )
                              : 0
                          }
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            mb: 1,
                            bgcolor: "#f5f5f5",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: "#2e7d32",
                            },
                          }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          {formatNutrient(
                            productData.product.nutriments?.proteins,
                            "g"
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Protein
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box>
                        <LinearProgress
                          variant="determinate"
                          value={
                            productData.product.nutriments?.carbohydrates
                              ? Math.min(
                                  (productData.product.nutriments
                                    .carbohydrates /
                                    100) *
                                    100,
                                  100
                                )
                              : 0
                          }
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            mb: 1,
                            bgcolor: "#f5f5f5",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: "#1976d2",
                            },
                          }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          {formatNutrient(
                            productData.product.nutriments?.carbohydrates,
                            "g"
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Carbs
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box>
                        <LinearProgress
                          variant="determinate"
                          value={
                            productData.product.nutriments?.fat
                              ? Math.min(
                                  (productData.product.nutriments.fat / 50) *
                                    100,
                                  100
                                )
                              : 0
                          }
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            mb: 1,
                            bgcolor: "#f5f5f5",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: "#d32f2f",
                            },
                          }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          {formatNutrient(
                            productData.product.nutriments?.fat,
                            "g"
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Fat
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Detailed Nutrition */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Detailed Nutrition
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2">Fiber</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatNutrient(
                            productData.product.nutriments?.fiber,
                            "g"
                          )}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2">Sugars</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatNutrient(
                            productData.product.nutriments?.sugars,
                            "g"
                          )}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2">Salt</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatNutrient(
                            productData.product.nutriments?.salt,
                            "g"
                          )}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Vitamins & Minerals */}
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Vitamins & Minerals
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Vitamin A</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {productData.product.nutrients?.["vitamin-a"] || "N/A"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Vitamin C</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {productData.product.nutrients?.["vitamin-c"] || "N/A"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Calcium</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {productData.product.nutrients?.calcium || "N/A"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Iron</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {productData.product.nutrients?.iron || "N/A"}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Ingredients */}
                {productData.product.ingredients_text && (
                  <>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Ingredients
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      {productData.product.ingredients_text}
                    </Typography>
                  </>
                )}

                {/* Allergens */}
                {productData.product.allergens && (
                  <>
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
                        Contains{" "}
                        {parseAllergens(productData.product.allergens).join(
                          ", "
                        )}
                      </Typography>
                    </Box>
                  </>
                )}

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
                    <Typography variant="body2">
                      {servingMultiplier}x
                    </Typography>
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
              </Box>
            </Paper>
          )}
        </Box>
      )}
    </Container>
  );
}
