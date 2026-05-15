"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function ChangePasswordView() {
  const router = useRouter();
  const user = JSON.parse(
    typeof window !== "undefined"
      ? localStorage.getItem("currentUser") || "{}"
      : "{}"
  );

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleUpdate = () => {
    if (!currentPass || !newPass || !confirmPass)
      return alert("Please fill all fields.");
    if (currentPass !== user.password)
      return alert("Current password is incorrect!");
    if (newPass !== confirmPass)
      return alert("New password and confirm do not match.");

    const allUsers = JSON.parse(
      localStorage.getItem("users") || "[]"
    );
    const updatedUser = { ...user, password: newPass };
    const updatedUsersList = allUsers.map((u: any) =>
      u.email === user.email ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsersList));
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    alert("Password updated successfully!");
    router.push("/dashboard/profile");
  };

  const toggleShow = (field: "current" | "new" | "confirm") =>
    setShowPass((prev) => ({ ...prev, [field]: !prev[field] }));

  const styles = {
    container: {
      padding: "20px",
      maxWidth: "500px",
      margin: "0 auto",
    },
    header: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginBottom: "40px",
    } as React.CSSProperties,
    inputGroup: {
      marginBottom: "20px",
      position: "relative",
    } as React.CSSProperties,
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "600",
      fontSize: "14px",
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "14px",
      paddingRight: "45px",
      borderRadius: "12px",
      border: "1px solid #ddd",
      fontSize: "16px",
      outline: "none",
      boxSizing: "border-box",
    } as React.CSSProperties,
    eyeIcon: {
      position: "absolute",
      right: "15px",
      top: "38px",
      cursor: "pointer",
      color: "#888",
    } as React.CSSProperties,
    updateBtn: {
      width: "100%",
      padding: "16px",
      backgroundColor: "#22c55e",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "30px",
    } as React.CSSProperties,
    cancelBtn: {
      width: "100%",
      padding: "16px",
      backgroundColor: "white",
      color: "#22c55e",
      border: "2px solid #22c55e",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "12px",
    } as React.CSSProperties,
  };

  const fields: {
    id: "current" | "new" | "confirm";
    label: string;
    val: string;
    set: React.Dispatch<React.SetStateAction<string>>;
  }[] = [
    {
      id: "current",
      label: "Current Password",
      val: currentPass,
      set: setCurrentPass,
    },
    {
      id: "new",
      label: "New Password",
      val: newPass,
      set: setNewPass,
    },
    {
      id: "confirm",
      label: "Confirm New Password",
      val: confirmPass,
      set: setConfirmPass,
    },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button
          onClick={() => router.push("/dashboard/profile")}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0 }}>Change Password</h2>
      </div>

      {/* Password Fields */}
      {fields.map((field) => (
        <div key={field.id} style={styles.inputGroup}>
          <label style={styles.label}>{field.label}</label>
          <input
            type={showPass[field.id] ? "text" : "password"}
            style={styles.input}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            value={field.val}
            onChange={(e) => field.set(e.target.value)}
          />
          <div
            style={styles.eyeIcon}
            onClick={() => toggleShow(field.id)}
          >
            {showPass[field.id] ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </div>
        </div>
      ))}

      {/* Buttons */}
      <button style={styles.updateBtn} onClick={handleUpdate}>
        Update Password
      </button>
      <button
        style={styles.cancelBtn}
        onClick={() => router.push("/dashboard/profile")}
      >
        Cancel
      </button>
    </div>
  );
}