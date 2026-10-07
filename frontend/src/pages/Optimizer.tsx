import { useState } from "react";
import { Box } from "@mui/material";

import ResumeHeader from "../components/resume/ResumeHeader";
import {
  JobDescriptionInput,
  OptimizedResumeResults,
} from "../components/optimizer/OptimizerUI";

import { optimizeResume } from "../services/optimizerApi";
import type { OptimizeResult } from "../types/optimizer";

export default function Optimizer() {
  const [jobDescription, setJobDescription] =
    useState("");

  const [result, setResult] =
    useState<OptimizeResult | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleOptimize = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await optimizeResume(
        jobDescription
      );

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError("");
  };

  return (
    <>
      <ResumeHeader pageHeading="Optimize Resume" />

      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: 4,
          width: "100%",
        }}
      >
        {!result && (
          <JobDescriptionInput
            jobDescription={jobDescription}
            loading={loading}
            error={error}
            onChange={setJobDescription}
            onOptimize={handleOptimize}
          />
        )}

        {result && (
          <OptimizedResumeResults
            result={result}
            onReset={handleReset}
          />
        )}
      </Box>
    </>
  );
}