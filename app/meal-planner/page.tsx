"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Container,
  Paper,
  Chip,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Skeleton,
} from "@mui/material";
import {
  Sync as SyncIcon,
  SmartToy as SmartToyIcon,
  Add as AddIcon,
} from "@mui/icons-material";

// Types
interface Meal {
  id: string;
  type: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image: string;
}

interface DayPlan {
  date: Date;
  meals: Meal[] | [];
}

// Sample data
const MEALS_DATA: Record<string, Meal[]> = {
  "2024-01-15": [
    {
      id: "b1",
      type: "Breakfast",
      name: "Greek Yogurt Bowl",
      calories: 320,
      protein: 18,
      carbs: 42,
      fat: 12,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "l1",
      type: "Lunch",
      name: "Quinoa Buddha Bowl",
      calories: 520,
      protein: 24,
      carbs: 68,
      fat: 18,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "d1",
      type: "Dinner",
      name: "Grilled Salmon",
      calories: 440,
      protein: 36,
      carbs: 28,
      fat: 22,
      image: "/placeholder.svg?height=200&width=400",
    },
  ],
  "2024-01-16": [
    {
      id: "b2",
      type: "Breakfast",
      name: "Avocado Toast",
      calories: 380,
      protein: 12,
      carbs: 48,
      fat: 16,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "l2",
      type: "Lunch",
      name: "Chicken Caesar Salad",
      calories: 450,
      protein: 32,
      carbs: 22,
      fat: 24,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "d2",
      type: "Dinner",
      name: "Vegetable Stir Fry",
      calories: 380,
      protein: 18,
      carbs: 42,
      fat: 14,
      image: "/placeholder.svg?height=200&width=400",
    },
  ],
  "2024-01-17": [],
  "2024-01-18": [],
  "2024-01-19": [
    {
      id: "b5",
      type: "Breakfast",
      name: "Protein Smoothie",
      calories: 340,
      protein: 24,
      carbs: 38,
      fat: 10,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "l5",
      type: "Lunch",
      name: "Mediterranean Wrap",
      calories: 480,
      protein: 22,
      carbs: 58,
      fat: 16,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "d5",
      type: "Dinner",
      name: "Eggplant Parmesan",
      calories: 520,
      protein: 24,
      carbs: 46,
      fat: 28,
      image: "/placeholder.svg?height=200&width=400",
    },
  ],
};

// Generate week days
const generateWeekDays = (): DayPlan[] => {
  const today = new Date(2024, 0, 15); // Monday, January 15, 2024 (fixed date for demo)
  const weekDays: DayPlan[] = [];

  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split("T")[0];

    weekDays.push({
      date,
      meals: MEALS_DATA[dateString] || null,
    });
  }

  return weekDays;
};

// Diet types
const dietTypes = ["All Meals", "Vegan", "Keto", "Budget"];

