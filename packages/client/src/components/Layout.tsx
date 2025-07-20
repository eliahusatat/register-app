import {
  AppShell,
  Title,
  Button,
  Group,
} from "@mantine/core";
import axios from "../utils/api";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  showLogout?: boolean;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    try {
    await axios.post("/logout"); 
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header p="md">
        <Group justify="space-between" align="center" h="100%">
          <Title order={3}>Register App</Title>
          {token ? (
              <Button
                size="xs"
                color="red"
                variant="light"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <Button
                size="xs"
                color="blue"
                variant="light"
                onClick={handleLogin}
              >
                Login
              </Button>
            )
          }
        </Group>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
