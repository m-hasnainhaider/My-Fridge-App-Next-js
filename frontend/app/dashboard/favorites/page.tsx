"use client";

import { useRouter } from "next/navigation";
import { Heart, ChevronRight } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export default function FavoritesView() {
  const router = useRouter();
  const { favorites = [], setFavorites, setSearchTerm } = useDashboard();

  const onRemoveFavorite = (id: number) =>
    setFavorites((prev: any[]) => prev.filter((f) => f.id !== id));

  const onSelectRecipe = (recipe: any) => {
    setSearchTerm(recipe.name || "");
    router.push(`/dashboard/recipe/${recipe.id || "current"}`);
  };

  return (
    <div style={{ padding: "10px" }}>
      <h1 style={{ marginBottom: "30px" }}>Favorite Recipes</h1>

      {favorites.length === 0 ? (
        <div
          style={{ textAlign: "center", marginTop: "100px", color: "#999" }}
        >
          <Heart
            size={60}
            style={{ marginBottom: "20px", opacity: 0.3 }}
          />
          <p>You haven't added any favorites yet.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {favorites.map((recipe: any) => (
            <div
              key={recipe.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "15px",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                <img
                  src={recipe.img || recipe.image}
                  alt={recipe.name}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px" }}>
                    {recipe.name}
                  </h3>
                  <span style={{ fontSize: "12px", color: "#888" }}>
                    {recipe.time || ""} mins
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <Heart
                  size={20}
                  fill="#ef4444"
                  color="#ef4444"
                  cursor="pointer"
                  onClick={() => onRemoveFavorite(recipe.id)}
                />
                <ChevronRight
                  size={20}
                  color="#ccc"
                  cursor="pointer"
                  onClick={() => onSelectRecipe(recipe)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}