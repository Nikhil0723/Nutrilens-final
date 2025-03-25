"use client"

import {
  Box,
  Typography,
  Container,
  Avatar,
  IconButton,
  Grid,
  Paper,
  LinearProgress,
  Card,
  CardContent,
  styled,
} from "@mui/material"
import {
  QrCodeScanner as QrCodeIcon,
  Restaurant as RestaurantIcon,
  CalendarViewWeek as PlanIcon,
  Timeline as ProgressIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material"

// Custom styled components
const ProgressBar = styled(LinearProgress)(() => ({
  height: 8,
  borderRadius: 5,
  backgroundColor: "rgba(255, 255, 255, 0.3)",
  "& .MuiLinearProgress-bar": {
    backgroundColor: "white",
  },
}))

const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: "none",
  border: "1px solid",
  borderColor: theme.palette.divider,
  borderRadius: theme.spacing(2),
}))



export default function NutritionTracker() {

  return (
    <Container maxWidth="sm" sx={{ pb: 10, pt: 2 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar src="/placeholder.svg?height=40&width=40" alt="User" />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Hello, Alex
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Let&apos;s track your nutrition
            </Typography>
          </Box>
        </Box>
        <IconButton>
          <NotificationsIcon />
        </IconButton>
      </Box>

      {/* Today's Progress Card */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: "#4CAF50",
          color: "white",
          p: 3,
          borderRadius: 4,
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Today&apos;s Progress
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={5}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "50%",
                width: 120,
                height: 120,
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  1,248
                </Typography>
                <Typography variant="body2">kcal left</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={7}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2">Protein</Typography>
                <Typography variant="body2">65/120g</Typography>
              </Box>
              <ProgressBar variant="determinate" value={54} />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2">Carbs</Typography>
                <Typography variant="body2">180/250g</Typography>
              </Box>
              <ProgressBar variant="determinate" value={72} />
            </Box>

            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2">Fat</Typography>
                <Typography variant="body2">45/70g</Typography>
              </Box>
              <ProgressBar variant="determinate" value={64} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Feature Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <FeatureCard>
            <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4CAF50",
                    border: "1px solid",
                    borderColor: "#E0E0E0",
                    borderRadius: 2,
                    p: 1,
                    mb: 1,
                  }}
                >
                  <QrCodeIcon />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Scan Food
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Scan barcode for info
                </Typography>
              </Box>
            </CardContent>
          </FeatureCard>
        </Grid>

        <Grid item xs={6}>
          <FeatureCard>
            <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4CAF50",
                    border: "1px solid",
                    borderColor: "#E0E0E0",
                    borderRadius: 2,
                    p: 1,
                    mb: 1,
                  }}
                >
                  <RestaurantIcon />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Add Meal
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Log your meal
                </Typography>
              </Box>
            </CardContent>
          </FeatureCard>
        </Grid>

        <Grid item xs={6}>
          <FeatureCard>
            <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4CAF50",
                    border: "1px solid",
                    borderColor: "#E0E0E0",
                    borderRadius: 2,
                    p: 1,
                    mb: 1,
                  }}
                >
                  <PlanIcon />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Meal Plans
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View weekly plan
                </Typography>
              </Box>
            </CardContent>
          </FeatureCard>
        </Grid>

        <Grid item xs={6}>
          <FeatureCard>
            <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4CAF50",
                    border: "1px solid",
                    borderColor: "#E0E0E0",
                    borderRadius: 2,
                    p: 1,
                    mb: 1,
                  }}
                >
                  <ProgressIcon />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track your goals
                </Typography>
              </Box>
            </CardContent>
          </FeatureCard>
        </Grid>
      </Grid>

      {/* Recent Meals */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Recent Meals
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Card sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "none" }}>
              <Box sx={{ position: "relative", height: 120 }}>
                <Box
                  component="img"
                  src="/placeholder.svg?height=120&width=200"
                  alt="Healthy Breakfast"
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
              <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Healthy Breakfast
                </Typography>
                <Typography variant="body2">420 kcal</Typography>
                <Typography variant="caption" color="text.secondary">
                  8:30 AM
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "none" }}>
              <Box sx={{ position: "relative", height: 120 }}>
                <Box
                  component="img"
                  src="/placeholder.svg?height=120&width=200"
                  alt="Grilled Chicken"
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
              <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Grilled Chicken
                </Typography>
                <Typography variant="body2">380 kcal</Typography>
                <Typography variant="caption" color="text.secondary">
                  12:45 PM
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Nutrition Insights */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Nutrition Insights
        </Typography>

        <Card sx={{ mb: 2, borderRadius: 2, boxShadow: "none", border: "1px solid", borderColor: "divider" }}>
          <CardContent sx={{ display: "flex", alignItems: "center", p: 2, "&:last-child": { pb: 2 } }}>
            <Box
              sx={{
                bgcolor: "#E3F2FD",
                borderRadius: 2,
                p: 1.5,
                mr: 2,
                color: "#2196F3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box component="span" sx={{ fontSize: 24 }}>
                📊
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Protein Intake
              </Typography>
              <Typography variant="body1">75g</Typography>
              <Typography variant="body2" color="text.secondary">
                15g above target
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2, borderRadius: 2, boxShadow: "none", border: "1px solid", borderColor: "divider" }}>
          <CardContent sx={{ display: "flex", alignItems: "center", p: 2, "&:last-child": { pb: 2 } }}>
            <Box
              sx={{
                bgcolor: "#E0F7FA",
                borderRadius: 2,
                p: 1.5,
                mr: 2,
                color: "#00BCD4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box component="span" sx={{ fontSize: 24 }}>
                💧
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Water Intake
              </Typography>
              <Typography variant="body1">1.8L</Typography>
              <Typography variant="body2" color="text.secondary">
                0.7L to go
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2, boxShadow: "none", border: "1px solid", borderColor: "divider" }}>
          <CardContent sx={{ display: "flex", alignItems: "center", p: 2, "&:last-child": { pb: 2 } }}>
            <Box
              sx={{
                bgcolor: "#FFF8E1",
                borderRadius: 2,
                p: 1.5,
                mr: 2,
                color: "#FFC107",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box component="span" sx={{ fontSize: 24 }}>
                🛡️
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Vitamin Status
              </Typography>
              <Typography variant="body1">Vitamin D</Typography>
              <Typography variant="body2" color="text.secondary">
                Consider supplements
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

