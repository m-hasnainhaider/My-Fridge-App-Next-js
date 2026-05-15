"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Share2, Heart, X, CheckCircle, Users } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

// ✅ Same recipe data as RecipesView (shared source)
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

export default function RecipeDetailView() {
  const { id } = useParams();
  const router = useRouter();
  const { fridgeItems, favorites, setFavorites, setShowSuccessPopup } =
    useDashboard();

  // ✅ Find recipe by id from data (replaces location.state)
  const recipe = recipesData.find((r) => r.id === Number(id)) ?? null;

  const [isValidated, setIsValidated] = useState(false);
  const [missingItems, setMissingItems] = useState<string[]>([]);
  const [showMissingPopup, setShowMissingPopup] = useState(false);
  const baseServings = recipe?.servings || 4;
  const [targetServings, setTargetServings] = useState(baseServings);

  // Recipe not found
  if (!recipe) {
    return (
      <div style={{ padding: "20px" }}>
        <button
          onClick={() => router.push("/dashboard/recipes")}
          style={{ border: "none", background: "none", cursor: "pointer" }}
        >
          <ArrowLeft size={24} />
        </button>
        <p>
          Recipe not found.{" "}
          <button onClick={() => router.push("/dashboard/recipes")}>
            Back to Recipes
          </button>
        </p>
      </div>
    );
  }

  const scalingFactor = targetServings / baseServings;

  const getScaledQty = (ingredientObj: any) => {
    if (!ingredientObj) return "Unknown Ingredient";
    if (typeof ingredientObj === "string") return ingredientObj;
    if (typeof ingredientObj === "object" && ingredientObj.baseQty) {
      const newQty = ingredientObj.baseQty * scalingFactor;
      const formattedQty = Number.isInteger(newQty)
        ? newQty
        : newQty.toFixed(1);
      return `${formattedQty} ${ingredientObj.unit || ""} ${ingredientObj.name || ""}`;
    }
    return String(ingredientObj);
  };

  const checkIngredientsAction = () => {
    const fridgeNames = (fridgeItems || []).map((item: any) =>
      item.name.toLowerCase()
    );
    const missing = recipe.ingredients.filter((ing: any) => {
      const name = typeof ing === "string" ? ing : ing.name;
      const ingName = name ? name.toLowerCase() : "";
      return !fridgeNames.some(
        (fName: string) =>
          fName.includes(ingName) || ingName.includes(fName)
      );
    });
    if (missing.length > 0) {
      setMissingItems(
        missing.map((m: any) => (typeof m === "string" ? m : m.name))
      );
      setShowMissingPopup(true);
    } else {
      setIsValidated(true);
    }
  };

  const handleNotifyMembers = () => {
    if (setShowSuccessPopup)
      setShowSuccessPopup({ recipeName: recipe.name, missingItems });
    setShowMissingPopup(false);
  };

  const isFavorite = favorites?.some((f: any) => f.id === recipe.id) ?? false;

  const onToggleFavorite = () => {
    const exists = favorites?.find((f: any) => f.id === recipe.id);
    setFavorites(
      exists
        ? favorites.filter((f: any) => f.id !== recipe.id)
        : [...(favorites || []), recipe]
    );
  };

  const onSelectRecipe = () =>
    router.push(`/dashboard/cooking/${recipe.id || "current"}`);

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
    } as React.CSSProperties,
    modal: {
      backgroundColor: "white",
      padding: "25px",
      borderRadius: "20px",
      width: "350px",
      textAlign: "center",
    } as React.CSSProperties,
    btnPrimary: {
      width: "100%",
      padding: "15px",
      background: "#22c55e",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      marginTop: "20px",
      fontWeight: "bold",
      cursor: "pointer",
    } as React.CSSProperties,
    scalingBox: {
      backgroundColor: "#f0fdf4",
      padding: "15px",
      borderRadius: "15px",
      marginBottom: "20px",
      border: "1px solid #dcfce7",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    } as React.CSSProperties,
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", paddingBottom: "50px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <ArrowLeft
          onClick={() => router.push("/dashboard/recipes")}
          cursor="pointer"
          size={24}
        />
        <div style={{ display: "flex", gap: "15px" }}>
          <Share2 size={22} color="#666" cursor="pointer" />
          <Heart
            size={22}
            onClick={onToggleFavorite}
            fill={isFavorite ? "#22c55e" : "none"}
            color={isFavorite ? "#22c55e" : "#666"}
            cursor="pointer"
          />
        </div>
      </div>

      <img
        src={recipe.img}
        alt={recipe.name}
        style={{
          width: "100%",
          height: "250px",
          borderRadius: "20px",
          objectFit: "cover",
        }}
      />
      <h1 style={{ marginTop: "20px", fontSize: "28px", color: "#333" }}>
        {recipe.name}
      </h1>

      {/* Scaling Box */}
      <div style={styles.scalingBox}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#166534",
            fontWeight: "500",
          }}
        >
          <Users size={18} />
          <span>
            Original recipe serves: <b>{baseServings}</b> people
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "14px", color: "#666" }}>
            Cooking for how many?
          </span>
          <input
            type="number"
            min="1"
            value={targetServings}
            onChange={(e) =>
              setTargetServings(Number(e.target.value) || 1)
            }
            style={{
              width: "60px",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #22c55e",
              textAlign: "center",
              fontWeight: "bold",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Ingredients */}
      <div style={{ marginTop: "25px" }}>
        <h3
          style={{
            fontSize: "18px",
            borderBottom: "2px solid #f0f0f0",
            paddingBottom: "10px",
          }}
        >
          Ingredients
        </h3>
        {recipe.ingredients?.map((ing: any, i: number) => (
          <div
            key={i}
            style={{
              padding: "12px 0",
              borderBottom: "1px solid #f9f9f9",
              color: "#555",
              fontSize: "15px",
            }}
          >
            • {getScaledQty(ing)}
          </div>
        ))}
      </div>

      {/* Check / Steps */}
      {!isValidated ? (
        <button onClick={checkIngredientsAction} style={styles.btnPrimary}>
          Check Ingredients
        </button>
      ) : (
        <div
          style={{
            marginTop: "25px",
            backgroundColor: "#f0fdf4",
            padding: "20px",
            borderRadius: "15px",
          }}
        >
          <h3
            style={{
              color: "#22c55e",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <CheckCircle size={20} /> Steps Unlocked
          </h3>
          <ol
            style={{
              color: "#444",
              paddingLeft: "20px",
              marginTop: "15px",
            }}
          >
            {recipe.steps?.map((step: string, i: number) => (
              <li key={i} style={{ marginBottom: "12px", lineHeight: "1.5" }}>
                {step}
              </li>
            ))}
          </ol>
          <button
            onClick={onSelectRecipe}
            style={{ ...styles.btnPrimary, marginTop: "10px" }}
          >
            Select Recipe
          </button>
        </div>
      )}

      {/* Missing Popup */}
      {showMissingPopup && (
        <div style={styles.overlay}>
          <div
            style={{
              ...styles.modal,
              width: "380px",
              position: "relative",
              padding: "40px 25px",
            }}
          >
            <button
              onClick={() => setShowMissingPopup(false)}
              style={{
                position: "absolute",
                top: "15px",
                right: "20px",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              <X size={20} color="#888" />
            </button>
            <h2 style={{ fontSize: "22px", marginBottom: "10px" }}>
              Missing Ingredients
            </h2>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Some items are not in your fridge:
            </p>
            <div style={{ textAlign: "left", marginBottom: "25px" }}>
              {missingItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    color: "#e53e3e",
                    marginBottom: "8px",
                    fontWeight: "500",
                  }}
                >
                  • {item}
                </div>
              ))}
            </div>
            <button
              onClick={handleNotifyMembers}
              style={{
                ...styles.btnPrimary,
                backgroundColor: "#4ade80",
                marginTop: 0,
              }}
            >
              Notify Members
            </button>
            <button
              onClick={() => setShowMissingPopup(false)}
              style={{
                width: "100%",
                padding: "12px",
                background: "none",
                border: "none",
                color: "#888",
                marginTop: "10px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}