import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonOutlineIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

import { useResumeProfile } from "../context/ResumeProfileContext";
import { ResumeProfile } from "../types/resumeProfile";

/* -------------------------------------------------------------------------- */
/* Profile Card                                                               */
/* -------------------------------------------------------------------------- */

interface ProfileCardProps {
  profile: ResumeProfile;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const experiences = profile.experiences ?? [];
  const skills = profile.skills ?? [];
  const projects = profile.projects ?? [];
  const achievements = profile.achievements ?? [];

  /*
   * Calculate profile completion based on the sections
   * that actually contain data.
   */
  const completedSections = [
    experiences.length > 0,
    skills.length > 0,
    projects.length > 0,
    achievements.length > 0,
  ].filter(Boolean).length;

  const totalSections = 4;

  const completion = Math.round(
    (completedSections / totalSections) * 100
  );

  const primaryExperience = experiences[0];

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #E2E8F0",
        bgcolor: "white",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          {/* Header */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1 }}
              >
                <Typography fontWeight={600}>
                  {profile.headline || "Resume Profile"}
                </Typography>

                {completion === 100 && (
                  <Chip
                    label="Profile complete"
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                )}
              </Stack>

              <Typography variant="body2" color="text.secondary">
                {primaryExperience
                  ? `${primaryExperience.role} · ${primaryExperience.company}`
                  : "Add your experience"}
              </Typography>
            </Box>

            <Typography
              variant="body2"
              fontWeight={600}
              color="primary.main"
            >
              {completion}% complete
            </Typography>
          </Stack>

          {/* Completion */}
          <LinearProgress
            variant="determinate"
            value={completion}
            sx={{
              height: 6,
              borderRadius: 5,
            }}
          />

          <Divider />

          {/* Profile sections */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            flexWrap="wrap"
          >
            <Chip
              label={`Experience (${experiences.length})`}
              variant="outlined"
            />

            <Chip
              label={`Skills (${skills.length})`}
              variant="outlined"
            />

            <Chip
              label={`Projects (${projects.length})`}
              variant="outlined"
            />

            <Chip
              label={`Achievements (${achievements.length})`}
              variant="outlined"
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

/* -------------------------------------------------------------------------- */
/* Empty Profile Card                                                         */
/* -------------------------------------------------------------------------- */

export const EmptyProfileCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px dashed",
        borderColor: "primary.light",
        bgcolor: "white",
      }}
    >
      <CardContent
        sx={{
          p: { xs: 3, md: 4 },
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            mx: "auto",
            mb: 2,
            borderRadius: 2,
            bgcolor: "primary.50",
            color: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PersonOutlineIcon />
        </Box>

        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
          Build your resume profile
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            maxWidth: 550,
            mx: "auto",
            mb: 3,
          }}
        >
          Add your experience, skills, projects and achievements. We'll use
          this information to create tailored resumes for different job
          descriptions.
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate("/resume-profile")}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Create Profile
        </Button>
      </CardContent>
    </Card>
  );
};