import { useState, useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import Layout from "./components/Layout";
import ConnectionLogsPage from "./pages/ConnectionLogsPage";
import { showNotification } from "@mantine/notifications";


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("token");
  });

  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const onLogin = () => {
    setIsLoggedIn(true); 
    const raw = localStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
    showNotification({
      title: "Success",
      message: "Login successful!",
      color: "green",
      styles: {
      root: {
      maxWidth: 400
      }   
      }
    });
  };

useEffect(() => {
  const sync = () => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    const raw = localStorage.getItem("user");
    setUser(raw ? JSON.parse(raw) : null);
  };

  window.addEventListener("storage", sync);
  return () => window.removeEventListener("storage", sync);
}, []);

  // Layout wrapper for all authenticated pages
  const ProtectedLayout = () => {
    return isLoggedIn ? (
      <Layout showLogout={isLoggedIn}>
        <Outlet />
      </Layout>
    ) : (
      <Navigate to="/login" replace />
    );
  };

const AdminOnlyLayout = () => {
  return user?.role === "admin" ? <Outlet /> : <Navigate to="/users" replace />;
};

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/register" element={<Layout showLogout={isLoggedIn}><RegisterPage /></Layout>} />
      <Route path="/login" element={<Layout showLogout={isLoggedIn}><LoginPage onLogin={onLogin} /></Layout>} />

      {/* Protected Pages */}
      <Route element={<ProtectedLayout />}>
        <Route path="/users"   element={<UsersPage /> } />
        <Route path="/logs" element={<ConnectionLogsPage />} />
          {/* <Route element={<AdminOnlyLayout />}>
            <Route path="/logs" element={<ConnectionLogsPage />} />
          </Route> */}
      </Route>

      {/* Default fallback */}
      <Route path="*" element={<Navigate to={isLoggedIn ? "/users" : "/login"} replace />} />
    </Routes>
  );
}
