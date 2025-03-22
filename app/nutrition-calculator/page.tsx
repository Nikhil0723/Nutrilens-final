"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { AddCircle, Delete } from "@mui/icons-material";

interface Ingredient {
  name: string;
  calories: number;
  protein: number;
}

export default function MealCalculator() {
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>(
    []
  );

  const availableIngredients: Ingredient[] = [
    { name: "Apple", calories: 95, protein: 0.3 },
    { name: "Whole Wheat Bread", calories: 79, protein: 3.6 },
    { name: "Carrot", calories: 41, protein: 0.9 },
    { name: "Boiled Egg", calories: 68, protein: 5.5 },
  ];

  const addIngredient = (ingredient: Ingredient) => {
    setSelectedIngredients([...selectedIngredients, ingredient]);
  };

  const removeIngredient = (index: number) => {
    setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
  };

  const totalCalories = selectedIngredients.reduce(
    (sum, item) => sum + item.calories,
    0
  );
  const totalProtein = selectedIngredients.reduce(
    (sum, item) => sum + item.protein,
    0
  );

  return (
    <Box p={2} maxWidth={400} mx="auto">
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Meal Calculator
      </Typography>
      <TextField
        fullWidth
        placeholder="Search ingredients..."
        variant="outlined"
        margin="normal"
      />
      <List>
        {availableIngredients.map((ingredient, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={ingredient.name}
              secondary={`${ingredient.calories} cal`}
            />
            <ListItemSecondaryAction>
              <IconButton
                color="primary"
                onClick={() => addIngredient(ingredient)}
              >
                <AddCircle />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {selectedIngredients.length > 0 && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold">
              Selected Ingredients
            </Typography>
            <List>
              {selectedIngredients.map((ingredient, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={ingredient.name}
                    secondary={`${ingredient.calories} cal`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      color="error"
                      onClick={() => removeIngredient(index)}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      <Card sx={{ mt: 2, p: 2 }}>
        <Typography variant="h6" color="primary">
          {totalCalories} cal
        </Typography>
        <Typography variant="body2">Protein: {totalProtein}g</Typography>
      </Card>

      <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
        Calculate Nutrition
      </Button>
    </Box>
  );
}
