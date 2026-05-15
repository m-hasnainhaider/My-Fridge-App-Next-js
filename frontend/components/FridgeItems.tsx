"use client";

import { Edit2, Trash2, Snowflake, Refrigerator, MinusCircle } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

interface FridgeItem {
  id: number;
  name: string;
  qty: string;
  exp: string;
  category: string;
  storageType: string;
  defaultImg?: string;
}

interface FridgeItemsProps {
  item: FridgeItem;
  onEdit: (item: FridgeItem) => void;
  onDelete?: (id: number) => void;
  onUse?: (item: FridgeItem) => void;
}

// ── Component ──────────────────────────────────────────────────────────────

const FridgeItems = ({ item, onEdit, onDelete, onUse }: FridgeItemsProps) => {
  const isFreezer = item.storageType === "Freezer";
  const isOutOfStock = parseInt(item.qty) === 0;

  const getItemImage = () => {
    if (item.defaultImg) return item.defaultImg;
    const n = item.name.toLowerCase();
    if (n.includes("milk")) return "/milk.png";
    if (n.includes("egg")) return "/eggs.png";
    if (n.includes("chicken"))
      return "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500";
    if (n.includes("carrot")) return "/carrot.png";
    if (n.includes("apple")) return "/apple.png";
    return "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=500";
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #eee",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        width: "80%",
        height: "100%",
        minHeight: "300px",
      }}
    >
      {/* 1. Image Section */}
      <div style={{ width: "100%", height: "150px", position: "relative" }}>
        <img
          src={getItemImage()}
          alt={item.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {isOutOfStock && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            OUT OF STOCK
          </div>
        )}
      </div>

      {/* 2. Content Section */}
      <div style={{ padding: "15px", flexGrow: 1 }}>
        <h3
          style={{
            margin: "0 0 8px 0",
            fontSize: "18px",
            color: "#333",
            fontWeight: "bold",
          }}
        >
          {item.name}
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: isOutOfStock ? "#ef4444" : "#22c55e",
            }}
          >
            Qty: {item.qty}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "11px",
              color: "#888",
              backgroundColor: "#f9f9f9",
              padding: "4px 8px",
              borderRadius: "8px",
            }}
          >
            {isFreezer ? (
              <Snowflake size={14} color="#0ea5e9" />
            ) : (
              <Refrigerator size={14} color="#22c55e" />
            )}
            {item.storageType || "Fridge"}
          </div>
        </div>
      </div>

      {/* 3. Buttons Section */}
      <div
        style={{
          padding: "12px",
          borderTop: "1px solid #f9f9f9",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        {isOutOfStock ? (
          <button
            onClick={() => onEdit(item)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#22c55e",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            + RESTOCK
          </button>
        ) : (
          <>
            <button
              onClick={() => onUse?.(item)}
              style={{
                flex: 1,
                backgroundColor: "#fff",
                border: "1.5px solid #f59e0b",
                color: "#f59e0b",
                borderRadius: "12px",
                padding: "8px",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
            >
              <MinusCircle size={16} /> USE
            </button>
            <div style={{ display: "flex", gap: "12px" }}>
              <Edit2
                size={20}
                color="#888"
                cursor="pointer"
                onClick={() => onEdit(item)}
              />
              <Trash2
                size={20}
                color="#f87171"
                cursor="pointer"
                onClick={() => onDelete?.(item.id)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FridgeItems;