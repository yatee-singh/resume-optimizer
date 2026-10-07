import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/Delete";
import LaunchIcon from "@mui/icons-material/Launch";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";

import { useState } from "react";

import {
  Project,
} from "../../types/resumeProfile";

import {
  ProjectCreate,
  ProjectUpdate,
  useResumeProfile,
} from "../../context/ResumeProfileContext";

import ProjectDialog from "./ProjectDialog";

export default function ResumeProjects() {
  const {
    profile,
    addProject,
    updateProject,
    deleteProject,
  } = useResumeProfile();

  const projects = profile?.projects ?? [];

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [editingProject, setEditingProject] =
    useState<Project | null>(null);

  const [deletingProject, setDeletingProject] =
    useState<Project | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  const handleAdd = () => {
    setEditingProject(null);
    setDialogOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleSave = async (
    data: ProjectCreate
  ) => {
    if (editingProject) {
      await updateProject(
        editingProject.id,
        data
      );
    } else {
      await addProject({
        ...data,
        display_order: projects.length,
      });
    }

    setDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!deletingProject) return;

    try {
      setDeleting(true);

      await deleteProject(
        deletingProject.id
      );

      setDeletingProject(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Stack
        direction="row"
        sx={{
          width: "100%",
          mt: 3,
          mb:1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
          >
            Projects
          </Typography>

         
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Project
        </Button>
      </Stack>

      {/* Empty state */}
      {!projects.length ? (
        <Card
          variant="outlined"
          sx={{
            py: 6,
            textAlign: "center",
          }}
        >
          <CardContent>
            <FolderOutlinedIcon
              sx={{
                fontSize: 48,
                color: "text.secondary",
                mb: 2,
              }}
            />

            <Typography
              variant="h6"
              gutterBottom
            >
              No projects yet
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              mb={3}
            >
              Add your first project to showcase
              your work.
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{mt:2}}
            >
              Add Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {projects.map((project) => (
            <Grid
              key={project.id}
              size={{ xs: 12, md: 6 }}
            >
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  transition:
                    "box-shadow 0.2s",
                  "&:hover": {
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    spacing={1}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                      >
                        {project.name}
                      </Typography>

                      {(project.start_date ||
                        project.end_date) && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {project.start_date ??
                            "—"}{" "}
                          —{" "}
                          {project.end_date ??
                            "Present"}
                        </Typography>
                      )}
                    </Box>

                    <IconButton
                      size="small"
                      onClick={() =>
                        handleEdit(project)
                      }
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() =>
                        setDeletingProject(
                          project
                        )
                      }
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>

                  {project.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      {project.description}
                    </Typography>
                  )}

                  {project.url && (
                    <Link
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        mt: 2,
                      }}
                    >
                      View Project
                      <LaunchIcon fontSize="inherit" />
                    </Link>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add / Edit */}
      <ProjectDialog
        open={dialogOpen}
        project={editingProject}
        onClose={() =>
          setDialogOpen(false)
        }
        onSubmit={handleSave}
      />

      {/* Delete confirmation */}
      <Dialog
        open={Boolean(deletingProject)}
        onClose={() =>
          deleting
            ? undefined
            : setDeletingProject(null)
        }
      >
        <DialogTitle>
          Delete project?
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>
              {deletingProject?.name}
            </strong>
            ? This action cannot be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setDeletingProject(null)
            }
            disabled={deleting}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting
              ? "Deleting..."
              : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}