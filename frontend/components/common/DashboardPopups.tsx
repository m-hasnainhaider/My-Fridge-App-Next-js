"use client";

import { CheckCircle } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

// ── Styles ─────────────────────────────────────────────────────────────────

const overlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 3000,
};

const modal: React.CSSProperties = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "25px",
  width: "320px",
  textAlign: "center",
};

const btnPrimary: React.CSSProperties = {
  width: "100%",
  padding: "15px",
  backgroundColor: "#22c55e",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontWeight: "bold",
  cursor: "pointer",
};

// ── Component ──────────────────────────────────────────────────────────────

export default function DashboardPopups() {
  const {
    showSuccessPopup,
    setShowSuccessPopup,
    setRecipeBroadcasts,
    setNotificationSent,
    notificationSent,
  } = useDashboard();

  const handleNotifyEveryone = () => {
    if (showSuccessPopup && showSuccessPopup.recipeName) {
      setRecipeBroadcasts((prev: any[]) => [
        ...prev,
        {
          recipeName: showSuccessPopup.recipeName,
          missingItems: showSuccessPopup.missingItems || [],
        },
      ]);
    }
    setNotificationSent(true);
    setShowSuccessPopup(false);
  };

  return (
    <>
      {/* Missing Ingredients Popup */}
      {showSuccessPopup && (
        <div style={overlay}>
          <div style={modal}>
            <h2 style={{ margin: "0 0 10px" }}>Ready to Cook?</h2>
            <p style={{ margin: "0 0 10px" }}>
              Notify members about missing ingredients?
            </p>
            <p style={{ fontSize: "12px", color: "#666" }}>
              {showSuccessPopup.missingItems?.join(", ")}
            </p>
            <button style={btnPrimary} onClick={handleNotifyEveryone}>
              Notify Everyone
            </button>
            <button
              style={{
                marginTop: "10px",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => setShowSuccessPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Notification Sent Popup */}
      {notificationSent && (
        <div style={overlay}>
          <div style={modal}>
            <CheckCircle
              size={50}
              color="#22c55e"
              style={{ marginBottom: "15px" }}
            />
            <h2 style={{ margin: "0 0 15px" }}>Action Recorded!</h2>
            <button
              style={btnPrimary}
              onClick={() => setNotificationSent(false)}
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </>
  );
}