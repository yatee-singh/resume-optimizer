import { Paper, Typography } from "@mui/material";

interface Props {
  summary?: string;
}

export default function ResumeSummary({ summary }: Props) {
  if (!summary) return null;

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" fontWeight={700} mb={1.5}>
        Professional Summary
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ lineHeight: 1.8 }}
      >
        {summary}
      </Typography>
    </Paper>
  );
}