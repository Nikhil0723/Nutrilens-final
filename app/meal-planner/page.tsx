"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  IconButton,
  Divider,
  Box,
  useMediaQuery,
  useTheme,
  Alert,
  SelectChangeEvent,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Refresh,
} from "@mui/icons-material";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";

// Import the fetchItinerary function
import { fetchItinerary } from "./api/fetchItinerary"; // Adjust path as needed
import { GoogleGenerativeAI } from "@google/generative-ai";

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

const allergiesList = ["Dairy", "Gluten", "Nuts", "Shellfish", "Soy", "Eggs"];
const dietOptions = ["Vegetarian", "Vegan", "Keto", "Paleo", "Low-Carb"];

type MealType = {
  breakfast: string;
  lunch: string;
  dinner: string;
  preferences?: {
    diet: string;
    allergies: string[];
  };
};

type MealsState = Record<string, MealType>;

interface PreferencesType {
  diet: string;
  allergies: string[];
}

const MealPlanner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedDay, setSelectedDay] = useState(dayjs().format("YYYY-MM-DD"));
  const [meals, setMeals] = useState<MealsState>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [preferences, setPreferences] = useState<PreferencesType>({
    diet: "",
    allergies: [],
  });
  const [loading, setLoading] = useState(false);
  const [weekStart, setWeekStart] = useState(dayjs().startOf("week"));
  const [error, setError] = useState("");
  const [swappingMeal, setSwappingMeal] = useState<{
    day: string;
    mealType: string;
  } | null>(null);

  const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
    weekStart.add(i, "day")
  );

  useEffect(() => {
    const storedMeals = localStorage.getItem("meals");
    if (storedMeals) {
      try {
        setMeals(JSON.parse(storedMeals));
      } catch (e) {
        console.error("Failed to parse stored meals", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("meals", JSON.stringify(meals));
  }, [meals]);

  const handleWeekNavigation = (direction: "prev" | "next") => {
    setWeekStart((prev) =>
      direction === "prev" ? prev.subtract(7, "day") : prev.add(7, "day")
    );
  };

  const handleDayClick = (day: dayjs.Dayjs) => {
    const formattedDay = day.format("YYYY-MM-DD");
    setSelectedDay(formattedDay);
    if (!meals[formattedDay]) setOpenDialog(true);
  };

  const handlePreferenceChange = (
    event: SelectChangeEvent<string | string[]>
  ) => {
    const { name, value } = event.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: Array.isArray(value) ? value : value,
    }));
  };

  const generateFallbackMeal = (mealType?: string) => {
    let fallback = {
      breakfast: "",
      lunch: "",
      dinner: "",
    };

    // If swapping a specific meal, only generate for that type
    if (mealType) {
      const newMeal = generateSingleMeal(mealType);
      return { ...fallback, [mealType]: newMeal };
    }

    // Breakfast options
    if (preferences.allergies.includes("Eggs")) {
      fallback.breakfast =
        preferences.diet === "Vegan"
          ? "Oatmeal with almond milk and berries"
          : "Avocado toast with sunflower seeds";
    } else {
      fallback.breakfast =
        preferences.diet === "Vegan"
          ? "Chia pudding with coconut milk"
          : "Scrambled eggs with whole wheat toast";
    }

    // Lunch options
    if (preferences.diet === "Vegan") {
      fallback.lunch = "Lentil soup with gluten-free bread";
    } else if (preferences.diet === "Vegetarian") {
      fallback.lunch = "Quinoa salad with feta and vegetables";
    } else {
      fallback.lunch = "Grilled chicken with roasted vegetables";
    }

    // Dinner options
    if (preferences.diet === "Keto") {
      fallback.dinner = "Salmon with asparagus and cauliflower mash";
    } else if (preferences.diet === "Vegan") {
      fallback.dinner = "Chickpea curry with rice";
    } else {
      fallback.dinner = "Vegetable stir-fry with tofu";
    }

    return fallback;
  };

  const generateSingleMeal = (mealType: string) => {
    const options: Record<string, string[]> = {
      breakfast: [
        "Oatmeal with fruits",
        "Yogurt with granola",
        "Avocado toast",
        "Smoothie bowl",
        "Pancakes with maple syrup",
      ],
      lunch: [
        "Quinoa salad",
        "Grilled chicken wrap",
        "Vegetable soup",
        "Pasta primavera",
        "Burrito bowl",
      ],
      dinner: [
        "Salmon with vegetables",
        "Stir-fried tofu",
        "Beef stew",
        "Vegetable lasagna",
        "Shrimp tacos",
      ],
    };

    // Filter based on preferences
    let filteredOptions = [...options[mealType]].filter((option) => {
      // Check diet
      if (
        preferences.diet === "Vegan" &&
        (option.toLowerCase().includes("chicken") ||
          option.toLowerCase().includes("beef") ||
          option.toLowerCase().includes("shrimp") ||
          option.toLowerCase().includes("yogurt") ||
          option.toLowerCase().includes("salmon"))
      ) {
        return false;
      }
      if (
        preferences.diet === "Vegetarian" &&
        (option.toLowerCase().includes("chicken") ||
          option.toLowerCase().includes("beef") ||
          option.toLowerCase().includes("shrimp") ||
          option.toLowerCase().includes("salmon"))
      ) {
        return false;
      }
      // Check allergies
      for (const allergy of preferences.allergies) {
        if (option.toLowerCase().includes(allergy.toLowerCase())) {
          return false;
        }
      }
      return true;
    });

    // If no options left after filtering, provide a safe fallback
    if (filteredOptions.length === 0) {
      return generateFallbackSingleMeal(mealType);
    }
    return filteredOptions[Math.floor(Math.random() * filteredOptions.length)];
  };

  const generateFallbackSingleMeal = (mealType: string) => {
    const fallbackOptions = {
      breakfast: {
        default: "Oatmeal with fruits",
        vegan: "Chia pudding with berries",
        vegetarian: "Whole grain toast with avocado",
        keto: "Avocado and spinach omelet",
        paleo: "Mixed fruit bowl with nuts",
        lowCarb: "Greek yogurt with berries",
      },
      lunch: {
        default: "Mixed greens salad",
        vegan: "Hummus and vegetable wrap",
        vegetarian: "Quinoa bowl with roasted vegetables",
        keto: "Cauliflower rice with vegetables",
        paleo: "Sweet potato and vegetable hash",
        lowCarb: "Vegetable soup with leafy greens",
      },
      dinner: {
        default: "Vegetable stir-fry",
        vegan: "Lentil and vegetable curry",
        vegetarian: "Eggplant parmesan",
        keto: "Zucchini noodles with pesto",
        paleo: "Roasted vegetables with herbs",
        lowCarb: "Cauliflower crust pizza with vegetables",
      },
    };

    const dietKey = preferences.diet
      ? preferences.diet.toLowerCase().replace("-", "")
      : "default";

    return (
      fallbackOptions[mealType as keyof typeof fallbackOptions][
        dietKey as keyof (typeof fallbackOptions)[typeof mealType]
      ] || fallbackOptions[mealType as keyof typeof fallbackOptions].default
    );
  };

  const generateMeal = async (options?: { day: string; mealType?: string }) => {
    const targetDay = options?.day || selectedDay;
    const mealType = options?.mealType;
    if (!targetDay) return;
  
    setLoading(true);
    setError("");
    setSwappingMeal(mealType ? { day: targetDay, mealType } : null);
  
    try {
      const genAI = new GoogleGenerativeAI("AIzaSyB-2vOKWlzqb-G0GmhL0nEx7kqplpCnWFE");
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });
  
      const dietPrompt = preferences.diet ? `${preferences.diet} diet` : "any diet";
      const allergyPrompt = preferences.allergies.length > 0 
        ? `avoiding ${preferences.allergies.join(", ")}`
        : "no allergy restrictions";
      const mealTypePrompt = mealType 
        ? `a ${mealType} meal`
        : "breakfast, lunch and dinner meals";
  
      const prompt = `Generate ${mealTypePrompt} for ${dietPrompt} ${allergyPrompt}.
        Never include ${preferences.allergies.length > 0 ? preferences.allergies.join(", ") : "any allergens"}.
        Respond ONLY with this plain JSON format (no markdown, no code blocks, just the raw JSON):
        {
          "breakfast": "meal suggestion",
          "lunch": "meal suggestion",
          "dinner": "meal suggestion"
        }`;
  
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
  
      // Clean the response before parsing
      let cleanedText = text.trim();
      
      // Remove markdown code blocks if present
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.slice(7);
      }
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.slice(3);
      }
      if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.slice(0, -3);
      }
      
      // Parse the cleaned response
      let generatedMeals;
      try {
        generatedMeals = JSON.parse(cleanedText);
      } catch (e) {
        console.error("Failed to parse AI response:", e, "Text was:", cleanedText);
        // Fallback to local generation if AI fails
        generatedMeals = generateFallbackMeal(mealType);
      }
  
      // Update the meals state
      if (mealType) {
        // Update single meal
        setMeals(prev => ({
          ...prev,
          [targetDay]: {
            ...prev[targetDay],
            [mealType]: generatedMeals[mealType],
            preferences
          }
        }));
      } else {
        // Update all meals for the day
        setMeals(prev => ({
          ...prev,
          [targetDay]: {
            ...generatedMeals,
            preferences
          }
        }));
      }
  
    } catch (error) {
      console.error("Error generating meal:", error);
      setError("Failed to generate meal. Using fallback options.");
      // Fallback to local generation
      const fallbackMeals = generateFallbackMeal(mealType);
      if (mealType) {
        setMeals(prev => ({
          ...prev,
          [targetDay]: {
            ...prev[targetDay],
            [mealType]: fallbackMeals[mealType as keyof typeof fallbackMeals],
            preferences
          }
        }));
      } else {
        setMeals(prev => ({
          ...prev,
          [targetDay]: {
            ...fallbackMeals,
            preferences
          }
        }));
      }
    } finally {
      setLoading(false);
      if (!mealType) {
        setOpenDialog(false);
      }
    }
  };

  const handleSwapMeal = (day: string, mealType: string) => {
    setSwappingMeal({ day, mealType });
    generateMeal({ day, mealType });
  };

  return (
    <Box
      sx={{
        p: isMobile ? 1 : 3,
        maxWidth: 1200,
        margin: "0 auto",
        pb: isMobile ? 8 : 3,
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: isMobile ? 2 : 4,
          gap: 2,
        }}
      >
        <Typography variant={isMobile ? "h6" : "h5"}>
          Weekly Meal Planner
        </Typography>
        <IconButton
          onClick={() => setOpenDialog(true)}
          size={isMobile ? "small" : "medium"}
        >
          <Settings fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      </Box>
      {/* Week Navigation */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: isMobile ? 1 : 2,
        }}
      >
        <IconButton
          onClick={() => handleWeekNavigation("prev")}
          size={isMobile ? "small" : "medium"}
        >
          <ChevronLeft fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
        <Typography variant={isMobile ? "body2" : "body1"} sx={{ mx: 1 }}>
          {weekStart.format("MMM D")} -{" "}
          {weekStart.add(6, "day").format("MMM D")}
        </Typography>
        <IconButton
          onClick={() => handleWeekNavigation("next")}
          size={isMobile ? "small" : "medium"}
        >
          <ChevronRight fontSize={isMobile ? "small" : "medium"} />
        </IconButton>
      </Box>
      {/* Horizontal scroll for days */}
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 1,
          pb: 1,
          mx: isMobile ? -1 : 0,
          px: isMobile ? 1 : 0,
          scrollSnapType: "x mandatory",
          "& > *": {
            scrollSnapAlign: "start",
            flexShrink: 0,
          },
        }}
      >
        {daysOfWeek.map((day) => {
          const formattedDate = day.format("YYYY-MM-DD");
          const hasMeal = !!meals[formattedDate];
          const isSelected = formattedDate === selectedDay;
          return (
            <Paper
              key={formattedDate}
              onClick={() => handleDayClick(day)}
              sx={{
                p: 1,
                minWidth: 70,
                cursor: "pointer",
                border: (theme) =>
                  `2px solid ${
                    isSelected ? theme.palette.primary.main : "transparent"
                  }`,
                bgcolor: hasMeal ? "action.selected" : "background.default",
                textAlign: "center",
              }}
            >
              <Typography variant="body2" fontWeight={isSelected ? 600 : 400}>
                {day.format("ddd")}
              </Typography>
              <Typography
                variant={isSelected ? "body1" : "body2"}
                fontWeight={isSelected ? 700 : 400}
              >
                {day.format("D")}
              </Typography>
            </Paper>
          );
        })}
      </Box>
      {/* Meal Display */}
      {selectedDay && meals[selectedDay] && (
        <Paper
          sx={{
            p: isMobile ? 1 : 2,
            mt: isMobile ? 2 : 3,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
            }}
          >
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              sx={{ mb: isMobile ? 1 : 0 }}
            >
              {dayjs(selectedDay).format("dddd, MMM D")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 0.5,
                flexWrap: "wrap",
                justifyContent: isMobile ? "flex-start" : "flex-end",
              }}
            >
              {meals[selectedDay].preferences?.diet && (
                <Chip
                  label={meals[selectedDay].preferences?.diet}
                  size="small"
                  sx={{ mb: isMobile ? 0.5 : 0 }}
                />
              )}
              {meals[selectedDay].preferences?.allergies.map((allergy) => (
                <Chip
                  key={allergy}
                  label={allergy}
                  size="small"
                  variant="outlined"
                  sx={{ mb: isMobile ? 0.5 : 0 }}
                />
              ))}
            </Box>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Grid container spacing={isMobile ? 1 : 2}>
            {["breakfast", "lunch", "dinner"].map((mealType) => (
              <Grid item xs={12} key={mealType} sx={{ mb: isMobile ? 1 : 0 }}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 1,
                    height: "100%",
                    borderLeft: isMobile
                      ? `4px solid ${theme.palette.primary.main}`
                      : "none",
                    position: "relative",
                  }}
                >
                  <CardContent
                    sx={{
                      p: isMobile
                        ? "8px 8px 8px 4px !important"
                        : "8px !important",
                      "&:last-child": {
                        pb: isMobile ? "8px !important" : "8px !important",
                      },
                      pr: isMobile ? 6 : 8,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={600}>
                      {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                    </Typography>
                    <Typography variant="body2">
                      {meals[selectedDay][mealType as keyof MealType]}
                    </Typography>
                  </CardContent>
                  <IconButton
                    onClick={() => handleSwapMeal(selectedDay, mealType)}
                    disabled={loading && swappingMeal?.mealType === mealType}
                    size="small"
                    sx={{
                      position: "absolute",
                      right: 4,
                      top: 4,
                      color: theme.palette.primary.main,
                    }}
                  >
                    {loading && swappingMeal?.mealType === mealType ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Refresh fontSize="small" />
                    )}
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
      {/* Preferences Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => !loading && setOpenDialog(false)}
        fullScreen={isMobile}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Meal Preferences</DialogTitle>
        <DialogContent
          sx={{
            minWidth: isMobile ? "auto" : 300,
            pt: isMobile ? 2 : 1,
          }}
        >
          <FormControl fullWidth sx={{ my: 1 }}>
            <InputLabel id="diet-label">Diet</InputLabel>
            <Select
              labelId="diet-label"
              name="diet"
              value={preferences.diet}
              onChange={handlePreferenceChange}
              size={isMobile ? "medium" : "small"}
              label="Diet"
            >
              <MenuItem value="">None</MenuItem>
              {dietOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel id="allergies-label">Allergies</InputLabel>
            <Select
              labelId="allergies-label"
              multiple
              name="allergies"
              value={preferences.allergies}
              onChange={handlePreferenceChange}
              input={
                <OutlinedInput
                  label="Allergies"
                  size={isMobile ? "medium" : "small"}
                />
              }
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      size={isMobile ? "medium" : "small"}
                    />
                  ))}
                </Box>
              )}
            >
              {allergiesList.map((allergy) => (
                <MenuItem key={allergy} value={allergy}>
                  {allergy}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions
          sx={{
            p: isMobile ? 2 : 1,
            pb: isMobile ? 3 : 1,
          }}
        >
          <Button
            onClick={() => setOpenDialog(false)}
            disabled={loading}
            size={isMobile ? "medium" : "small"}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => generateMeal()}
            disabled={loading}
            size={isMobile ? "medium" : "small"}
            startIcon={
              loading ? <CircularProgress size={isMobile ? 20 : 16} /> : null
            }
          >
            Generate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MealPlanner;
