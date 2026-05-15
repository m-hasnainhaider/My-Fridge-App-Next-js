"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardProvider } from "@/context/DashboardContext";


import FridgeView from "@/app/dashboard/fridge/page";
import RecipesView from "@/app/dashboard/recipes/page";
import FavoritesView from "@/app/dashboard/favorites/page";
import HistoryView from "@/app/dashboard/history/page";
import MembersView from "@/app/admin/members/page";
import PairRequestsView from "@/app/dashboard/pair-requests/page";

interface Member {
  id: number;
  name: string;
  img: string;
}

interface Request {
  id: number;
  name: string;
  status: string;
  img: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [view, setView] = useState("fridge");
  const [showRequests, setShowRequests] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: "Abdul waris", img: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Huzaif", img: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Khan Nouman", img: "https://i.pravatar.cc/150?u=3" },
    { id: 4, name: "Syed Ali", img: "https://i.pravatar.cc/150?u=4" },
    { id: 5, name: "M Hassaan", img: "https://i.pravatar.cc/150?u=5" },
  ]);

  const [requests, setRequests] = useState<Request[]>([
    {
      id: 101,
      name: "Michael Chen",
      status: "Incoming Request",
      img: "https://i.pravatar.cc/150?u=11",
    },
    {
      id: 102,
      name: "Sophia Rodriguez",
      status: "Incoming Request",
      img: "https://i.pravatar.cc/150?u=12",
    },
  ]);

  const handleApproveRequest = (req: Request) => {
    const newMember = { ...req, id: Date.now() };
    setMembers([...members, newMember]);
    setRequests(requests.filter((r) => r.id !== req.id));
  };

  const handleDenyRequest = (id: number) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  const handleDeleteMember = (id: number) => {
    if (window.confirm("Remove this member?")) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  const logout = () => {
    if (window.confirm("Are you sure?")) {
      localStorage.removeItem("currentUser");
      router.push("/login");
    }
  };

  const handleSetView = (newView: string) => {
    setView(newView);
    setShowRequests(false);
    setShowHistory(false);
  };

  const styles = {
    container: {
      display: "flex",
      height: "100vh",
      backgroundColor: "#f4f4f9",
      width: "100vw",
    } as React.CSSProperties,
    sidebar: {
      width: "180px",
      backgroundColor: "#8b7e32",
      color: "#fff",
      padding: "25px 15px",
      display: "flex",
      flexDirection: "column",
      zIndex: 10,
    } as React.CSSProperties,
    btn: (isActive: boolean) =>
      ({
        width: "100%",
        padding: "12px",
        marginBottom: "5px",
        cursor: "pointer",
        backgroundColor: isActive ? "#22c55e" : "transparent",
        color: isActive ? "#fff" : "#adb5bd",
        border: "none",
        borderRadius: "8px",
        textAlign: "left",
        transition: "0.3s",
        fontWeight: "500",
      } as React.CSSProperties),
    divider: {
      borderTop: "1px solid #333",
      margin: "15px 0",
    },
    contentArea: {
      flex: 1,
      overflowY: "auto",
      position: "relative",
      backgroundColor: "#f0f2f5",
      display: "flex",
      flexDirection: "column",
    } as React.CSSProperties,
  };

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div>
          <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#22c55e" }}>
            🛡️ Admin Panel
          </h2>
        </div>
        <div style={styles.divider} />

        <button
          style={styles.btn(view === "fridge")}
          onClick={() => handleSetView("fridge")}
        >
          ❄️ My Fridge
        </button>
        <button
          style={styles.btn(view === "recipes")}
          onClick={() => handleSetView("recipes")}
        >
          📖 Recipes
        </button>
        <button
          style={styles.btn(view === "favorites")}
          onClick={() => handleSetView("favorites")}
        >
          ❤️ Favourites
        </button>

        <div style={styles.divider} />

        <button
          style={styles.btn(view === "members")}
          onClick={() => handleSetView("members")}
        >
          👥 Members List
        </button>

        <div style={{ marginTop: "auto" }}>
          <button
            style={{
              ...styles.btn(false),
              backgroundColor: "#dc3545",
              color: "white",
            }}
            onClick={logout}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div style={styles.contentArea}>
        {showHistory ? (
          <HistoryView onBack={() => setShowHistory(false)} />
        ) : showRequests ? (
          <PairRequestsView
            requests={requests}
            onApprove={handleApproveRequest}
            onBack={() => setShowRequests(false)}
          />
        ) : (
          <>
            {view === "members" && (
              <div style={{ padding: "40px" }}>
                <MembersView
                  members={members}
                  onDeleteMember={handleDeleteMember}
                  onRequestClick={() => setShowRequests(true)}
                  onBack={() => setView("fridge")}
                />
              </div>
            )}

            {view !== "members" && (
              <div
                style={{
                  flex: 1,
                  position: "relative",
                  width: "100%",
                  maxWidth: "1200px",
                  margin: "0 auto",
                }}
              >
                <DashboardProvider>
                  {view === "fridge" && <FridgeView />}
                  {view === "recipes" && <RecipesView />}
                  {view === "favorites" && <FavoritesView />}
                </DashboardProvider>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}