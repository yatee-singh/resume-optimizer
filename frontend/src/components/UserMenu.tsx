import { useState } from "react";
import {
  Avatar,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuth } from "../context/AuthContext";

export default function UserMenu() {
  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{ ml: 1 }}
        aria-label="user menu"
        aria-controls={
          open ? "user-menu" : undefined
        }
        aria-haspopup="true"
        aria-expanded={
          open ? "true" : undefined
        }
      >
        <Avatar
          sx={{
            width: 34,
            height: 34,
            bgcolor: "primary.main",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {user?.name?.[0]?.toUpperCase()}
        </Avatar>
      </IconButton>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 260,
              borderRadius: 2,
            },
          },
        }}
      >
        {/* User information */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
          >
            {user?.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              wordBreak: "break-word",
            }}
          >
            {user?.email}
          </Typography>
        </Box>

        <Divider />

        {/* Logout */}
        <MenuItem
          onClick={handleLogout}
          sx={{
            mt: 0.5,
            mb: 0.5,
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>

          <ListItemText>
            Logout
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}