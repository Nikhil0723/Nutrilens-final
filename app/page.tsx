import ProgressCard from "@/components/ProgressCard";
import QuickActions from "@/components/QuickActions";
import RecentMeals from "@/components/RecentMeals";
import NutritionInsights from "@/components/NutritionInsights";
import { Avatar, Box, Typography, IconButton } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

export default function Home() {
  return (
    <Box sx={{ p: 2, maxWidth: 400, mx: "auto" }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <Avatar src="/avatar.jpg" sx={{ width: 48, height: 48, mr: 1.5 }} />
          <Box>
            <Typography variant="subtitle2">Hello, Alex</Typography>
            <Typography variant="body2" color="text.secondary">
              Let&apos;s track your nutrition
            </Typography>
          </Box>
        </Box>
        <IconButton>
          <NotificationsNoneIcon />
        </IconButton>
      </Box>

      {/* Sections */}
      <ProgressCard />
      <QuickActions />
      <RecentMeals />
      <NutritionInsights />

    </Box>
  );
}
