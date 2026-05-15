"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export default function NotificationDetailView() {
  const { id } = useParams();
  const router = useRouter();

  // ✅ Get broadcast from alerts context by id (replaces location.state)
  const { alerts, setRecipeBroadcasts } = useDashboard();
  const broadcast = alerts?.find((a: any) => String(a.id) === String(id)) ?? null;

  const onBack = () => router.push("/dashboard/notifications");

  const onComplete = (bid: any) => {
    setRecipeBroadcasts((prev: any[]) =>
      prev.filter((_: any, idx: number) => `broadcast-${idx}` !== bid)
    );
    router.push("/dashboard/notifications");
  };

  // Not found state
  if (!broadcast) {
    return (
      <div style={{ padding: "50px", textAlign: "center", color: "#666" }}>
        <h3>Loading details...</h3>
        <button
          onClick={onBack}
          style={{
            marginTop: "10px",
            color: "#22c55e",
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const styles = {
    container: {
      padding: "20px",
      maxWidth: "600px",
      margin: "0 auto",
      backgroundColor: "#f9fafb",
      minHeight: "100%",
    } as React.CSSProperties,
    header: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginBottom: "30px",
    } as React.CSSProperties,
    statusCard: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "16px",
      border: "1px solid #eee",
      marginBottom: "25px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    } as React.CSSProperties,
    ingredientItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#fff",
      padding: "15px 20px",
      borderRadius: "14px",
      marginBottom: "10px",
      border: "1px solid #f3f4f6",
    } as React.CSSProperties,
    badge: {
      backgroundColor: "#fee2e2",
      color: "#ef4444",
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
    } as React.CSSProperties,
    footer: {
      marginTop: "40px",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    } as React.CSSProperties,
    mainBtn: {
      backgroundColor: "#22c55e",
      color: "white",
      padding: "16px",
      borderRadius: "14px",
      border: "none",
      fontWeight: "bold",
      fontSize: "16px",
      cursor: "pointer",
    } as React.CSSProperties,
    secBtn: {
      backgroundColor: "white",
      color: "#22c55e",
      padding: "16px",
      borderRadius: "14px",
      border: "2px solid #22c55e",
      fontWeight: "bold",
      fontSize: "16px",
      cursor: "pointer",
    } as React.CSSProperties,
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <ArrowLeft size={24} color="#333" />
        </button>
        <h2 style={{ margin: 0, fontSize: "22px" }}>Notification Detail</h2>
      </div>

      {/* Status Card */}
      <div style={styles.statusCard}>
        <h4 style={{ margin: "0 0 10px 0", color: "#666" }}>
          Notification Status
        </h4>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#f59e0b",
            fontWeight: "600",
          }}
        >
          <Clock size={18} /> Pending
        </div>
      </div>

      {/* Missing Ingredients */}
      <h3 style={{ fontSize: "18px", marginBottom: "15px" }}>
        Ingredients Missing
      </h3>
      <div style={{ marginBottom: "20px" }}>
        {broadcast.missingItems && broadcast.missingItems.length > 0 ? (
          broadcast.missingItems.map((item: string, idx: number) => (
            <div key={idx} style={styles.ingredientItem}>
              <div>
                <div style={{ fontWeight: "bold", color: "#333" }}>{item}</div>
                <div style={{ fontSize: "13px", color: "#888" }}>
                  Needed for {broadcast.recipeName}
                </div>
              </div>
              <div style={styles.badge}>Missing</div>
            </div>
          ))
        ) : (
          <p style={{ color: "#999" }}>No specific ingredients listed.</p>
        )}
      </div>

      {/* Footer Buttons */}
      <div style={styles.footer}>
        <button
          style={styles.mainBtn}
          onClick={() => onComplete(broadcast.id)}
        >
          I'll Bring This
        </button>
        <button style={styles.secBtn} onClick={onBack}>
          Notify Others
        </button>
      </div>
    </div>
  );
}