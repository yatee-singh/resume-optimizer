import type { ReactNode } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import WorkOutlineIcon from "@mui/icons-material/Work";
import CodeIcon from "@mui/icons-material/Code";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircle";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import type {
  ATSReport,
  JobAnalysis,
  OptimizeResult,
} from "../../types/optimizer";

/* -------------------------------------------------------------------------- */
/* Job Description Input                                                      */
/* -------------------------------------------------------------------------- */

interface JobDescriptionInputProps {
  jobDescription: string;
  loading: boolean;
  error: string;
  onChange: (value: string) => void;
  onOptimize: () => void;
}

export function JobDescriptionInput({
  jobDescription,
  loading,
  error,
  onChange,
  onOptimize,
}: JobDescriptionInputProps) {
  return (
    <Card elevation={0}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ mb: 2 }}
        >
          Job Description
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={16}
          maxRows={25}
          placeholder="Paste the complete job description here..."
          value={jobDescription}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
          sx={{
            "& .MuiOutlinedInput-root": {
              alignItems: "flex-start",
            },
          }}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 3,
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={
              loading ? (
                <CircularProgress
                  size={20}
                  color="inherit"
                />
              ) : (
                <AutoAwesomeIcon />
              )
            }
            onClick={onOptimize}
            disabled={loading || !jobDescription.trim()}
            sx={{
              px: 4,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {loading ? "Optimizing..." : "Optimize Resume"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Optimized Resume Results                                                   */
/* -------------------------------------------------------------------------- */

interface OptimizedResumeResultsProps {
  result: OptimizeResult;
  onReset: () => void;
}

export function OptimizedResumeResults({
  result,
  onReset,
}: OptimizedResumeResultsProps) {
  return (
    <Stack spacing={3}>
      {/* Top actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Optimized Resume
        </Typography>

        <Button
          variant="outlined"
          onClick={onReset}
          sx={{ textTransform: "none" }}
        >
          Optimize Another JD
        </Button>
      </Box>

      {/* ATS Report */}
      <ATSReportSection report={result.ats_report} />

      {/* Summary */}
      <SectionCard
        title="Professional Summary"
        icon={
          <PsychologyOutlinedIcon color="primary" />
        }
      >
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.8,
            color: "text.primary",
          }}
        >
          {result.tailored_resume.summary}
        </Typography>
      </SectionCard>

      {/* Skills */}
      <SectionCard
        title="Skills"
        icon={<CodeIcon color="primary" />}
      >
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
        >
          {result.tailored_resume.skills.map(
            (skill, index) => (
              <Chip
                key={`${skill}-${index}`}
                label={skill}
                variant="outlined"
                sx={{ mb: 1 }}
              />
            )
          )}
        </Stack>
      </SectionCard>

      {/* Experience */}
      <SectionCard
        title="Experience"
        icon={<WorkOutlineIcon color="primary" />}
      >
        <Stack spacing={3}>
          {result.tailored_resume.experiences.map(
            (experience, index) => (
              <Box
                key={`${experience.company}-${index}`}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                >
                  {experience.role}
                </Typography>

                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ mb: 1.5 }}
                >
                  {experience.company}
                </Typography>

                <Stack spacing={1}>
                  {experience.bullets.map(
                    (bullet, bulletIndex) => (
                      <BulletItem
                        key={bulletIndex}
                        text={bullet}
                      />
                    )
                  )}
                </Stack>

                {index <
                  result.tailored_resume.experiences
                    .length -
                    1 && <Divider sx={{ mt: 3 }} />}
              </Box>
            )
          )}
        </Stack>
      </SectionCard>

      {/* Projects */}
      <SectionCard
        title="Projects"
        icon={<CodeIcon color="primary" />}
      >
        <Stack spacing={3}>
          {result.tailored_resume.projects.map(
            (project, index) => (
              <Box
                key={`${project.name}-${index}`}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{ mb: 1 }}
                >
                  {project.name}
                </Typography>

                <Stack spacing={1}>
                  {project.bullets.map(
                    (bullet, bulletIndex) => (
                      <BulletItem
                        key={bulletIndex}
                        text={bullet}
                      />
                    )
                  )}
                </Stack>

                {index <
                  result.tailored_resume.projects
                    .length -
                    1 && <Divider sx={{ mt: 3 }} />}
              </Box>
            )
          )}
        </Stack>
      </SectionCard>

      {/* Job Analysis */}
      {result.job_analysis && (
        <JobAnalysisSection
          analysis={result.job_analysis}
        />
      )}
    </Stack>
  );
}

