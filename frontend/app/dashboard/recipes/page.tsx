"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, X } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export default function RecipesView() {
  const router = useRouter();
  const {
    fridgeItems = [],
    favorites = [],
    setFavorites,
    setShowSuccessPopup,
    searchTerm,
    setSearchTerm,
  } = useDashboard();

  const [searchTermLocal, setSearchTermLocal] = useState(searchTerm || "");
  const searchVal =
    searchTerm !== undefined && searchTerm !== "" ? searchTerm : searchTermLocal;
  const setSearchVal = (v: string) => {
    setSearchTerm(v);
    setSearchTermLocal(v);
  };

  // 1. Initial Data
  const recipesData = [
    {
      id: 1,
      name: "Biryani",
      tag: "Healthy",
      desc: "Light and refreshing with fresh herbs.",
      img: "./Biryani.png",
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

  // 2. States
  const [allRecipes, setAllRecipes] = useState(recipesData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    desc: "",
    servings: 1,
    img: "https://images.unsplash.com/photo-1495521821757-a1efb6729352",
    ingredients: [{ name: "", baseQty: "" as any, unit: "" }],
    steps: [""],
  });

  // 3. Fridge Logic
  const fridgeData = (fridgeItems || []).map((item: any) => ({
    name: (item.name || "").toLowerCase(),
    isExpiring:
      (item.exp || "").toLowerCase().includes("2 days") ||
      (item.exp || "").toLowerCase().includes("1 day"),
  }));

  const checkIngredientStatus = (recipeIngredients: any[]) => {
    if (!recipeIngredients) return { canMake: false, hasExp: false };
    const canMake = recipeIngredients.every((ing) => {
      const name = (
        typeof ing === "object" ? ing.name : ing || ""
      ).toLowerCase();
      return fridgeData.some(
        (f: any) => f.name.includes(name) || name.includes(f.name)
      );
    });
    const hasExp = recipeIngredients.some((ing) => {
      const name = (
        typeof ing === "object" ? ing.name : ing || ""
      ).toLowerCase();
      return fridgeData.some(
        (f: any) =>
          f.isExpiring && (f.name.includes(name) || name.includes(f.name))
      );
    });
    return { canMake, hasExp };
  };

  // 4. Modal Styles
  const modalInputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    marginBottom: "15px",
    outline: "none",
    fontSize: "15px",
  };

  const addBtnStyle: React.CSSProperties = {
    background: "none",
    border: "1px dashed #22c55e",
    color: "#22c55e",
    padding: "8px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "20px",
  };

  const filteredRecipes = allRecipes.filter((r) =>
    r.name.toLowerCase().includes((searchVal || "").toLowerCase())
  );

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    const statusA = checkIngredientStatus(a.ingredients);
    const statusB = checkIngredientStatus(b.ingredients);
    if (statusA.canMake && !statusB.canMake) return -1;
    if (!statusA.canMake && statusB.canMake) return 1;
    return 0;
  });

  return (
    <div style={{ width: "100%", paddingBottom: "40px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>Recipes</h1>

      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "10px",
          margin: "20px 0",
          border: "1px solid #eee",
        }}
      >
        <Search size={20} color="#888" />
        <input
          placeholder="Search recipes..."
          style={{ border: "none", outline: "none", marginLeft: "10px", width: "100%" }}
          value={searchVal || ""}
          onChange={(e) => setSearchVal(e.target.value)}
        />
      </div>

      {/* Recipe Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "25px",
        }}
      >
        {sortedRecipes.map((recipe) => {
          const { canMake, hasExp } = checkIngredientStatus(recipe.ingredients);
          return (
            <div
              key={recipe.id}
              onClick={() =>
                router.push(`/dashboard/recipe/${recipe.id}`)
              }
              style={{
                cursor: "pointer",
                borderRadius: "20px",
                overflow: "hidden",
                backgroundColor: "#fff",
                border: canMake ? "2px solid #22c55e" : "1px solid #eee",
                padding: "10px",
              }}
            >
              <img
                src={recipe.img}
                alt={recipe.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "15px",
                }}
              />
              <div style={{ padding: "10px" }}>
                <div
                  style={{
                    color: canMake ? "#22c55e" : "#ff5252",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {canMake ? "READY TO COOK" : "MISSING ITEMS"}
                </div>
                <h3 style={{ margin: "5px 0" }}>{recipe.name}</h3>
                <p style={{ color: "#666", fontSize: "14px" }}>{recipe.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Plus Button */}
      <button
        onClick={() => setShowAddModal(true)}
        style={{
          position: "fixed",
          bottom: "100px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "30px",
          backgroundColor: "#22c55e",
          color: "white",
          border: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <Plus size={30} />
      </button>

      {/* ADD RECIPE MODAL */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 3000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              width: "100%",
              maxWidth: "500px",
              borderRadius: "24px",
              padding: "25px",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
                alignItems: "center",
              }}
            >
              <h2 style={{ margin: 0 }}>Add New Recipe</h2>
              <X
                onClick={() => setShowAddModal(false)}
                cursor="pointer"
                color="#666"
              />
            </div>

            {/* Basic Details */}
            <input
              placeholder="Recipe Name"
              style={modalInputStyle}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, name: e.target.value })
              }
            />
            <input
              placeholder="Short Description"
              style={modalInputStyle}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, desc: e.target.value })
              }
            />
            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontSize: "13px", color: "#666", marginLeft: "5px" }}>
                Servings
              </label>
              <input
                type="number"
                min="1"
                style={modalInputStyle}
                value={newRecipe.servings}
                onChange={(e) =>
                  setNewRecipe({
                    ...newRecipe,
                    servings: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>

            {/* Ingredients */}
            <h4 style={{ marginBottom: "10px" }}>Ingredients</h4>
            {newRecipe.ingredients.map((ing, index) => (
              <div
                key={index}
                style={{ display: "flex", gap: "8px", marginBottom: "10px" }}
              >
                <input
                  placeholder="Item"
                  style={{ ...modalInputStyle, flex: 2, marginBottom: 0 }}
                  value={ing.name}
                  onChange={(e) => {
                    const ings = [...newRecipe.ingredients];
                    ings[index].name = e.target.value;
                    setNewRecipe({ ...newRecipe, ingredients: ings });
                  }}
                />
                <input
                  placeholder="Qty"
                  type="number"
                  style={{ ...modalInputStyle, flex: 1, marginBottom: 0 }}
                  value={ing.baseQty}
                  onChange={(e) => {
                    const ings = [...newRecipe.ingredients];
                    ings[index].baseQty = parseFloat(e.target.value) || 0;
                    setNewRecipe({ ...newRecipe, ingredients: ings });
                  }}
                />
                <input
                  placeholder="Unit"
                  style={{ ...modalInputStyle, flex: 1, marginBottom: 0 }}
                  value={ing.unit}
                  onChange={(e) => {
                    const ings = [...newRecipe.ingredients];
                    ings[index].unit = e.target.value;
                    setNewRecipe({ ...newRecipe, ingredients: ings });
                  }}
                />
              </div>
            ))}
            <button
              onClick={() =>
                setNewRecipe({
                  ...newRecipe,
                  ingredients: [
                    ...newRecipe.ingredients,
                    { name: "", baseQty: "", unit: "" },
                  ],
                })
              }
              style={addBtnStyle}
            >
              + Add Ingredient
            </button>

            {/* Cooking Steps */}
            <h4 style={{ marginBottom: "10px", marginTop: "10px" }}>
              Cooking Steps
            </h4>
            {newRecipe.steps.map((step, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "10px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#f0fdf4",
                    minWidth: "30px",
                    height: "30px",
                    borderRadius: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#22c55e",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  {index + 1}
                </div>
                <input
                  placeholder={`Step ${index + 1}`}
                  style={{ ...modalInputStyle, marginBottom: 0 }}
                  value={step}
                  onChange={(e) => {
                    const updatedSteps = [...newRecipe.steps];
                    updatedSteps[index] = e.target.value;
                    setNewRecipe({ ...newRecipe, steps: updatedSteps });
                  }}
                />
              </div>
            ))}
            <button
              onClick={() =>
                setNewRecipe({ ...newRecipe, steps: [...newRecipe.steps, ""] })
              }
              style={addBtnStyle}
            >
              + Add Step
            </button>

            {/* Save Button */}
            <button
              onClick={() => {
                if (!newRecipe.name) return alert("Please enter a name");
                setAllRecipes([...allRecipes, { ...newRecipe, id: Date.now() }]);
                setShowAddModal(false);
                setNewRecipe({
                  name: "",
                  desc: "",
                  servings: 1,
                  img: "https://images.unsplash.com/photo-1495521821757-a1efb6729352",
                  ingredients: [{ name: "", baseQty: "", unit: "" }],
                  steps: [""],
                });
              }}
              style={{
                width: "100%",
                padding: "16px",
                backgroundColor: "#22c55e",
                color: "white",
                border: "none",
                borderRadius: "14px",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Save Recipe
            </button>
          </div>
        </div>
      )}
    </div>
  );
}