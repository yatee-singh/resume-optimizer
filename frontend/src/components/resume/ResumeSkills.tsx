import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import CodeIcon from "@mui/icons-material/Code";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/Delete";

import { useResumeProfile } from "../../context/ResumeProfileContext";
import {
  Skill,
  SkillCreate,
} from "../../types/resumeProfile";

interface FormData {
  name: string;
  category: string;
}

const emptyForm: FormData = {
  name: "",
  category: "",
};

export default function ResumeSkills() {
  const {
    profile,
    addSkill,
    updateSkill,
    deleteSkill,
  } = useResumeProfile();

  const skills = profile?.skills ?? [];

  const [editingSkill, setEditingSkill] =
    useState<Skill | null>(null);

  const [formOpen, setFormOpen] =
    useState(false);

  const [form, setForm] = useState<FormData>({
    ...emptyForm,
  });

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const openAddForm = () => {
    setEditingSkill(null);

    setForm({
      ...emptyForm,
    });

    setError(null);
    setFormOpen(true);
  };

  const openEditForm = (skill: Skill) => {
    setEditingSkill(skill);

    setForm({
      name: skill.name ?? "",
      category: skill.category ?? "",
    });

    setError(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;

    setFormOpen(false);
    setEditingSkill(null);

    setForm({
      ...emptyForm,
    });

    setError(null);
  };

  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError(null);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.category.trim()) {
      return;
    }

    const data: SkillCreate = {
      name: form.name.trim(),
      category: form.category.trim(),
      display_order:
        editingSkill?.display_order ??
        skills.length,
    };

    try {
      setSaving(true);
      setError(null);

      if (editingSkill) {
        await updateSkill(
          editingSkill.id,
          data
        );
      } else {
        await addSkill(data);
      }

      setFormOpen(false);
      setEditingSkill(null);

      setForm({
        ...emptyForm,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save skill"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    skillId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) return;

    try {
      await deleteSkill(skillId);
    } catch (err) {
      console.error(
        "Failed to delete skill:",
        err
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
            <CodeIcon color="primary" />

            <Typography
              variant="h6"
              fontWeight={700}
            >
              Skills
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={openAddForm}
          >
            Add Skill
          </Button>
        </Box>

        {skills.length === 0 && (
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
              No skills added yet.
            </Typography>
          </Box>
        )}

        {skills.map((skill, index) => (
          <Box key={skill.id}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                >
                  {skill.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {skill.category}
                </Typography>
              </Box>

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
                    openEditForm(skill)
                  }
                  aria-label="Edit skill"
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  color="error"
                  onClick={() =>
                    handleDelete(skill.id)
                  }
                  aria-label="Delete skill"
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {index < skills.length - 1 && (
              <Divider sx={{ my: 3 }} />
            )}
          </Box>
        ))}
      </Paper>

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
          {editingSkill
            ? "Edit Skill"
            : "Add Skill"}
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
            {error && (
              <Alert
                severity="error"
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            <TextField
              label="Skill"
              value={form.name}
              onChange={(e) =>
                handleChange(
                  "name",
                  e.target.value
                )
              }
              fullWidth
              required
              autoFocus
              placeholder="e.g. React"
            />

            <TextField
              label="Category"
              value={form.category}
              onChange={(e) =>
                handleChange(
                  "category",
                  e.target.value
                )
              }
              fullWidth
              required
              placeholder="e.g. Frontend"
            />
          </Box>
        </DialogContent>

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
              !form.name.trim() ||
              !form.category.trim()
            }
          >
            {saving
              ? "Saving..."
              : editingSkill
              ? "Update Skill"
              : "Add Skill"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}