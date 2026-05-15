"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Request {
  id: number;
  name: string;
  status: string;
  img: string;
}

export default function PairRequestsView() {
  const router = useRouter();

  const [requests, setRequests] = useState<Request[]>([
    {
      id: 1,
      name: "Michael Chen",
      status: "Incoming Request",
      img: "https://i.pravatar.cc/150?u=1",
    },
    {
      id: 2,
      name: "Sophia Rodriguez",
      status: "Incoming Request",
      img: "https://i.pravatar.cc/150?u=2",
    },
    {
      id: 3,
      name: "David Lee",
      status: "Incoming Request",
      img: "https://i.pravatar.cc/150?u=3",
    },
    {
      id: 4,
      name: "Emily Wong",
      status: "Moved to Pairs list",
      img: "https://i.pravatar.cc/150?u=4",
    },
  ]);

  const handleAction = (id: number, action: "Allow" | "Deny") => {
    console.log(`User ${id} was ${action}`);
    if (action === "Allow") {
      setRequests(
        requests.map((r) =>
          r.id === id ? { ...r, status: "Moved to Pairs list" } : r
        )
      );
    } else {
      setRequests(requests.filter((r) => r.id !== id));
    }
  };

  return (
    <div
      style={{ padding: "20px", backgroundColor: "#fff", minHeight: "100vh" }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <ArrowLeft
          onClick={() => router.back()}
          style={{ cursor: "pointer", marginRight: "20px" }}
        />
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Pair Requests</h1>
      </div>

      {/* Requests List */}
      <div
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        {requests.map((req) => (
          <div
            key={req.id}
            style={{
              padding: "20px",
              borderRadius: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              backgroundColor: "#fff",
              border: "1px solid #f0f0f0",
            }}
          >
            {/* Request Info */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginBottom: "15px",
              }}
            >
              <img
                src={req.img}
                alt={req.name}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                }}
              />
              <div>
                <h3 style={{ margin: 0, fontSize: "18px" }}>{req.name}</h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: req.status.includes("Moved") ? "#22c55e" : "#888",
                  }}
                >
                  {req.status}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {req.status === "Incoming Request" && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => handleAction(req.id, "Deny")}
                  style={{
                    padding: "10px 30px",
                    backgroundColor: "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Deny
                </button>
                <button
                  onClick={() => handleAction(req.id, "Allow")}
                  style={{
                    padding: "10px 30px",
                    backgroundColor: "#22c55e",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Allow
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}