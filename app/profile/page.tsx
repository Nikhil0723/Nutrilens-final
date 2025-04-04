"use client"

import { useState, useEffect } from "react"
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
  ListItemSecondaryAction,
  Divider,
  Switch,
  IconButton,
  TextField,
} from "@mui/material"
import { ArrowBack, PhotoCamera } from "@mui/icons-material"

const PROFILE_KEY = "userProfile"
const PREFERENCES_KEY = "dietaryPreferences"

export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: "/placeholder.svg?height=100&width=100",
  })
  const [dietaryPreferences, setDietaryPreferences] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
  })
  const [isEditing, setIsEditing] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem(PROFILE_KEY)
    if (savedProfile) setProfile(JSON.parse(savedProfile))

    const savedPreferences = localStorage.getItem(PREFERENCES_KEY)
    if (savedPreferences) setDietaryPreferences(JSON.parse(savedPreferences))
  }, [])

  // Handle profile update
  const handleProfileUpdate = () => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    setIsEditing(false)
  }

  // Handle dietary preference update
  const handleToggleChange = (preference: keyof typeof dietaryPreferences) => {
    const updatedPreferences = {
      ...dietaryPreferences,
      [preference]: !dietaryPreferences[preference],
    }
    setDietaryPreferences(updatedPreferences)
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updatedPreferences))
  }

  return (
    <Container maxWidth="sm" sx={{ pb: 8, bgcolor: "#f5f5f7", minHeight: "100vh" }}>
      {/* Sticky Header */}
      <Paper elevation={0} sx={{ position: "sticky", top: 0, zIndex: 10, bgcolor: "white", borderRadius: 0, pb: 1 }}>
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
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 3, mb: 4 }}>
        <Box sx={{ position: "relative" }}>
          <Avatar src={profile.avatar} alt={profile.name} sx={{ width: 100, height: 100 }} />
          <IconButton
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "white",
              border: "2px solid white",
              boxShadow: 1,
            }}
            size="small"
          >
            <PhotoCamera fontSize="small" />
          </IconButton>
        </Box>

        {isEditing ? (
          <>
            <TextField
              label="Full Name"
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              sx={{ mt: 1.5 }}
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleProfileUpdate}>
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
              {profile.name || "User Name"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {profile.email || "user@email.com"}
            </Typography>
            <Button variant="outlined" sx={{ mt: 1.5, borderRadius: 3 }} onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          </>
        )}
      </Box>

      {/* Settings Sections */}
      <Paper elevation={0} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ px: 2, py: 1.5, bgcolor: "#f7f7f7" }}>
          <Typography variant="subtitle2" color="text.secondary">
            Dietary Preferences
          </Typography>
        </Box>
        <List disablePadding>
          {[
            { key: "vegetarian", label: "Vegetarian", desc: "Exclude meat and fish" },
            { key: "vegan", label: "Vegan", desc: "Exclude all animal products" },
            { key: "glutenFree", label: "Gluten-Free", desc: "Exclude gluten-containing foods" },
          ].map((item, index) => (
            <Box key={item.key}>
              <ListItemButton sx={{ py: 1.5 }}>
                <ListItemText
                  primary={item.label}
                  secondary={item.desc}
                  primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: "body2", color: "text.secondary" }}
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={dietaryPreferences[item.key as keyof typeof dietaryPreferences]}
                    onChange={() => handleToggleChange(item.key as keyof typeof dietaryPreferences)}
                  />
                </ListItemSecondaryAction>
              </ListItemButton>
              {index < 2 && <Divider component="li" />}
            </Box>
          ))}
        </List>
      </Paper>

      {/* Account Settings */}
      <Paper elevation={0} sx={{ borderRadius: 2, mt: 3, overflow: "hidden" }}>
        <Box sx={{ px: 2, py: 1.5, bgcolor: "#f7f7f7" }}>
          <Typography variant="subtitle2" color="text.secondary">
            Account Settings
          </Typography>
        </Box>
        <List disablePadding>
          <ListItemButton sx={{ py: 1.5 }}>
            <ListItemText
              primary="Change Email"
              primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
            />
          </ListItemButton>
          <Divider component="li" />
          <ListItemButton sx={{ py: 1.5 }}>
            <ListItemText
              primary="Change Password"
              primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
            />
          </ListItemButton>
          <Divider component="li" />
          <ListItemButton sx={{ py: 1.5, color: "error.main" }}>
            <ListItemText
              primary="Delete Account"
              primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
            />
          </ListItemButton>
        </List>
      </Paper>
    </Container>
  )
}
