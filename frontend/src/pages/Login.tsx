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

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

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
                  Welcome Back
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Sign in to continue
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
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />

                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                  >
                    {loading
                      ? "Signing In..."
                      : "Sign In"}
                  </Button>
                </Stack>
              </Box>

              <Typography
                variant="body2"
                textAlign="center"
              >
                Don't have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/signup"
                >
                  Sign Up
                </Link>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