/* -------------------------------------------------------------------------- */
/* ATS Report                                                                 */
/* -------------------------------------------------------------------------- */

function ATSReportSection({
  report,
}: {
  report: ATSReport;
}) {
  const score = Math.min(
    100,
    Math.max(0, report.score)
  );

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ mb: 3 }}
        >
          ATS Analysis
        </Typography>

        <Grid container spacing={3}>
          {/* Score */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 2,
                bgcolor: "background.default",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h2"
                fontWeight={700}
                color="primary"
              >
                {score.toFixed(0)}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                ATS Match Score
              </Typography>

              <LinearProgress
                variant="determinate"
                value={score}
                sx={{
                  height: 8,
                  borderRadius: 5,
                }}
              />
            </Paper>
          </Grid>

          {/* Matched */}
          <Grid size={{ xs: 12, md: 4 }}>
            <KeywordCard
              title="Matched Keywords"
              keywords={report.matched_keywords}
              icon={<CheckCircleOutlineIcon />}
            />
          </Grid>

          {/* Missing */}
          <Grid size={{ xs: 12, md: 4 }}>
            <KeywordCard
              title="Missing Keywords"
              keywords={report.missing_keywords}
              icon={<WarningAmberOutlinedIcon />}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Keyword Card                                                               */
/* -------------------------------------------------------------------------- */

function KeywordCard({
  title,
  keywords,
  icon,
}: {
  title: string;
  keywords: string[];
  icon: ReactNode;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mb: 2 }}
      >
        {icon}

        <Typography
          variant="subtitle1"
          fontWeight={600}
        >
          {title}
        </Typography>
      </Stack>

      {keywords.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
        >
          None
        </Typography>
      ) : (
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
        >
          {keywords.map((keyword, index) => (
            <Chip
              key={`${keyword}-${index}`}
              label={keyword}
              size="small"
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
      )}
    </Paper>
  );
}

/* -------------------------------------------------------------------------- */
/* Generic Section Card                                                       */
/* -------------------------------------------------------------------------- */

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 2.5 }}
        >
          {icon}

          <Typography
            variant="h6"
            fontWeight={600}
          >
            {title}
          </Typography>
        </Stack>

        {children}
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Job Analysis                                                               */
/* -------------------------------------------------------------------------- */

function JobAnalysisSection({
  analysis,
}: {
  analysis: JobAnalysis;
}) {
  return (
    <SectionCard
      title="Job Analysis"
      icon={<WorkOutlineIcon color="primary" />}
    >
      <Stack spacing={3}>
        <Box>
          <Typography
            variant="subtitle2"
            color="text.secondary"
          >
            Target Role
          </Typography>

          <Typography
            variant="h6"
            fontWeight={600}
          >
            {analysis.role}
          </Typography>
        </Box>

        <KeywordGroup
          title="Required Skills"
          items={analysis.required_skills}
        />

        <KeywordGroup
          title="Preferred Skills"
          items={analysis.preferred_skills}
        />

        <KeywordGroup
          title="Important Keywords"
          items={analysis.keywords}
        />

        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ mb: 1 }}
          >
            Responsibilities
          </Typography>

          <Stack spacing={1}>
            {analysis.responsibilities.map(
              (responsibility, index) => (
                <BulletItem
                  key={index}
                  text={responsibility}
                />
              )
            )}
          </Stack>
        </Box>
      </Stack>
    </SectionCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Keyword Group                                                              */
/* -------------------------------------------------------------------------- */

function KeywordGroup({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <Box>
      <Typography
        variant="subtitle1"
        fontWeight={600}
        sx={{ mb: 1 }}
      >
        {title}
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        useFlexGap
      >
        {items.map((item, index) => (
          <Chip
            key={`${item}-${index}`}
            label={item}
            size="small"
            variant="outlined"
            sx={{ mb: 1 }}
          />
        ))}
      </Stack>
    </Box>
  );
}

/* -------------------------------------------------------------------------- */
/* Bullet Item                                                                */
/* -------------------------------------------------------------------------- */

function BulletItem({
  text,
}: {
  text: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "flex-start",
      }}
    >
      <Typography sx={{ mt: "-2px" }}>
        •
      </Typography>

      <Typography
        variant="body2"
        sx={{ lineHeight: 1.7 }}
      >
        {text}
      </Typography>
    </Box>
  );
}