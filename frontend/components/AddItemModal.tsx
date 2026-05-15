"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Box, Hash, Calendar, ChevronDown } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

interface FridgeItem {
  id: number;
  name: string;
  category: string;
  qty: string;
  exp: string;
  storageType: string;
}

interface AddItemModalProps {
  onBack: () => void;
  onSave: (item: FridgeItem) => void;
  editingItem?: FridgeItem | null;
}

// ── Component ──────────────────────────────────────────────────────────────

const AddItemModal = ({ onBack, onSave, editingItem }: AddItemModalProps) => {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [expiry, setExpiry] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("kg");
  const [storageType, setStorageType] = useState("Fridge");

  const unitOptions = [
    "kg", "g", "liter", "ml", "dozen", "units", "packs", "bottles",
  ];

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name || "");
      if (editingItem.qty) {
        const parts = editingItem.qty.toString().split(" ");
        setQty(parts[0] || "");
        if (parts[1]) setSelectedUnit(parts[1]);
      }
      setCategory(editingItem.category || "Groceries");
      setStorageType(editingItem.storageType || "Fridge");
      const expDate = editingItem.exp
        ? editingItem.exp.toString().replace("Exp. ", "")
        : "";
      setExpiry(expDate);
    }
  }, [editingItem]);

  const handleSave = () => {
    if (!name || !qty) return alert("Please fill all fields!");

    const itemData: FridgeItem = {
      id: editingItem ? editingItem.id : Date.now(),
      name,
      category,
      qty: `${qty} ${selectedUnit}`,
      storageType,
      exp: expiry
        ? expiry.startsWith("Exp.")
          ? expiry
          : `Exp. ${expiry}`
        : "No Exp.",
    };
    onSave(itemData);
  };

  const styles = {
    container: {
      padding: "20px",
      backgroundColor: "#fff",
      height: "100%",
      borderRadius: "15px",
      overflowY: "auto",
    } as React.CSSProperties,
    header: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginBottom: "30px",
    } as React.CSSProperties,
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "600",
      color: "#333",
      fontSize: "14px",
    },
    inputGroup: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#f9f9f9",
      borderRadius: "12px",
      padding: "12px 15px",
      marginBottom: "20px",
      border: "1px solid #eee",
    } as React.CSSProperties,
    input: {
      border: "none",
      background: "none",
      outline: "none",
      width: "100%",
      marginLeft: "10px",
      fontSize: "15px",
      color: "#333",
    } as React.CSSProperties,
    selectUnit: {
      border: "none",
      background: "none",
      outline: "none",
      fontSize: "14px",
      color: "#22c55e",
      fontWeight: "600",
      cursor: "pointer",
    } as React.CSSProperties,
    storageContainer: {
      display: "flex",
      gap: "20px",
      marginBottom: "20px",
      padding: "5px",
    } as React.CSSProperties,
    checkboxItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer",
    } as React.CSSProperties,
    saveBtn: {
      width: "100%",
      padding: "15px",
      backgroundColor: "#4ade80",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      fontWeight: "bold",
      fontSize: "16px",
      cursor: "pointer",
      marginTop: "10px",
    } as React.CSSProperties,
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <ArrowLeft size={24} onClick={onBack} cursor="pointer" />
        <h2 style={{ margin: 0 }}>
          {editingItem ? "Edit Food Item" : "Add New Item"}
        </h2>
      </div>

      {/* Item Name */}
      <label style={styles.label}>Item Name</label>
      <div style={styles.inputGroup}>
        <Box size={20} color="#888" />
        <input
          style={styles.input}
          placeholder="e.g. Milk, Bread"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Category */}
      <label style={styles.label}>Category</label>
      <div style={styles.inputGroup}>
        <select
          style={styles.input}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Groceries">Groceries</option>
          <option value="Fruits">Fruits</option>
          <option value="Dairy">Dairy</option>
          <option value="Meat">Meat</option>
          <option value="Drinks">Drinks</option>
          <option value="Vegetables">Vegetables</option>
        </select>
        <ChevronDown size={20} color="#888" />
      </div>

      {/* Quantity */}
      <label style={styles.label}>Quantity</label>
      <div style={styles.inputGroup}>
        <Hash size={20} color="#888" />
        <input
          style={{ ...styles.input, width: "60%" }}
          type="number"
          placeholder="Value"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderLeft: "1px solid #ddd",
            paddingLeft: "10px",
          }}
        >
          <select
            style={styles.selectUnit}
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
          >
            {unitOptions.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Storage Location */}
      <label style={styles.label}>Storage Location</label>
      <div style={styles.storageContainer}>
        <div
          style={styles.checkboxItem}
          onClick={() => setStorageType("Fridge")}
        >
          <input
            type="radio"
            name="storage"
            checked={storageType === "Fridge"}
            onChange={() => setStorageType("Fridge")}
            style={{ accentColor: "#4ade80", width: "18px", height: "18px" }}
          />
          <span
            style={{
              fontSize: "15px",
              color: storageType === "Fridge" ? "#333" : "#888",
            }}
          >
            Fridge
          </span>
        </div>
        <div
          style={styles.checkboxItem}
          onClick={() => setStorageType("Freezer")}
        >
          <input
            type="radio"
            name="storage"
            checked={storageType === "Freezer"}
            onChange={() => setStorageType("Freezer")}
            style={{ accentColor: "#4ade80", width: "18px", height: "18px" }}
          />
          <span
            style={{
              fontSize: "15px",
              color: storageType === "Freezer" ? "#333" : "#888",
            }}
          >
            Freezer
          </span>
        </div>
      </div>

      {/* Expiry Date */}
      <label style={styles.label}>Expiry Date</label>
      <div style={styles.inputGroup}>
        <Calendar size={20} color="#888" />
        <input
          style={styles.input}
          type="date"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        />
      </div>

      {/* Save Button */}
      <button style={styles.saveBtn} onClick={handleSave}>
        {editingItem ? "Save Changes" : "Save Item"}
      </button>
    </div>
  );
};

export default AddItemModal;