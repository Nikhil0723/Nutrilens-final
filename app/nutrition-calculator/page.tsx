"use client";

import { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import { AddCircle, Delete, Search } from "@mui/icons-material";

interface NutritionData {
  name: string;
  calories: number;
  serving_size_g: number;
  fat_total_g: number;
  fat_saturated_g: number;
  protein_g: number;
  sodium_mg: number;
  potassium_mg: number;
  cholesterol_mg: number;
  carbohydrates_total_g: number;
  fiber_g: number;
  sugar_g: number;
}

interface SelectedIngredient extends NutritionData {
  id: string;
}

export default function MealCalculator() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NutritionData[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_KEY = "2qWlMeegtqlWFPlWavAvyg==LNeJinKJ2suLEVbE";

  const searchNutrition = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://api.calorieninjas.com/v1/nutrition", {
        params: { query },
        headers: { "X-Api-Key": API_KEY }
      });
      setSearchResults(response.data.items || []);
      if (response.data.items.length === 0) {
        setError("No results found. Try a different search term.");
      }
    } catch (err) {
      setError("Failed to fetch nutrition data. Please try again.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = (ingredient: NutritionData) => {
    const newIngredient = {
      ...ingredient,
      id: `${ingredient.name}-${Date.now()}` // Create unique ID
    };
    setSelectedIngredients([...selectedIngredients, newIngredient]);
    setQuery("");
    setSearchResults([]);
  };

  const removeIngredient = (id: string) => {
    setSelectedIngredients(selectedIngredients.filter(item => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchNutrition();
  };

  const totalCalories = selectedIngredients.reduce(
    (sum, item) => sum + item.calories,
    0
  );
  const totalProtein = selectedIngredients.reduce(
    (sum, item) => sum + item.protein_g,
    0
  );
  const totalCarbs = selectedIngredients.reduce(
    (sum, item) => sum + item.carbohydrates_total_g,
    0
  );
  const totalFat = selectedIngredients.reduce(
    (sum, item) => sum + item.fat_total_g,
    0
  );

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Meal Nutrition Calculator
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for food (e.g., '1 apple', '100g chicken breast')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton 
                type="submit" 
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : <Search />}
              </IconButton>
            ),
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {searchResults.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Search Results
            </Typography>
            <List>
              {searchResults.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={item.name}
                    secondary={`${item.calories} cal | ${item.serving_size_g}g`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      color="primary"
                      onClick={() => addIngredient(item)}
                    >
                      <AddCircle />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {selectedIngredients.length > 0 && (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Meal Composition
              </Typography>
              <List>
                {selectedIngredients.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText
                      primary={item.name}
                      secondary={
                        <>
                          <span>{item.calories} cal</span>
                          <span> | {item.protein_g}g protein</span>
                          <span> | {item.serving_size_g}g</span>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => removeIngredient(item.id)}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Nutrition Summary
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Chip 
                  label={`${totalCalories} calories`}
                  color="primary"
                  variant="outlined"
                />
                <Chip 
                  label={`${totalProtein}g protein`}
                  color="success"
                  variant="outlined"
                />
                <Chip 
                  label={`${totalCarbs}g carbs`}
                  color="warning"
                  variant="outlined"
                />
                <Chip 
                  label={`${totalFat}g fat`}
                  color="error"
                  variant="outlined"
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 2 }}>
                {selectedIngredients[0] && (
                  <>
                    <NutritionDetail label="Sodium" value={`${selectedIngredients[0].sodium_mg}mg`} />
                    <NutritionDetail label="Potassium" value={`${selectedIngredients[0].potassium_mg}mg`} />
                    <NutritionDetail label="Cholesterol" value={`${selectedIngredients[0].cholesterol_mg}mg`} />
                    <NutritionDetail label="Fiber" value={`${selectedIngredients[0].fiber_g}g`} />
                    <NutritionDetail label="Sugar" value={`${selectedIngredients[0].sugar_g}g`} />
                    <NutritionDetail label="Saturated Fat" value={`${selectedIngredients[0].fat_saturated_g}g`} />
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}

function NutritionDetail({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight="medium">
        {value}
      </Typography>
    </Box>
  );
}