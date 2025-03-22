"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Avatar,
  Button,
  Container,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Switch,
  Chip,
  IconButton,
  CircularProgress,
  Stack,
} from "@mui/material"
import {
  ArrowBack,
  ChevronRight,
  PhotoCamera,
  Add,
  Notifications,
  PrivacyTip,
  Description,
  Help,
} from "@mui/icons-material"

export default function ProfileSettings() {
  // State for toggle switches
  const [dietaryPreferences, setDietaryPreferences] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
  })

  // Handle toggle change
  const handleToggleChange = (preference: keyof typeof dietaryPreferences) => {
    setDietaryPreferences({
      ...dietaryPreferences,
      [preference]: !dietaryPreferences[preference],
    })
  }

  const [allergens] = useState(["Peanuts", "Shellfish", "Dairy"])

  return (
    <Container maxWidth="sm" sx={{ pb: 8, bgcolor: "#f5f5f7", minHeight: "100vh" }}>
      <Paper
        elevation={0}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "white",
          borderRadius: 0,
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
          <IconButton edge="start" aria-label="back">
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ mx: "auto", fontWeight: 600 }}>
            Profile & Settings
          </Typography>
        </Box>
      </Paper>

      {/* Profile Header */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2, mb: 3 }}>
        <Box sx={{ position: "relative" }}>
          <Avatar src="/placeholder.svg?height=80&width=80" alt="John Smith" sx={{ width: 80, height: 80 }} />
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "white",
              border: "1px solid #e0e0e0",
            }}
          >
            <PhotoCamera fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
          John Smith
        </Typography>
        <Typography variant="body2" color="text.secondary">
          john.smith@email.com
        </Typography>
        <Button
          variant="contained"
          disableElevation
          sx={{
            mt: 2,
            bgcolor: "#f5f5f7",
            color: "text.primary",
            textTransform: "none",
            width: "90%",
            borderRadius: 1,
            "&:hover": {
              bgcolor: "#e8e8e8",
            },
          }}
        >
          Edit Profile
        </Button>
      </Box>

      {/* Personal Information */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ px: 2, mb: 1, color: "text.secondary" }}>
          Personal Information
        </Typography>
        <Paper elevation={0} sx={{ borderRadius: 2 }}>
          <List disablePadding>
            <ListItemButton sx={{ py: 1.5 }}>
              <ListItemText
                primary="Name"
                secondary="John Smith"
                primaryTypographyProps={{ variant: "body2", color: "text.primary" }}
                secondaryTypographyProps={{ variant: "body2" }}
              />
              <ListItemSecondaryAction>
                <ChevronRight color="action" />
              </ListItemSecondaryAction>
            </ListItemButton>
            <Divider component="li" />
            <ListItemButton sx={{ py: 1.5 }}>
              <ListItemText
                primary="Email"
                secondary="john.smith@email.com"
                primaryTypographyProps={{ variant: "body2", color: "text.primary" }}
                secondaryTypographyProps={{ variant: "body2" }}
              />
              <ListItemSecondaryAction>
                <ChevronRight color="action" />
              </ListItemSecondaryAction>
            </ListItemButton>
            <Divider component="li" />
            <ListItemButton sx={{ py: 1.5 }}>
              <ListItemText
                primary="Phone Number"
                secondary="+1 (555) 123-4567"
                primaryTypographyProps={{ variant: "body2", color: "text.primary" }}
                secondaryTypographyProps={{ variant: "body2" }}
              />
              <ListItemSecondaryAction>
                <ChevronRight color="action" />
              </ListItemSecondaryAction>
            </ListItemButton>
          </List>
        </Paper>
      </Box>

      {/* Dietary Preferences */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ px: 2, mb: 1, color: "text.secondary" }}>
          Dietary Preferences
        </Typography>
        <Paper elevation={0} sx={{ borderRadius: 2 }}>
          <List disablePadding>
            <ListItemButton sx={{ py: 1.5 }}>
              <ListItemText
                primary="Vegetarian"
                secondary="Exclude meat and fish"
                primaryTypographyProps={{ variant: "body2", color: "text.primary" }}
                secondaryTypographyProps={{ variant: "body2" }}
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={dietaryPreferences.vegetarian}
                  onChange={() => handleToggleChange("vegetarian")}
                />
              </ListItemSecondaryAction>
            </ListItemButton>
            <Divider component="li" />
            <ListItemButton sx={{ py: 1.5 }}>
              <ListItemText
                primary="Vegan"
                secondary="Exclude all animal products"
                primaryTypographyProps={{ variant: "body2", color: "text.primary" }}
                secondaryTypographyProps={{ variant: "body2" }}
              />
              <ListItemSecondaryAction>
                <Switch edge="end" checked={dietaryPreferences.vegan} onChange={() => handleToggleChange("vegan")} />
              </ListItemSecondaryAction>
            </ListItemButton>
            <Divider component="li" />
            <ListItemButton sx={{ py: 1.5 }}>
              <ListItemText
                primary="Gluten-Free"
                secondary="Exclude gluten-containing foods"
                primaryTypographyProps={{ variant: "body2", color: "text.primary" }}
                secondaryTypographyProps={{ variant: "body2" }}
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={dietaryPreferences.glutenFree}
                  onChange={() => handleToggleChange("glutenFree")}
                />
              </ListItemSecondaryAction>
            </ListItemButton>
          </List>
        </Paper>
      </Box>

      {/* Allergens */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ px: 2, mb: 1, color: "text.secondary" }}>
          Allergens
        </Typography>
        <Paper elevation={0} sx={{ borderRadius: 2, p: 2 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {allergens.map((allergen) => (
              <Chip key={allergen} label={allergen} variant="outlined" sx={{ borderRadius: 1 }} />
            ))}
            <Chip
              icon={<Add fontSize="small" />}
              label="Add More"
              variant="outlined"
              sx={{ borderRadius: 1 }}
              clickable
            />
          </Box>
        </Paper>
      </Box>

      {/* Nutritional Goals */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ px: 2, mb: 1, color: "text.secondary" }}>
          Nutritional Goals
        </Typography>
        <Paper elevation={0} sx={{ borderRadius: 2, p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="body2">Daily Calorie Target</Typography>
            <Typography variant="body1" fontWeight={600}>
              2,000 kcal
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress variant="determinate" value={30} size={60} thickness={4} sx={{ color: "#2196f3" }} />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption" fontWeight="bold">
                    30%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Protein
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress variant="determinate" value={40} size={60} thickness={4} sx={{ color: "#2196f3" }} />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption" fontWeight="bold">
                    40%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Carbs
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress variant="determinate" value={30} size={60} thickness={4} sx={{ color: "#2196f3" }} />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption" fontWeight="bold">
                    30%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Fat
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>

      {/* Current Plan */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ px: 2, mb: 1, color: "text.secondary" }}>
          Current Plan
        </Typography>
        <Paper elevation={0} sx={{ borderRadius: 2, p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Chip
              label="Premium"
              size="small"
              sx={{
                bgcolor: "#fef7e6",
                color: "#d4a72c",
                fontWeight: "bold",
                borderRadius: 1,
              }}
            />
          </Box>
          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#007bff",
              textTransform: "none",
              borderRadius: 1,
              py: 1.5,
              "&:hover": {
                bgcolor: "#0069d9",
              },
            }}
          >
            Manage Subscription
          </Button>
        </Paper>
      </Box>

      {/* Settings */}
      <Paper elevation={0} sx={{ borderRadius: 2, mb: 3 }}>
        <List disablePadding>
          <ListItemButton  sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Notifications fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Notifications Settings" primaryTypographyProps={{ variant: "body2" }} />
            <ListItemSecondaryAction>
              <ChevronRight color="action" />
            </ListItemSecondaryAction>
          </ListItemButton>
          <Divider component="li" />
          <ListItemButton  sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <PrivacyTip fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Privacy Policy" primaryTypographyProps={{ variant: "body2" }} />
            <ListItemSecondaryAction>
              <ChevronRight color="action" />
            </ListItemSecondaryAction>
          </ListItemButton>
          <Divider component="li" />
          <ListItemButton  sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Description fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Terms of Service" primaryTypographyProps={{ variant: "body2" }} />
            <ListItemSecondaryAction>
              <ChevronRight color="action" />
            </ListItemSecondaryAction>
          </ListItemButton>
          <Divider component="li" />
          <ListItemButton  sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Help fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Help & Support" primaryTypographyProps={{ variant: "body2" }} />
            <ListItemSecondaryAction>
              <ChevronRight color="action" />
            </ListItemSecondaryAction>
          </ListItemButton>
        </List>
      </Paper>

      {/* Sign Out */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Button
          sx={{
            color: "#ff3b30",
            textTransform: "none",
          }}
        >
          Sign Out
        </Button>
      </Box>

      {/* Bottom Indicator */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 5,
            bgcolor: "#000",
            borderRadius: 5,
            opacity: 0.2,
          }}
        />
      </Box>
    </Container>
  )
}

