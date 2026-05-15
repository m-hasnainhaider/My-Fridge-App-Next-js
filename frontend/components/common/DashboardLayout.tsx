"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Refrigerator,
  BookOpen,
  Heart,
  LogOut,
  Bell,
  Clock,
  Search,
  User,
} from "lucide-react";
import { useDashboardOptional } from "@/context/DashboardContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const user = JSON.parse(
    typeof window !== "undefined"
      ? localStorage.getItem("currentUser") || "{}"
      : "{}"
  );

  const dashboard = useDashboardOptional();
  const alertsCount = dashboard?.alerts?.length ?? 0;

  const isActive = (path: string) =>
    pathname
      .replace(/^\/dashboard\/?/, "")
      .startsWith(path.replace(/^\/dashboard\/?/, ""));

  const styles = {
    layout: {
      display: "flex",
      height: "100vh",
      width: "100vw",
      backgroundColor: "#f0f2f5",
      overflow: "hidden",
    } as React.CSSProperties,
    sidebar: {
      width: "240px",
      backgroundColor: "#8b7e32",
      display: "flex",
      flexDirection: "column",
      color: "#fff",
    } as React.CSSProperties,
    mainContainer: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    } as React.CSSProperties,
    header: {
      height: "70px",
      backgroundColor: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 30px",
      borderBottom: "1px solid #ddd",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    } as React.CSSProperties,
    contentOutlet: {
      flex: 1,
      overflowY: "auto",
      padding: "30px",
    } as React.CSSProperties,
    navItem: (path: string) =>
      ({
        display: "flex",
        alignItems: "center",
        padding: "15px 20px",
        cursor: "pointer",
        backgroundColor: isActive(path)
          ? "rgba(255,255,255,0.1)"
          : "transparent",
        color: "#fff",
        border: "none",
        width: "100%",
        gap: "15px",
        fontSize: "16px",
        borderLeft: isActive(path)
          ? "4px solid #4ade80"
          : "4px solid transparent",
      } as React.CSSProperties),
  };

  return (
    <div style={styles.layout}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div
          style={{
            padding: "30px 20px",
            textAlign: "center",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "24px" }}>Smart Fridge</h2>
        </div>

        <div style={{ flex: 1, marginTop: "20px" }}>
          <button
            style={styles.navItem("fridge")}
            onClick={() => router.push("/dashboard/fridge")}
          >
            <Refrigerator size={22} /> My Fridge
          </button>
          <button
            style={styles.navItem("recipes")}
            onClick={() => router.push("/dashboard/recipes")}
          >
            <BookOpen size={22} /> Recipes
          </button>
          <button
            style={styles.navItem("favorites")}
            onClick={() => router.push("/dashboard/favorites")}
          >
            <Heart size={22} /> Favorites
          </button>
          <button
            style={styles.navItem("notifications")}
            onClick={() => router.push("/dashboard/notifications")}
          >
            <Bell size={22} /> Notifications
            {alertsCount > 0 && (
              <span
                style={{
                  marginLeft: "auto",
                  background: "#ef4444",
                  minWidth: "18px",
                  height: "18px",
                  borderRadius: "9px",
                  fontSize: "11px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {alertsCount}
              </span>
            )}
          </button>
          <button
            style={styles.navItem("history")}
            onClick={() => router.push("/dashboard/history")}
          >
            <Clock size={22} /> History
          </button>
          <button
            style={styles.navItem("profile")}
            onClick={() => router.push("/dashboard/profile")}
          >
            <User size={22} /> Profile
          </button>
        </div>

        {/* Logout */}
        <button
          style={styles.navItem("logout")}
          onClick={() => {
            localStorage.removeItem("currentUser");
            router.push("/login");
          }}
        >
          <LogOut size={22} /> Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.mainContainer}>
        {/* HEADER */}
        <header style={styles.header}>
          {/* Search Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f0f2f5",
              padding: "8px 15px",
              borderRadius: "10px",
              width: "400px",
            }}
          >
            <Search size={18} color="#888" />
            <input
              placeholder="Search items..."
              style={{
                border: "none",
                background: "none",
                outline: "none",
                marginLeft: "10px",
                width: "100%",
              }}
            />
          </div>

          {/* Right Side Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
            {/* Bell Icon */}
            <div
              style={{ cursor: "pointer", position: "relative" }}
              onClick={() => router.push("/dashboard/notifications")}
            >
              <Bell size={22} color="#555" />
              {alertsCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-2px",
                    background: "#ef4444",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>

            {/* Clock Icon */}
            <Clock
              size={22}
              color="#555"
              style={{ cursor: "pointer" }}
              onClick={() => router.push("/dashboard/history")}
            />

            {/* User Profile */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                backgroundColor: "#f9f9f9",
                padding: "5px 15px",
                borderRadius: "20px",
              }}
              onClick={() => router.push("/dashboard/profile")}
            >
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "#333",
                  }}
                >
                  {user.fullName || "User"}
                </div>
                <div style={{ fontSize: "12px", color: "#22c55e" }}>
                  Online
                </div>
              </div>
              <User size={20} color="#8b7e32" />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main style={styles.contentOutlet}>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;