"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";

interface FridgeOwner {
  name: string;
  email: string;
  img: string;
}

interface AddMemberViewProps {
  onBack?: () => void;
  fridgeOwner?: FridgeOwner;
}

export default function AddMemberView({
  onBack,
  fridgeOwner,
}: AddMemberViewProps) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleBack = onBack || (() => router.back());

  // Default fridge owner when used as standalone page
  const owner: FridgeOwner = fridgeOwner || {
    name: "Huzaif Khan",
    email: "huzaif.khan@example.com",
    img: "https://i.pravatar.cc/150?u=2",
  };

  const handleSendRequest = () => {
    if (inputValue.trim()) {
      setShowPopup(true);
    } else {
      alert("Please enter a name or email");
    }
  };

  const styles = {
    container: {
      padding: "20px",
      maxWidth: "500px",
      margin: "0 auto",
      backgroundColor: "#fff",
      minHeight: "100vh",
      position: "relative",
    } as React.CSSProperties,
    header: {
      display: "flex",
      alignItems: "center",
      gap: "60px",
      marginBottom: "40px",
    } as React.CSSProperties,
    profileCard: {
      backgroundColor: "#f9fafb",
      borderRadius: "24px",
      padding: "30px",
      textAlign: "center",
      marginBottom: "40px",
      border: "1px solid #f0f0f0",
    } as React.CSSProperties,
    avatar: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      marginBottom: "15px",
      objectFit: "cover",
    } as React.CSSProperties,
    input: {
      width: "100%",
      padding: "15px",
      borderRadius: "12px",
      border: "1px solid #e5e7eb",
      marginBottom: "30px",
      fontSize: "16px",
      outline: "none",
      boxSizing: "border-box",
    } as React.CSSProperties,
    button: {
      width: "100%",
      padding: "16px",
      backgroundColor: "#4ade80",
      color: "white",
      border: "none",
      borderRadius: "16px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
    } as React.CSSProperties,
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    } as React.CSSProperties,
    popup: {
      backgroundColor: "white",
      padding: "30px",
      borderRadius: "20px",
      textAlign: "center",
      width: "80%",
      maxWidth: "350px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    } as React.CSSProperties,
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <ArrowLeft cursor="pointer" onClick={handleBack} size={24} />
        <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>
          Connect Pair
        </h2>
      </div>

      {/* Profile Card */}
      <div style={styles.profileCard}>
        <img
          src={owner.img}
          alt="Owner"
          style={styles.avatar}
        />
        <p
          style={{
            fontSize: "12px",
            color: "#9ca3af",
            fontWeight: "bold",
            margin: "0 0 5px 0",
          }}
        >
          FRIDGE OWNER
        </p>
        <h3 style={{ margin: "0 0 5px 0", fontSize: "20px" }}>
          {owner.name}
        </h3>
        <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
          {owner.email}
        </p>
      </div>

      {/* Input */}
      <label
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "15px",
          display: "block",
        }}
      >
        Enter Pair Verification
      </label>
      <input
        type="text"
        placeholder="Enter email or username"
        style={styles.input}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      {/* Send Button */}
      <button style={styles.button} onClick={handleSendRequest}>
        Send Pair Request
      </button>

      {/* Success Popup */}
      {showPopup && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <CheckCircle
              size={60}
              color="#4ade80"
              style={{ marginBottom: "15px" }}
            />
            <h2 style={{ margin: "0 0 10px 0" }}>Request Sent!</h2>
            <p style={{ color: "#6b7280", marginBottom: "20px" }}>
              Your pair request has been sent to{" "}
              <strong>{inputValue}</strong> successfully.
            </p>
            <button
              style={{ ...styles.button, padding: "12px" }}
              onClick={handleBack}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}