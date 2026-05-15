"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, User, Edit, Lock, LogOut } from "lucide-react";

export default function ProfileView() {
  const router = useRouter();
  const user = JSON.parse(
    typeof window !== "undefined"
      ? localStorage.getItem("currentUser") || "{}"
      : "{}"
  );

  const styles = {
    container: {
      padding: "20px",
      maxWidth: "500px",
      margin: "0 auto",
      textAlign: "center",
    } as React.CSSProperties,
    header: {
      display: "flex",
      alignItems: "center",
      marginBottom: "40px",
      gap: "15px",
    } as React.CSSProperties,
    profileCard: {
      backgroundColor: "#fff",
      padding: "30px",
      borderRadius: "25px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
      marginBottom: "30px",
    } as React.CSSProperties,
    avatar: {
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      backgroundColor: "#f0fdf4",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "0 auto 20px",
      border: "4px solid #22c55e",
    } as React.CSSProperties,
    name: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#333",
      margin: "10px 0 5px",
    },
    email: {
      fontSize: "16px",
      color: "#666",
      marginBottom: "0",
    },
    buttonGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    } as React.CSSProperties,
    btnGreen: {
      width: "100%",
      padding: "16px",
      backgroundColor: "#22c55e",
      color: "white",
      border: "none",
      borderRadius: "14px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
    } as React.CSSProperties,
    btnLogout: {
      width: "100%",
      padding: "16px",
      backgroundColor: "#ef4444",
      color: "white",
      border: "none",
      borderRadius: "14px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
    } as React.CSSProperties,
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button
          onClick={() => router.push("/dashboard/fridge")}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <ArrowLeft size={24} color="#333" />
        </button>
        <h2 style={{ margin: 0 }}>Profile</h2>
      </div>

      {/* Profile Card */}
      <div style={styles.profileCard}>
        <div style={styles.avatar}>
          <User size={60} color="#22c55e" />
        </div>
        <h3 style={styles.name}>{user.fullName || "User"}</h3>
        <p style={styles.email}>{user.email || ""}</p>
      </div>

      {/* Buttons */}
      <div style={styles.buttonGroup}>
        <button
          style={styles.btnGreen}
          onClick={() => router.push("/dashboard/edit-profile")}
        >
          <Edit size={20} /> Edit Profile
        </button>
        <button
          style={styles.btnGreen}
          onClick={() => router.push("/dashboard/change-password")}
        >
          <Lock size={20} /> Change Password
        </button>
        <button style={styles.btnLogout} onClick={handleLogout}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
}