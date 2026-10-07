import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { register } from "../services/authApi";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const [error,
    setError] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match"
      );
      return;
    }

    try {
      setLoading(true);

      await register(
        name,
        email,
        password
      );

      navigate("/login");
    } catch (err) {
      setError(
        "Unable to create account"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Card
          elevation={4}
          sx={{
            width: "100%",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  Create Account
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Build your resume profile
                </Typography>
              </Box>

              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit}
              >
                <Stack spacing={2}>
                  <TextField
                    label="Full Name"
                    fullWidth
                    required
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                  />

                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                  />

                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                  />

                  <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    required
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                  />

                  <Button
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={loading}
                  >
                    {loading
                      ? "Creating..."
                      : "Create Account"}
                  </Button>
                </Stack>
              </Box>

              <Typography
                variant="body2"
                textAlign="center"
              >
                Already have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/login"
                >
                  Sign In
                </Link>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

