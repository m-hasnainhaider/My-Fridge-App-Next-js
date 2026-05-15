"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddItemModal from "@/components/AddItemModal";
import UseQuantityModal from "@/components/UseQuantityModal";
import FridgeItems from "@/components/FridgeItems";
import { useDashboard } from "@/context/DashboardContext";

const FridgeView = () => {
  const { fridgeItems, setFridgeItems } = useDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [storageFilter, setStorageFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showUseModal, setShowUseModal] = useState(false);
  const [selectedItemToUse, setSelectedItemToUse] = useState<any>(null);
  const [consumeAmount, setConsumeAmount] = useState("");

  const handleEditClick = (item: any) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleSaveItem = (newItem: any) => {
    setFridgeItems((prev: any[]) => [...prev, { ...newItem, id: Date.now() }]);
    setShowAddModal(false);
    setEditingItem(null);
  };

  const handleSaveEditedItem = (updatedItem: any) => {
    setFridgeItems((prev: any[]) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setShowAddModal(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: any) => {
    if (window.confirm("Are you sure?"))
      setFridgeItems((prev: any[]) => prev.filter((i) => i.id !== id));
  };

  const openUseModal = (item: any) => {
    setSelectedItemToUse(item);
    setConsumeAmount("");
    setShowUseModal(true);
  };

  const confirmConsumption = (id: any, amount: string) => {
    setFridgeItems((prev: any[]) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const parts = item.qty.split(" ");
          const current = parseFloat(parts[0]) || 0;
          const unit = parts[1] || "";
          const remaining = current - parseFloat(amount);
          if (remaining <= 0) return null;
          return { ...item, qty: `${remaining.toFixed(2)} ${unit}` };
        })
        .filter(Boolean)
    );
    setShowUseModal(false);
  };

  const filteredItems = fridgeItems.filter((item: any) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStorage =
      storageFilter === "All" ? true : item.storageType === storageFilter;
    return matchesSearch && matchesStorage;
  });

  const styles = {
    container: { padding: "10px" },
    filterBar: { display: "flex", gap: "10px", marginBottom: "25px" },
    tab: (active: boolean) => ({
      padding: "10px 25px",
      borderRadius: "25px",
      border: "1px solid #4ade80",
      backgroundColor: active ? "#4ade80" : "transparent",
      color: active ? "#fff" : "#4ade80",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "0.3s",
    }),
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "25px",
    },
    fab: {
      position: "fixed",
      bottom: "40px",
      right: "40px",
      width: "60px",
      height: "60px",
      backgroundColor: "#22c55e",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#fff",
      border: "none",
      boxShadow: "0 4px 15px rgba(34,197,94,0.4)",
      cursor: "pointer",
    } as React.CSSProperties,
  };

  return (
    <div style={styles.container}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ margin: 0, color: "#333" }}>My Fridge Inventory</h1>
      </div>

      {/* TABS */}
      <div style={styles.filterBar}>
        {["All", "Fridge", "Freezer"].map((tab) => (
          <button
            key={tab}
            onClick={() => setStorageFilter(tab)}
            style={styles.tab(storageFilter === tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div style={styles.grid}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item: any) => (
            <FridgeItems
              key={item.id}
              item={item}
              onEdit={handleEditClick}
              onDelete={handleDeleteItem}
              onUse={openUseModal}
            />
          ))
        ) : (
          <div
            style={{
              gridColumn: "1/-1",
              textAlign: "center",
              padding: "50px",
              color: "#888",
            }}
          >
            <h3>No items found in {storageFilter}</h3>
          </div>
        )}
      </div>

      {/* MODALS */}
      {showAddModal && (
        <AddItemModal
          onBack={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
          onSave={editingItem ? handleSaveEditedItem : handleSaveItem}
          editingItem={editingItem}
        />
      )}
      {showUseModal && (
        <UseQuantityModal
          item={selectedItemToUse}
          amount={consumeAmount}
          setAmount={setConsumeAmount}
          onConfirm={(id: any, amount: string) => {
            confirmConsumption(id, amount);
          }}
          onCancel={() => setShowUseModal(false)}
        />
      )}

      <button style={styles.fab} onClick={() => setShowAddModal(true)}>
        <Plus size={30} />
      </button>
    </div>
  );
};

export default FridgeView;