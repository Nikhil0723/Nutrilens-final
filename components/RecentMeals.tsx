import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

const meals = [
  { name: "Healthy Breakfast", kcal: 420, time: "8:30 AM", img: "/breakfast.jpg" },
  { name: "Grilled Chicken", kcal: 380, time: "12:45 PM", img: "/chicken.jpg" },
];

export default function RecentMeals() {
  return (
    <Box mt={2}>
      <Typography fontWeight={600} mb={1}>
        Recent Meals
      </Typography>
      <Box display="flex" gap={1}>
        {meals.map((meal) => (
          <Card key={meal.name} sx={{ width: "48%" }}>
            <CardMedia component="img" height="100" image={meal.img} />
            <CardContent>
              <Typography fontSize={14} fontWeight={600}>
                {meal.name}
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                {meal.kcal} kcal | {meal.time}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
