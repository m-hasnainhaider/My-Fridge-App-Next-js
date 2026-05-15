"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, CheckCircle } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export default function NotificationsView() {
  const router = useRouter();
  const { alerts, setSearchTerm } = useDashboard();

  const onNavigateToRecipes = (
    itemName: string,
    priority: number,
    fullItem: any
  ) => {
    if (priority === 3) {
      router.push(`/dashboard/notification/${fullItem?.id ?? "detail"}`);
    } else {
      setSearchTerm(itemName || "");
      router.push("/dashboard/recipes");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        <button
          onClick={() => router.push("/dashboard/fridge")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            color: "#8b7e32",
          }}
        >
          <ArrowLeft size={24} />
          <span style={{ marginLeft: "5px", fontWeight: "bold" }}>Back</span>
        </button>
        <h1 style={{ fontSize: "32px", margin: 0 }}>Notifications & Alerts</h1>
      </div>

      {/* Alerts List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {alerts && alerts.length > 0 ? (
          alerts.map((item: any) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: "15px",
                borderLeft: `8px solid ${
                  item.priority === 1
                    ? "#ef4444"
                    : item.priority === 2
                    ? "#f59e0b"
                    : "#3b82f6"
                }`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <h3 style={{ margin: 0 }}>{item.name}</h3>
                  <span
                    style={{
                      fontSize: "10px",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      backgroundColor:
                        item.priority === 1
                          ? "#fee2e2"
                          : item.priority === 3
                          ? "#e0f2fe"
                          : "#fef3c7",
                      color:
                        item.priority === 1
                          ? "#ef4444"
                          : item.priority === 3
                          ? "#0369a1"
                          : "#d97706",
                      fontWeight: "bold",
                    }}
                  >
                    {item.alertType}
                  </span>
                </div>
                <p style={{ margin: "5px 0 0 0", color: "#444", fontWeight: "500" }}>
                  {item.alertMsg}
                </p>
                <small style={{ color: "#888" }}>
                  {item.priority === 3
                    ? "Action Required"
                    : `Fridge: ${item.qty}`}
                </small>
              </div>

              <div
                style={{
                  cursor: "pointer",
                  color: "#22c55e",
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() =>
                  onNavigateToRecipes(item.name, item.priority, item)
                }
              >
                <ChevronRight size={32} />
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <CheckCircle
              size={60}
              color="#22c55e"
              style={{ marginBottom: "20px" }}
            />
            <h2>No Alerts Found</h2>
          </div>
        )}
      </div>
    </div>
  );
}