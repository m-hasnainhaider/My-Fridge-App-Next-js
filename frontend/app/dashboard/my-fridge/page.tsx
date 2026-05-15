"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import FridgeItems from "@/components/FridgeItems";
import UseQuantityModal from "@/components/UseQuantityModal";
import EditItemModal from "@/components/EditModel";
import AddItemModal from "@/components/AddItemModal";
import { useDashboard } from "@/context/DashboardContext";

export default function MyFridge() {
  const { fridgeItems = [], setFridgeItems } = useDashboard();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUseModal, setShowUseModal] = useState(false);

  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedItemToUse, setSelectedItemToUse] = useState<any>(null);
  const [consumeAmount, setConsumeAmount] = useState("");

  const onEdit = (item: any) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleSaveNewItem = (newItem: any) => {
    setFridgeItems((prev: any[]) => [...prev, { ...newItem, id: Date.now() }]);
    setShowAddModal(false);
  };

  const handleUpdateItem = (updatedItem: any) => {
    setFridgeItems((prev: any[]) =>
      prev.map((i) => (i.id === updatedItem.id ? updatedItem : i))
    );
    setShowEditModal(false);
    setEditingItem(null);
  };

  // 1. ADD MODAL
  if (showAddModal) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#fff",
          zIndex: 2000,
        }}
      >
        <AddItemModal
          onBack={() => setShowAddModal(false)}
          onSave={handleSaveNewItem}
        />
      </div>
    );
  }

  // 2. EDIT MODAL
  if (showEditModal && editingItem) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#fff",
          zIndex: 2000,
        }}
      >
        <EditItemModal
          onBack={() => {
            setShowEditModal(false);
            setEditingItem(null);
          }}
          onSave={handleUpdateItem}
          editingItem={editingItem}
        />
      </div>
    );
  }

  // 3. NORMAL VIEW
  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ marginBottom: "25px" }}>My Fridge Inventory</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "25px",
        }}
      >
        {fridgeItems.map((item: any) => (
          <FridgeItems
            key={item.id}
            item={item}
            onEdit={() => onEdit(item)}
          />
        ))}
      </div>

      <button
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          backgroundColor: "#22c55e",
          color: "white",
          padding: "15px",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => setShowAddModal(true)}
      >
        <Plus />
      </button>

      {/* Use Quantity Modal */}
      {showUseModal && selectedItemToUse && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <UseQuantityModal
            item={selectedItemToUse}
            onCancel={() => setShowUseModal(false)}
          />
        </div>
      )}
    </div>
  );
}