"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, PlusCircle, Trash2, Calendar } from "lucide-react";

export default function HistoryView() {
  const router = useRouter();
  const handleBack = () => router.push("/dashboard/fridge");
  const months = ["February 2026", "January 2026"];

  const styles = {
    container: {
      padding: "20px",
      maxWidth: "600px",
      margin: "0 auto",
      backgroundColor: "#fff",
      minHeight: "100vh",
    } as React.CSSProperties,
    header: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
      marginBottom: "30px",
    } as React.CSSProperties,
    monthSection: {
      marginBottom: "30px",
    },
    monthTitle: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "18px",
      fontWeight: "bold",
      color: "#1a1a1a",
      backgroundColor: "#f8f9fa",
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "15px",
    } as React.CSSProperties,
    card: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "15px",
      borderBottom: "1px solid #f0f0f0",
    } as React.CSSProperties,
    actionIcon: (isAdd: boolean) =>
      ({
        backgroundColor: isAdd ? "#f0fdf4" : "#fef2f2",
        padding: "8px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
      } as React.CSSProperties),
    time: {
      fontSize: "12px",
      color: "#9ca3af",
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <ArrowLeft
          cursor="pointer"
          onClick={handleBack}
          size={24}
        />
        <h2 style={{ fontSize: "22px", fontWeight: "bold", margin: 0 }}>
          Fridge History
        </h2>
      </div>

      {/* Month Sections */}
      {months.map((month) => (
        <div key={month} style={styles.monthSection}>
          <div style={styles.monthTitle}>
            <Calendar size={18} color="#22c55e" />
            {month}
          </div>

          {/* Added Item */}
          <div style={styles.card}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={styles.actionIcon(true)}>
                <PlusCircle size={20} color="#22c55e" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "16px" }}>
                  Milk Bottle Added
                </h4>
                <span style={styles.time}>Today, 10:30 AM • by Admin</span>
              </div>
            </div>
          </div>

          {/* Removed Item */}
          <div style={styles.card}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={styles.actionIcon(false)}>
                <Trash2 size={20} color="#ef4444" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "16px" }}>
                  Apples Removed
                </h4>
                <span style={styles.time}>
                  Yesterday, 04:15 PM • by Huzaif
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}