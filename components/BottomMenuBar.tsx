"use client";

import { usePathname, useRouter } from "next/navigation";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import {
  Home,
  Search,
  CropFree,
  CalendarToday,
  Person,
} from "@mui/icons-material";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname(); // Get the current route

  // Define mapping between routes and values
  const routes = [
    "/",
    "/nutrition-calculator",
    "/scan",
    "/meal-planner",
    "/profile",
  ];
  const value = routes.indexOf(pathname); // Find active route index

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    router.push(routes[newValue]);
  };

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0, boxShadow: 3 }}
      elevation={3}
    >
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        <BottomNavigationAction label="Home" icon={<Home />} value={0} />
        <BottomNavigationAction label="Search" icon={<Search />} value={1} />
        <BottomNavigationAction label="Scan" icon={<CropFree />} value={2} />
        <BottomNavigationAction
          label="Plans"
          icon={<CalendarToday />}
          value={3}
        />
        <BottomNavigationAction label="Profile" icon={<Person />} value={4} />
      </BottomNavigation>
    </Paper>
  );
}
