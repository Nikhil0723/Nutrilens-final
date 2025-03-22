import { Box, Paper, Typography } from "@mui/material";
import CropFreeIcon from "@mui/icons-material/CropFree";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

const actions = [
  { label: "Scan Food", icon: <CropFreeIcon /> },
  { label: "Add Meal", icon: <RestaurantIcon /> },
  { label: "Meal Plans", icon: <ListAltIcon /> },
  { label: "Progress", icon: <FitnessCenterIcon /> },
];

export default function QuickActions() {
  return (
    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1.5} mt={2}>
      {actions.map((action) => (
        <Paper key={action.label} sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
          {action.icon}
          <Typography fontSize={14} mt={1}>
            {action.label}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
