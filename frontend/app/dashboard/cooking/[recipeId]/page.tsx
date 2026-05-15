"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";

// ✅ Same shared recipe data (move to @/data/recipes.ts later)
const recipesData = [
  {
    id: 1,
    name: "Biryani",
    tag: "Healthy",
    desc: "Light and refreshing with fresh herbs.",
    img: "/Biryani.png",
    servings: 6,
    ingredients: [
      { name: "Chicken", baseQty: 1.5, unit: "kg" },
      { name: "Rice", baseQty: 1, unit: "kg" },
    ],
    steps: ["Wash Chicken...", "Boil Rice...", "Serve fresh!"],
  },
  {
    id: 2,
    name: "Omelette",
    tag: "Breakfast",
    desc: "Creamy, spicy, and quick to make!",
    img: "https://images.unsplash.com/photo-1510629954389-c1e0da47d414",
    servings: 1,
    ingredients: [
      { name: "Eggs", baseQty: 2, unit: "pcs" },
      { name: "Onion", baseQty: 0.5, unit: "pcs" },
    ],
    steps: ["Whisk eggs...", "Pour on pan...", "Cook until golden"],
  },
];

export default function CookingProcessView() {
  const { recipeId } = useParams();
  const router = useRouter();

  // ✅ Find recipe by id from data (replaces location.state)
  const recipe = recipesData.find((r) => r.id === Number(recipeId)) ?? null;
  const [view, setView] = useState("ready");

  const onBack = () => router.push("/dashboard/recipes");

  const btnStyle: React.CSSProperties = {
    width: "100%",
    padding: "15px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "10px",
  };

  // Recipe not found
  if (!recipe) {
    return (
      <div style={{ padding: "20px" }}>
        <button onClick={onBack}>Back to Recipes</button>
        <p>Recipe not found.</p>
      </div>
    );
  }

  // View 1 — Ready to Cook
  if (view === "ready") {
    return (
      <div style={{ padding: "20px" }}>
        <ArrowLeft
          onClick={onBack}
          cursor="pointer"
          style={{ marginBottom: "20px" }}
        />
        <h2 style={{ textAlign: "center" }}>Ready to Cook</h2>
        <img
          src={recipe.img}
          style={{
            width: "100%",
            height: "200px",
            borderRadius: "15px",
            objectFit: "cover",
          }}
          alt={recipe.name}
        />
        <h3 style={{ margin: "15px 0" }}>{recipe.name}</h3>
        <div
          style={{
            backgroundColor: "#22c55e",
            color: "white",
            padding: "12px",
            borderRadius: "10px",
            textAlign: "center",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <CheckCircle size={18} /> All ingredients available!
        </div>
        <div style={{ marginBottom: "30px" }}>
          {(recipe.ingredients || []).map((ing, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <span>
                {typeof ing === "object" && ing.name
                  ? `${ing.baseQty} ${ing.unit} ${ing.name}`
                  : String(ing)}
              </span>
              <span style={{ color: "#22c55e", fontSize: "12px" }}>
                Available
              </span>
            </div>
          ))}
        </div>
        <button
          style={{ ...btnStyle, backgroundColor: "#22c55e", color: "white" }}
          onClick={() => setView("confirm")}
        >
          Start Cooking
        </button>
      </div>
    );
  }

  // View 2 — Confirm Modal
  if (view === "confirm") {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "20px",
            width: "320px",
            textAlign: "center",
          }}
        >
          <h3 style={{ margin: "0 0 10px" }}>Start Cooking?</h3>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
            All ingredients are available. Do you want to notify all members
            that you are cooking this recipe today?
          </p>
          <button
            style={{ ...btnStyle, backgroundColor: "#22c55e", color: "white" }}
            onClick={() => setView("final")}
          >
            Notify Everyone
          </button>
          <button
            style={{
              ...btnStyle,
              backgroundColor: "#fff",
              border: "1px solid #eee",
            }}
            onClick={() => setView("final")}
          >
            Start Without Notification
          </button>
          <button
            style={{
              ...btnStyle,
              backgroundColor: "transparent",
              color: "#666",
            }}
            onClick={() => setView("ready")}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // View 3 — Final / Notification Sent
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        textAlign: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#22c55e",
          color: "white",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <CheckCircle size={40} />
      </div>
      <h2>Notification Sent</h2>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        All members have been notified that you are cooking this recipe today.
      </p>
      <button
        style={{
          ...btnStyle,
          backgroundColor: "#22c55e",
          color: "white",
          width: "200px",
        }}
        onClick={onBack}
      >
        Okay
      </button>
    </div>
  );
}