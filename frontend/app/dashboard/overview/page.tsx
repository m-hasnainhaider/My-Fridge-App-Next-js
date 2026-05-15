"use client";

import { useRouter } from "next/navigation";
import { useDashboard } from "@/context/DashboardContext";

export default function OverviewView() {
  const router = useRouter();
  const { fridgeItems, alerts } = useDashboard();
  const fridgeItemsCount = fridgeItems?.length ?? 0;
  const alertsCount = alerts?.length ?? 0;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>Overview</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {/* Total Items Card */}
        <div
          style={{
            padding: "20px",
            borderRadius: "15px",
            backgroundColor: "#cbd8d4",
          }}
        >
          <p style={{ margin: 0, color: "#666" }}>Total Items</p>
          <h2 style={{ fontSize: "28px", margin: 0 }}>{fridgeItemsCount}</h2>
        </div>

        {/* Active Alerts Card */}
        <div
          style={{
            padding: "20px",
            borderRadius: "15px",
            backgroundColor: "#fecaca",
            cursor: "pointer",
          }}
          onClick={() => router.push("/dashboard/notifications")}
        >
          <p style={{ margin: 0, color: "#666" }}>Active Alerts</p>
          <h2 style={{ fontSize: "28px", margin: 0, color: "#dc3545" }}>
            {alertsCount}
          </h2>
        </div>
      </div>
    </div>
  );
}