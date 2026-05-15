"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Box, Hash, Calendar, Save } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

interface FridgeItem {
  id: number;
  name: string;
  category: string;
  qty: string;
  exp: string;
  storageType: string;
}

interface EditItemModalProps {
  onBack: () => void;
  onSave: (item: FridgeItem) => void;
  editingItem: FridgeItem | null;
}

// ── Component ──────────────────────────────────────────────────────────────

const EditItemModal = ({ onBack, onSave, editingItem }: EditItemModalProps) => {
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

  const handleUpdate = () => {
    if (!name || !qty) return alert("Fields cannot be empty!");

    const updatedData: FridgeItem = {
      ...editingItem!,
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
    onSave(updatedData);
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 2000,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    } as React.CSSProperties,
    container: {
      width: "90%",
      maxWidth: "450px",
      backgroundColor: "#fff",
      padding: "25px",
      borderRadius: "20px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    } as React.CSSProperties,
    header: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginBottom: "25px",
    } as React.CSSProperties,
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "600",
      color: "#555",
      fontSize: "13px",
    },
    inputGroup: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#fdfdfd",
      borderRadius: "10px",
      padding: "10px 15px",
      marginBottom: "15px",
      border: "1px solid #ddd",
    } as React.CSSProperties,
    input: {
      border: "none",
      background: "none",
      outline: "none",
      width: "100%",
      marginLeft: "10px",
      fontSize: "15px",
    } as React.CSSProperties,
    updateBtn: {
      width: "100%",
      padding: "14px",
      backgroundColor: "#3b82f6",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      fontWeight: "bold",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
    } as React.CSSProperties,
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <ArrowLeft size={24} onClick={onBack} cursor="pointer" />
          <h2 style={{ margin: 0, color: "#3b82f6" }}>Edit Inventory Item</h2>
        </div>

        {/* Item Name */}
        <label style={styles.label}>Item Name</label>
        <div style={styles.inputGroup}>
          <Box size={18} color="#3b82f6" />
          <input
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Quantity & Unit */}
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Quantity</label>
            <div style={styles.inputGroup}>
              <Hash size={18} color="#888" />
              <input
                type="number"
                style={styles.input}
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Unit</label>
            <div style={styles.inputGroup}>
              <select
                style={{ ...styles.input, marginLeft: 0 }}
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
              >
                {unitOptions.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Storage Location */}
        <label style={styles.label}>Location</label>
        <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
          {["Fridge", "Freezer"].map((loc) => (
            <label
              key={loc}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                checked={storageType === loc}
                onChange={() => setStorageType(loc)}
              />{" "}
              {loc}
            </label>
          ))}
        </div>

        {/* Expiry Date */}
        <label style={styles.label}>Expiry Date</label>
        <div style={styles.inputGroup}>
          <Calendar size={18} color="#888" />
          <input
            type="date"
            style={styles.input}
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
        </div>

        {/* Update Button */}
        <button style={styles.updateBtn} onClick={handleUpdate}>
          <Save size={20} /> Update Item Changes
        </button>
      </div>
    </div>
  );
};

export default EditItemModal;