export default function MealPlanner() {
  const weekDays = generateWeekDays();
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selectedDiet, setSelectedDiet] = useState<string>("All Meals");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedMeals, setGeneratedMeals] = useState<Record<string, Meal[]>>(
    {}
  );

  // Format date for display
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  // Get day name
  const getDayName = (date: Date): string => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  // Handle day selection
  const handleDaySelect = (index: number) => {
    setSelectedDay(index);
  };

  // Handle diet selection
  const handleDietSelect = (diet: string) => {
    setSelectedDiet(diet);
  };

  // Generate meals for a day
  const handleGenerateMeals = () => {
    setIsGenerating(true);

    // Simulate API call with timeout
    setTimeout(() => {
      const currentDate = weekDays[selectedDay].date;
      const dateString = currentDate.toISOString().split("T")[0];

      // Sample generated meals
      const newMeals: Meal[] = [
        {
          id: `b-gen-${dateString}`,
          type: "Breakfast",
          name: "Oatmeal with Berries",
          calories: 310,
          protein: 14,
          carbs: 52,
          fat: 8,
          image: "/placeholder.svg?height=200&width=400",
        },
        {
          id: `l-gen-${dateString}`,
          type: "Lunch",
          name: "Lentil Soup with Bread",
          calories: 420,
          protein: 18,
          carbs: 64,
          fat: 12,
          image: "/placeholder.svg?height=200&width=400",
        },
        {
          id: `d-gen-${dateString}`,
          type: "Dinner",
          name: "Baked Chicken with Vegetables",
          calories: 480,
          protein: 38,
          carbs: 32,
          fat: 18,
          image: "/placeholder.svg?height=200&width=400",
        },
      ];

      setGeneratedMeals((prev) => ({
        ...prev,
        [dateString]: newMeals,
      }));

      setIsGenerating(false);
    }, 1500);
  };

  // Get meals for selected day
  const getMealsForSelectedDay = (): Meal[] | null => {
    const currentDate = weekDays[selectedDay].date;
    const dateString = currentDate.toISOString().split("T")[0];

    // Check if we have generated meals for this day
    if (generatedMeals[dateString]) {
      return generatedMeals[dateString];
    }

    // Otherwise return the original meals (or null)
    return weekDays[selectedDay].meals;
  };

  // Current day's meals
  const currentDayMeals = getMealsForSelectedDay();

  return (
    <Container
      maxWidth="sm"
      sx={{ pb: 8, bgcolor: "#f5f5f7", minHeight: "100vh" }}
    >
      {/* Header */}
      <Box
        sx={{
          pt: 2,
          pb: 1,
          px: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          MealMind
        </Typography>
        <Avatar src="/placeholder.svg?height=40&width=40" alt="User" />
      </Box>

      {/* AI Suggestion Button */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<SmartToyIcon />}
          sx={{
            bgcolor: "#f0e6ff",
            color: "#8a3ffc",
            textTransform: "none",
            borderRadius: 28,
            py: 1.5,
            "&:hover": {
              bgcolor: "#e6d9ff",
            },
          }}
        >
          Ask AI for meal suggestions
        </Button>
      </Box>

      {/* Diet Type Filters */}
      <Box
        sx={{ px: 2, mb: 3, display: "flex", gap: 1, overflowX: "auto", pb: 1 }}
      >
        {dietTypes.map((diet) => (
          <Chip
            key={diet}
            label={diet}
            onClick={() => handleDietSelect(diet)}
            sx={{
              bgcolor: selectedDiet === diet ? "#8a3ffc" : "#f5f5f7",
              color: selectedDiet === diet ? "white" : "text.primary",
              borderRadius: 16,
              px: 1,
              "&:hover": {
                bgcolor: selectedDiet === diet ? "#7b2ff2" : "#e0e0e0",
              },
            }}
          />
        ))}
      </Box>

      {/* Today's Meals */}
      <Box sx={{ px: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
          Today&apos;s Meals
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {formatDate(weekDays[selectedDay].date)}
        </Typography>

        {isGenerating ? (
          // Loading state
          <Box sx={{ mb: 3 }}>
            {[1, 2, 3].map((item) => (
              <Card
                key={item}
                sx={{ mb: 2, borderRadius: 2, overflow: "hidden" }}
              >
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" width="30%" height={30} />
                  <Skeleton variant="text" width="60%" height={30} />
                  <Skeleton variant="text" width="80%" height={24} />
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : currentDayMeals ? (
          // Meals display
          <Box>
            {currentDayMeals.map((meal) => (
              <Card
                key={meal.id}
                sx={{ mb: 2, borderRadius: 2, overflow: "hidden" }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={meal.image}
                  alt={meal.name}
                />
                <CardContent sx={{ pb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {meal.type}
                    </Typography>
                    <Button
                      startIcon={<SyncIcon />}
                      sx={{
                        color: "#8a3ffc",
                        textTransform: "none",
                        p: 0,
                      }}
                    >
                      Swap
                    </Button>
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {meal.name}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {meal.calories} kcal
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {meal.protein}g protein
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {meal.carbs}g carbs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {meal.fat}g fat
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          // No meals - generate option
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 6,
            }}
          >
            <Box sx={{ mb: 2, color: "#8a3ffc" }}>
              <AddIcon sx={{ fontSize: 48 }} />
            </Box>
            <Typography variant="h6" sx={{ mb: 1, textAlign: "center" }}>
              No meals planned for this day
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, textAlign: "center" }}
            >
              Generate a meal plan based on your preferences
            </Typography>
            <Button
              variant="contained"
              onClick={handleGenerateMeals}
              sx={{
                bgcolor: "#8a3ffc",
                color: "white",
                textTransform: "none",
                borderRadius: 28,
                px: 4,
                py: 1,
                "&:hover": {
                  bgcolor: "#7b2ff2",
                },
              }}
            >
              Generate Meal Plan
            </Button>
          </Box>
        )}
      </Box>

      {/* Week Plan */}
      <Box sx={{ px: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Week Plan
        </Typography>
        <Grid container spacing={1}>
          {weekDays.map((day, index) => (
            <Grid item xs={2.4} key={index}>
              <Paper
                elevation={0}
                onClick={() => handleDaySelect(index)}
                sx={{
                  p: 1,
                  textAlign: "center",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: selectedDay === index ? "#8a3ffc" : "#e0e0e0",
                  bgcolor: selectedDay === index ? "#f5f0ff" : "white",
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  "&:hover": {
                    borderColor: "#8a3ffc",
                  },
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {getDayName(day.date)}
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {day.date.getDate()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
