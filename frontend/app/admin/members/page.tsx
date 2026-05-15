"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Trash2, Plus } from "lucide-react";
import AddMemberView from "@/components/AddMemberView";

interface Member {
  id: number;
  name: string;
  img: string;
}

interface MembersViewProps {
  members?: Member[];
  onDeleteMember?: (id: number) => void;
  onRequestClick?: () => void;
  onBack?: () => void;
}

export default function MembersView({
  members,
  onDeleteMember,
  onRequestClick,
  onBack,
}: MembersViewProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const handleBack = onBack || (() => router.back());
  const handleRequestClick = onRequestClick || (() => router.push("/admin/pair-requests"));

  // Loading state
  if (!members) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Loading Members...
      </div>
    );
  }

  // Add Member View
  if (isAdding) {
    return (
      <AddMemberView
        onBack={() => setIsAdding(false)}
        fridgeOwner={{
          name: "Huzaif Khan",
          email: "huzaif.khan@example.com",
          img: "https://i.pravatar.cc/150?u=2",
        }}
      />
    );
  }

  const styles = {
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "25px",
      padding: "0 10px",
    } as React.CSSProperties,
    requestLink: {
      display: "flex",
      alignItems: "center",
      gap: "5px",
      color: "#4ade80",
      cursor: "pointer",
      fontWeight: "600",
    } as React.CSSProperties,
    listTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#1a1a1a",
    },
    memberRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "15px 0",
      borderBottom: "1px solid #f0f0f0",
    } as React.CSSProperties,
    avatar: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      objectFit: "cover",
    } as React.CSSProperties,
    addButton: {
      position: "fixed",
      bottom: "30px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "#4ade80",
      color: "white",
      padding: "12px 30px",
      borderRadius: "30px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      border: "none",
      fontWeight: "bold",
      fontSize: "16px",
      cursor: "pointer",
      boxShadow: "0 4px 15px rgba(74, 222, 128, 0.3)",
    } as React.CSSProperties,
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
        padding: "10px",
        minHeight: "90vh",
        position: "relative",
      }}
    >
      {/* Header */}
      <div style={styles.header}>
        <ArrowLeft
          cursor="pointer"
          onClick={handleBack}
          size={24}
        />
        <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>
          Pairs
        </h2>
        <div style={styles.requestLink} onClick={handleRequestClick}>
          <Bell size={18} fill="#4ade80" />
          <span>Requests</span>
        </div>
      </div>

      <h3 style={styles.listTitle}>Your Connected Members</h3>

      {/* Members List */}
      <div style={{ marginBottom: "100px" }}>
        {members.map((member) => (
          <div key={member.id} style={styles.memberRow}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "15px" }}
            >
              <img
                src={member.img}
                alt={member.name}
                style={styles.avatar}
              />
              <span
                style={{
                  fontSize: "17px",
                  fontWeight: "600",
                  color: "#333",
                }}
              >
                {member.name}
              </span>
            </div>

            <Trash2
              size={20}
              color="#ff6b6b"
              cursor="pointer"
              onClick={() => onDeleteMember?.(member.id)}
              style={{ padding: "5px" }}
            />
          </div>
        ))}
      </div>

      {/* Add Member Button */}
      <button style={styles.addButton} onClick={() => setIsAdding(true)}>
        <Plus size={20} /> Add Member
      </button>
    </div>
  );
}