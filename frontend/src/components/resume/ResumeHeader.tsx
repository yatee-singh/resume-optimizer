import { Link } from "react-router-dom";
import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

interface ResumeHeaderProps {
  pageHeading: string;
}

export default function ResumeHeader({
  pageHeading,
}: ResumeHeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 72,
        px: 3,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Tooltip title="Back to Dashboard">
        <IconButton
          component={Link}
          to="/dashboard"
          aria-label="Back to Dashboard"
          sx={{
            position: "absolute",
            left: 24,
            width: 42,
            height: 42,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2.5,
            color: "text.secondary",
            transition: "all 0.2s ease",

            "&:hover": {
              color: "text.primary",
              bgcolor: "action.hover",
              borderColor: "text.secondary",
              transform: "translateX(-2px)",
            },
          }}
        >
          <ArrowBackRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Typography
        component="h1"
        variant="h6"
        sx={{
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "text.primary",
        }}
      >
        {pageHeading}
      </Typography>
    </Box>
  );
}

