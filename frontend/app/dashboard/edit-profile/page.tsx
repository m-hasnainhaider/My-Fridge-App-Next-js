"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, User } from "lucide-react";

export default function EditProfileView() {
  const router = useRouter();
  const user = JSON.parse(
    typeof window !== "undefined"
      ? localStorage.getItem("currentUser") || "{}"
      : "{}"
  );

  const [fullName, setFullName] = useState(user.fullName || "");
  const [profilePic, setProfilePic] = useState(user.profilePic || "");
  const [email] = useState(user.email || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!fullName.trim()) return alert("Name cannot be empty!");
    const updatedUser = { ...user, fullName, profilePic };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    router.push("/dashboard/profile");
  };

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
      marginBottom: "30px",
    } as React.CSSProperties,
    avatarSection: {
      position: "relative",
      width: "120px",
      margin: "0 auto 40px",
      cursor: "pointer",
    } as React.CSSProperties,
    avatar: {
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "4px solid #22c55e",
    } as React.CSSProperties,
    placeholder: {
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      backgroundColor: "#f0fdf4",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: "4px solid #22c55e",
    } as React.CSSProperties,
    inputGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "bold",
      fontSize: "14px",
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "14px",
      borderRadius: "12px",
      border: "1px solid #ddd",
      fontSize: "16px",
      boxSizing: "border-box",
    } as React.CSSProperties,
    disabledInput: {
      width: "100%",
      padding: "14px",
      borderRadius: "12px",
      border: "1px solid #eee",
      backgroundColor: "#f9f9f9",
      color: "#888",
      fontSize: "16px",
      cursor: "not-allowed",
      boxSizing: "border-box",
    } as React.CSSProperties,
    saveBtn: {
      width: "100%",
      padding: "16px",
      backgroundColor: "#22c55e",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "10px",
    } as React.CSSProperties,
    cancelBtn: {
      width: "100%",
      padding: "16px",
      backgroundColor: "white",
      color: "#22c55e",
      border: "2px solid #22c55e",
      borderRadius: "12px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "12px",
    } as React.CSSProperties,
  };

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
        <h2 style={{ margin: 0 }}>Edit Profile</h2>
      </div>

      {/* Avatar Section */}
      <div
        style={styles.avatarSection}
        onClick={() => fileInputRef.current?.click()}
      >
        {profilePic ? (
          <img src={profilePic} alt="Profile" style={styles.avatar} />
        ) : (
          <div style={styles.placeholder}>
            <User size={60} color="#22c55e" />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: "5px",
            right: "5px",
            backgroundColor: "#fff",
            padding: "8px",
            borderRadius: "50%",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Camera size={18} color="#22c55e" />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      {/* Full Name */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Full Name</label>
        <input
          style={styles.input}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>

      {/* Email */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Email Address</label>
        <input style={styles.disabledInput} value={email} readOnly />
        <small style={{ color: "#888", fontSize: "11px" }}>
          Email cannot be changed.
        </small>
      </div>

      {/* Buttons */}
      <button style={styles.saveBtn} onClick={handleSave}>
        Save Changes
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