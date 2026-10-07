import React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonOutlineIcon from "@mui/icons-material/Person";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import WorkOutlineIcon from "@mui/icons-material/Work";
import { Resume } from "../components/dashboard/types";
import UserMenu from "../components/UserMenu";
import { useAuth } from "../context/AuthContext";
import { ProfileCard, EmptyProfileCard } from "../components/ProfileCard";
import { useResumeProfile } from "../context/ResumeProfileContext";

const recentResumes: Resume[] = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Amazon",
    date: "Sep 25, 2026",
    score: 92,
  },
  {
    id: 2,
    title: "SDE I",
    company: "Microsoft",
    date: "Sep 21, 2026",
    score: 88,
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "Swiggy",
    date: "Sep 18, 2026",
    score: 85,
  },
];

const ResumeOptimizerDashboard: React.FC = () => {
  // Replace this with your actual API/profile state.
  const { profile, loading: profileLoading } = useResumeProfile();

  const profileExists = !!profile;
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const { user } = useAuth();
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F8FAFC",
        color: "#0F172A",
      }}
    >
      {/* Navbar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "white",
          color: "#0F172A",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              height: 68,
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}
            <Stack direction="row" alignItems="center" spacing={1.2}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DescriptionOutlinedIcon
                  sx={{ color: "white", fontSize: 20 }}
                />
              </Box>

              <Typography variant="h6" fontWeight={700} letterSpacing="-0.02em">
                ResumeAI
              </Typography>
            </Stack>

            {/* Navigation */}
            <Stack direction="row" alignItems="center" spacing={1}>
              {/* <Button
                sx={{
                  color: "#475569",
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Dashboard
              </Button> */}

              <UserMenu />
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            letterSpacing="-0.03em"
            sx={{ mb: 0.75 }}
          >
            Hello, {user?.name} 👋
          </Typography>

          <Typography color="text.secondary" fontSize={16}>
            Tailor your resume to any job in minutes.
          </Typography>
        </Box>

        {/* Main CTA */}
        <Card
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "primary.light",
            background: "linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 65%)",
            overflow: "hidden",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={3}
            >
              <Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: 2,
                      bgcolor: "primary.main",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <WorkOutlineIcon />
                  </Box>

                  <Typography variant="h6" fontWeight={700}>
                    Create a tailored resume
                  </Typography>
                </Stack>

                <Typography
                  color="text.secondary"
                  sx={{ maxWidth: 600, lineHeight: 1.7 }}
                >
                  Upload or paste a Job Description and we'll optimize your
                  resume around the skills and experience that matter for the
                  role.
                </Typography>
              </Box>

              <Button
                onClick={() => navigate("/optimizer")}
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                disabled={!profileExists}
                sx={{
                  minWidth: 220,
                  height: 48,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
              >
                Generate New Resume
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Profile */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" fontWeight={700}>
            Your Profile
          </Typography>

          {profileExists && (
            <Button
              startIcon={<EditOutlinedIcon />}
              onClick={() => navigate("/resume-profile")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Edit Profile
            </Button>
          )}
        </Stack>

        {profileExists ? (
          <ProfileCard profile={profile} />
        ) : (
          <EmptyProfileCard />
        )}

        {/* Recent resumes */}
        {profileExists && (
          <Box sx={{ mt: 5 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Recent Resumes
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Your recently generated resumes
                </Typography>
              </Box>

              <Button
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                View All
              </Button>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              {recentResumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onMenuOpen={handleMenuOpen}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Empty profile hint */}
        {/* {!profileExists && (
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              border: "1px solid #E2E8F0",
              bgcolor: "white",
              textAlign: "center",
            }}
          >
            <Typography fontWeight={600} sx={{ mb: 0.5 }}>
              Create your profile to get started
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Your profile will be the foundation for every tailored resume you
              generate.
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              Create Profile
            </Button>
          </Paper>
        )} */}
      </Container>

      {/* Resume menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Resume</MenuItem>
        <MenuItem onClick={handleMenuClose}>Download PDF</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

/* -------------------------------------------------------------------------- */
/* Profile Card                                                               */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* Resume Card                                                                */
/* -------------------------------------------------------------------------- */

interface ResumeCardProps {
  resume: Resume;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resume, onMenuOpen }) => {
  return (
    <Card
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 0,
        borderRadius: 3,
        border: "1px solid #E2E8F0",
        bgcolor: "white",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "primary.light",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: "#F1F5F9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DescriptionOutlinedIcon sx={{ color: "text.secondary" }} />
            </Box>

            <IconButton size="small" onClick={onMenuOpen}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Box>
            <Typography fontWeight={700} noWrap>
              {resume.title}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {resume.company}
            </Typography>
          </Box>

          <Divider />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="caption" color="text.secondary">
              {resume.date}
            </Typography>

            <Chip
              label={`${resume.score}% match`}
              size="small"
              color="success"
              variant="outlined"
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ResumeOptimizerDashboard;
