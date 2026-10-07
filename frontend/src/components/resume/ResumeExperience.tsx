import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import WorkOutlineIcon from "@mui/icons-material/Work";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/Delete";

import { useResumeProfile } from "../../context/ResumeProfileContext";
import {
  Experience,
  ExperienceCreate,
} from "../../types/resumeProfile";

interface FormData {
  role: string;
  company: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  is_current: boolean;
}

const emptyForm: FormData = {
  role: "",
  company: "",
  description:"",
  start_date: "",
  end_date: "",
  location: "",
  is_current: false,
};

export default function ResumeExperience() {
  const {
    profile,
    addExperience,
    updateExperience,
    deleteExperience,
  } = useResumeProfile();

  const experiences = profile?.experiences ?? [];

  const [editingExperience, setEditingExperience] =
    useState<Experience | null>(null);

  const [formOpen, setFormOpen] = useState(false);

  const [form, setForm] = useState<FormData>({
    ...emptyForm,
  });

  const [saving, setSaving] = useState(false);

  const openAddForm = () => {
    setEditingExperience(null);

    setForm({
      ...emptyForm,
    });

    setFormOpen(true);
  };

  const openEditForm = (experience: Experience) => {
    setEditingExperience(experience);

    setForm({
      role: experience.role ?? "",
      company: experience.company ?? "",
       description: experience.description ?? "",
      start_date: experience.start_date ?? "",
      end_date: experience.end_date ?? "",
      location: experience.location ?? "",
      is_current: experience.is_current ?? false,
    });

    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;

    setFormOpen(false);
    setEditingExperience(null);

    setForm({
      ...emptyForm,
    });
  };

  const handleChange = (
    field: keyof Omit<FormData, "is_current">,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleCurrentChange = (
    checked: boolean
  ) => {
    setForm((current) => ({
      ...current,
      is_current: checked,
      end_date: checked
        ? ""
        : current.end_date,
    }));
  };

  const handleSave = async () => {
    if (
      !form.role.trim() ||
      !form.company.trim()
    ) {
      return;
    }

    const data: ExperienceCreate = {
      role: form.role.trim(),
      company: form.company.trim(),
      description: form.description.trim() || null,
      location: form.location.trim() || null,
      start_date: form.start_date || null,
      end_date: form.is_current
        ? null
        : form.end_date || null,
      is_current: form.is_current,
      display_order:
        editingExperience?.display_order ??
        experiences.length,
    };

    try {
      setSaving(true);

      if (editingExperience) {
        await updateExperience(
          editingExperience.id,
          data
        );
      } else {
        await addExperience(data);
      }

      setFormOpen(false);
      setEditingExperience(null);

      setForm({
        ...emptyForm,
      });
    } catch (error) {
      console.error(
        "Failed to save experience:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    experienceId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmed) return;

    try {
      await deleteExperience(experienceId);
    } catch (error) {
      console.error(
        "Failed to delete experience:",
        error
      );
    }
  };

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          mb: 3,
          mt: 3,
          borderRadius: 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <WorkOutlineIcon color="primary" />

            <Typography
              variant="h6"
              fontWeight={700}
            >
              Experience
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={openAddForm}
          >
            Add Experience
          </Button>
        </Box>

        {/* Empty state */}
        {experiences.length === 0 && (
          <Box
            sx={{
              py: 3,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              No experience added yet.
            </Typography>
          </Box>
        )}

        {/* Experience list */}
        {experiences.map(
          (experience, index) => (
            <Box key={experience.id}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "flex-start",
                  gap: 2,
                }}
              >
                {/* Experience details */}
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                  >
                    {experience.role}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    color="primary"
                    fontWeight={500}
                  >
                    {experience.company}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {experience.start_date ||
                      "Start date not set"}{" "}
                    –{" "}
                    {experience.is_current
                      ? "Present"
                      : experience.end_date ||
                        "Present"}
                    {experience.location &&
                      ` · ${experience.location}`}
                   
                  </Typography>
                  <Typography >
                    {experience.description}
                  </Typography>
                </Box>

                {/* Actions */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    flexShrink: 0,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() =>
                      openEditForm(
                        experience
                      )
                    }
                    aria-label="Edit experience"
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() =>
                      handleDelete(
                        experience.id
                      )
                    }
                    aria-label="Delete experience"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* Divider */}
              {index <
                experiences.length - 1 && (
                <Divider sx={{ my: 3 }} />
              )}
            </Box>
          )
        )}
      </Paper>

      {/* Add / Edit Dialog */}
      <Dialog
        open={formOpen}
        onClose={() => {
          if (!saving) {
            closeForm();
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingExperience
            ? "Edit Experience"
            : "Add Experience"}
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              pt: 1,
            }}
          >
            {/* Role */}
            <TextField
              label="Role"
              value={form.role}
              onChange={(e) =>
                handleChange(
                  "role",
                  e.target.value
                )
              }
              fullWidth
              required
              autoFocus
              placeholder="e.g. Senior Software Engineer"
            />

            {/* Company */}
            <TextField
              label="Company"
              value={form.company}
              onChange={(e) =>
                handleChange(
                  "company",
                  e.target.value
                )
              }
              fullWidth
              required
              placeholder="e.g. Google"
            />

            {/* Dates */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 2,
              }}
            >
              <TextField
                label="Start Date"
                type="date"
                value={form.start_date}
                onChange={(e) =>
                  handleChange(
                    "start_date",
                    e.target.value
                  )
                }
                fullWidth
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />

              <TextField
                label="End Date"
                type="date"
                value={form.end_date}
                onChange={(e) =>
                  handleChange(
                    "end_date",
                    e.target.value
                  )
                }
                fullWidth
                disabled={form.is_current}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Box>

            {/* Current position */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.is_current}
                  onChange={(e) =>
                    handleCurrentChange(
                      e.target.checked
                    )
                  }
                />
              }
              label="I currently work here"
            />


            {/* Location */}
            <TextField
              label="Location"
              value={form.location}
              onChange={(e) =>
                handleChange(
                  "location",
                  e.target.value
                )
              }
              fullWidth
              placeholder="e.g. Bengaluru, India"
            />

                        {/* Description */}
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) =>
                handleChange("description", e.target.value)
              }
              fullWidth
              multiline
              minRows={4}
              placeholder="Briefly describe your role, responsibilities, and impact"
            />
          </Box>
        </DialogContent>


        {/* Dialog actions */}
        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >
          <Button
            onClick={closeForm}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={
              saving ||
              !form.role.trim() ||
              !form.company.trim()
            }
          >
            {saving
              ? "Saving..."
              : editingExperience
              ? "Update Experience"
              : "Add Experience"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}