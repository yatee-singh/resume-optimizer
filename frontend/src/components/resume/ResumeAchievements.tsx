import { useState } from "react";
import {
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
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/Delete";

import { useResumeProfile } from "../../context/ResumeProfileContext";
import {
  Achievement,
  AchievementCreate,
} from "../../types/resumeProfile";

interface FormData {
  title: string;
  description: string;
  type: string;
  achievement_date: string;
}

const emptyForm: FormData = {
  title: "",
  description: "",
  type: "",
  achievement_date: "",
};

export default function ResumeAchievements() {
  const {
    profile,
    addAchievement,
    updateAchievement,
    deleteAchievement,
  } = useResumeProfile();

  const achievements = profile?.achievements ?? [];

  const [formOpen, setFormOpen] = useState(false);

  const [editingAchievement, setEditingAchievement] =
    useState<Achievement | null>(null);

  const [form, setForm] = useState<FormData>(emptyForm);

  const [saving, setSaving] = useState(false);

  const openAddForm = () => {
    setEditingAchievement(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEditForm = (achievement: Achievement) => {
    setEditingAchievement(achievement);

    setForm({
      title: achievement.title,
      description: achievement.description ?? "",
      type: achievement.type ?? "",
      achievement_date:
        achievement.achievement_date ?? "",
    });

    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;

    setFormOpen(false);
    setEditingAchievement(null);
    setForm(emptyForm);
  };

  const handleChange = (
    field: keyof FormData,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      return;
    }

    const data: AchievementCreate = {
      title: form.title.trim(),
      description:
        form.description.trim() || null,
      type: form.type.trim() || null,
      achievement_date:
        form.achievement_date || null,
    };

    try {
      setSaving(true);

      if (editingAchievement) {
        await updateAchievement(
          editingAchievement.id,
          data,
        );
      } else {
        await addAchievement(data);
      }

      setFormOpen(false);
      setEditingAchievement(null);
      setForm(emptyForm);
    } catch (error) {
      console.error(
        "Failed to save achievement:",
        error,
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    achievementId: string,
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this achievement?",
    );

    if (!confirmed) return;

    try {
      await deleteAchievement(achievementId);
    } catch (error) {
      console.error(
        "Failed to delete achievement:",
        error,
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
            <EmojiEventsOutlinedIcon color="primary" />

            <Typography
              variant="h6"
              fontWeight={700}
            >
              Achievements
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={openAddForm}
          >
            Add Achievement
          </Button>
        </Box>

        {/* Empty state */}
        {achievements.length === 0 && (
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
              No achievements added yet.
            </Typography>
          </Box>
        )}

        {/* Achievement list */}
        {achievements.map(
          (achievement, index) => (
            <Box key={achievement.id}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "flex-start",
                  gap: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                  >
                    {achievement.title}
                  </Typography>

                  {(achievement.type ||
                    achievement.achievement_date) && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {[
                        achievement.type,
                        achievement.achievement_date,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </Typography>
                  )}

                  {achievement.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        lineHeight: 1.7,
                      }}
                    >
                      {achievement.description}
                    </Typography>
                  )}
                </Box>

                {/* Actions */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() =>
                      openEditForm(
                        achievement,
                      )
                    }
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() =>
                      handleDelete(
                        achievement.id,
                      )
                    }
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {index <
                achievements.length - 1 && (
                <Divider sx={{ my: 2.5 }} />
              )}
            </Box>
          ),
        )}
      </Paper>

      {/* Add / Edit Dialog */}
      <Dialog
        open={formOpen}
        onClose={closeForm}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingAchievement
            ? "Edit Achievement"
            : "Add Achievement"}
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
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) =>
                handleChange(
                  "title",
                  e.target.value,
                )
              }
              placeholder="e.g. LeetCode Knight"
              fullWidth
              required
              autoFocus
            />

            <TextField
              label="Type"
              value={form.type}
              onChange={(e) =>
                handleChange(
                  "type",
                  e.target.value,
                )
              }
              placeholder="e.g. Competitive Programming"
              fullWidth
            />

            <TextField
              label="Date"
              type="date"
              value={form.achievement_date}
              onChange={(e) =>
                handleChange(
                  "achievement_date",
                  e.target.value,
                )
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              fullWidth
            />

            <TextField
              label="Description"
              value={form.description}
              onChange={(e) =>
                handleChange(
                  "description",
                  e.target.value,
                )
              }
              placeholder="Describe your achievement..."
              multiline
              minRows={3}
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
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
              saving || !form.title.trim()
            }
          >
            {saving
              ? "Saving..."
              : editingAchievement
                ? "Update Achievement"
                : "Add Achievement"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}