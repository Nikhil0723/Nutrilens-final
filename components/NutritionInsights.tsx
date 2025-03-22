import { Box, Paper, Typography } from "@mui/material";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import BarChartIcon from "@mui/icons-material/BarChart";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

const insights = [
  { label: "Protein Intake", value: "75g", sub: "15g above target", icon: <BarChartIcon /> },
  { label: "Water Intake", value: "1.8L", sub: "0.7L to go", icon: <WaterDropIcon /> },
  { label: "Vitamin Status", value: "Vitamin D", sub: "Consider supplements", icon: <HealthAndSafetyIcon /> },
];

export default function NutritionInsights() {
  return (
    <Box mt={2}>
      <Typography fontWeight={600} mb={1}>
        Nutrition Insights
      </Typography>
      {insights.map((item) => (
        <Paper key={item.label} sx={{ p: 2, mb: 1, display: "flex", alignItems: "center" }}>
          {item.icon}
          <Box ml={2}>
            <Typography fontSize={14} fontWeight={600}>
              {item.label}
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              {item.value} - {item.sub}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
