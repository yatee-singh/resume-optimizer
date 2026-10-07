import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

import { Project } from "../../types/resumeProfile";
import {
  ProjectCreate,
} from "../../context/ResumeProfileContext";

interface Props {
  open: boolean;
  project?: Project | null;
  onClose: () => void;
  onSubmit: (data: ProjectCreate) => Promise<void>;
}

interface FormState {
  name: string;
  description: string;
  url: string;
  start_date: string;
  end_date: string;
}

const emptyForm: FormState = {
  name: "",
  description: "",
  url: "",
  start_date: "",
  end_date: "",
};

export default function ProjectDialog({
  open,
  project,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState<FormState>(emptyForm);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const isEditing = Boolean(project);

  // Populate form when editing
  useEffect(() => {
    if (!open) return;

    if (project) {
      setForm({
        name: project.name ?? "",
        description: project.description ?? "",
        url: project.url ?? "",
        start_date: project.start_date ?? "",
        end_date: project.end_date ?? "",
      });
    } else {
      setForm(emptyForm);
    }

    setError(null);
  }, [open, project]);

  const handleChange =
    (field: keyof FormState) =>
    (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        url: form.url.trim() || null,
        start_date:
          form.start_date || null,
        end_date:
          form.end_date || null,
        display_order:
          project?.display_order ?? 0,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save project."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {isEditing
          ? "Edit Project"
          : "Add Project"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Project name"
            value={form.name}
            onChange={handleChange("name")}
            required
            fullWidth
            autoFocus
            placeholder="e.g. E-commerce Platform"
          />

          <TextField
            label="Description"
            value={form.description}
            onChange={handleChange(
              "description"
            )}
            fullWidth
            multiline
            minRows={4}
            placeholder="Describe what you built, your role, and the impact..."
          />

          <TextField
            label="Project URL"
            value={form.url}
            onChange={handleChange("url")}
            fullWidth
            type="url"
            placeholder="https://example.com"
          />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
          >
            <TextField
              label="Start date"
              type="date"
              value={form.start_date}
              onChange={handleChange(
                "start_date"
              )}
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              label="End date"
              type="date"
              value={form.end_date}
              onChange={handleChange(
                "end_date"
              )}
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Stack>

          {error && (
            <TextField
              value={error}
              error
              fullWidth
              slotProps={{
                input: {
                  readOnly: true,
                },
              }}
            />
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          disabled={saving}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            saving || !form.name.trim()
          }
        >
          {saving
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "Add Project"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}