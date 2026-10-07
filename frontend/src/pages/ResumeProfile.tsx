import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Container } from "@mui/material";

import ResumeHeader from "../components/resume/ResumeHeader";
import ResumeSummary from "../components/resume/ResumeSummary";
import ResumeSkills from "../components/resume/ResumeSkills";
import ResumeExperience from "../components/resume/ResumeExperience";
import ResumeProjects from "../components/resume/ResumeProjects";
import ResumeAchievements from "../components/resume/ResumeAchievements";
import { useResumeProfile } from "../context/ResumeProfileContext";
import { ResumeProfile as ResumeProfileType } from "../components/resume/types";
import { getResume } from "../services/resumeApi";
import { useAuth } from "../context/AuthContext";
export default function ResumeProfile() {
  const { profile } = useResumeProfile();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   async function loadResume() {
  //     try {
  //       setLoading(true);

  //       const data = await getResume(user?.id);

  //       setResume(data);
  //     } catch (err) {
  //       setError("Unable to load your resume.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   loadResume();
  // }, []);

  // if (loading) {
  //   return (
  //     <Box
  //       display="flex"
  //       justifyContent="center"
  //       alignItems="center"
  //       minHeight="70vh"
  //     >
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        py: 5,
      }}
    >
      <Container maxWidth="lg">
        <ResumeHeader pageHeading="User Profile"/>
         <ResumeProjects />
         <ResumeExperience />
         <ResumeSkills/>
         <ResumeAchievements/>

        {/* <ResumeSummary summary={resume.summary} />

        <ResumeSkills skills={resume.skills} />

        <ResumeExperience experiences={resume.experiences} />

        <ResumeProjects projects={resume.projects} />

        <ResumeAchievements achievements={resume.achievements} /> */}
      </Container>
    </Box>
  );
}
