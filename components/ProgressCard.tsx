import { Box, Typography, LinearProgress } from "@mui/material";

export default function ProgressCard() {
  return (
    <Box
      sx={{
        p: 2,
        mt: 2,
        bgcolor: "green",
        color: "#fff",
        borderRadius: 3,
      }}
    >
      <Typography fontWeight={600}>Today&apos;s Progress</Typography>
      <Typography variant="h4" fontWeight={700} mt={1}>
        1,248 kcal left
      </Typography>
      
      {[
        { label: "Protein", value: 65, max: 120 },
        { label: "Carbs", value: 180, max: 250 },
        { label: "Fat", value: 45, max: 70 },
      ].map((item) => (
        <Box key={item.label} mt={1}>
          <Typography fontSize={14}>
            {item.label} {item.value}/{item.max}g
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(item.value / item.max) * 100}
            sx={{ bgcolor: "rgba(255,255,255,0.2)", height: 8, borderRadius: 4 }}
          />
        </Box>
      ))}
    </Box>
  );
}
