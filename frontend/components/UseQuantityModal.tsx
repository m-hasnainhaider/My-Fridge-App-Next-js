"use client";

// ── Types ──────────────────────────────────────────────────────────────────

interface FridgeItem {
  id: number;
  name: string;
  qty: string;
}

interface UseQuantityModalProps {
  item: FridgeItem | null;
  amount: string;
  setAmount: (value: string) => void;
  onConfirm: (id: number, amount: string) => void;
  onCancel: () => void;
}

// ── Component ──────────────────────────────────────────────────────────────

const UseQuantityModal = ({
  item,
  amount,
  setAmount,
  onConfirm,
  onCancel,
}: UseQuantityModalProps) => {
  if (!item) return null;

  const unit = item.qty.split(" ")[1] || "units";

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 3000,
    } as React.CSSProperties,
    modal: {
      backgroundColor: "#fff",
      padding: "25px",
      borderRadius: "20px",
      width: "320px",
      textAlign: "center",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    } as React.CSSProperties,
    title: {
      fontSize: "20px",
      marginBottom: "10px",
      color: "#333",
    },
    subtitle: {
      fontSize: "14px",
      color: "#666",
      marginBottom: "20px",
    },
    inputContainer: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#f0fdf4",
      padding: "12px",
      borderRadius: "12px",
      marginBottom: "20px",
      border: "1px solid #dcfce7",
    } as React.CSSProperties,
    input: {
      border: "none",
      background: "none",
      outline: "none",
      width: "100%",
      textAlign: "center",
      fontSize: "18px",
      fontWeight: "bold",
      color: "#166534",
    } as React.CSSProperties,
    unitText: {
      fontWeight: "bold",
      color: "#22c55e",
      marginLeft: "5px",
    },
    btnGroup: {
      display: "flex",
      gap: "10px",
    },
    confirmBtn: {
      flex: 1,
      padding: "12px",
      backgroundColor: "#4ade80",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      fontWeight: "bold",
      cursor: "pointer",
    } as React.CSSProperties,
    cancelBtn: {
      flex: 1,
      padding: "12px",
      backgroundColor: "#f3f4f6",
      color: "#666",
      border: "none",
      borderRadius: "10px",
      fontWeight: "bold",
      cursor: "pointer",
    } as React.CSSProperties,
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Title */}
        <h3 style={styles.title}>Use {item.name}</h3>
        <p style={styles.subtitle}>
          Currently in stock: <b>{item.qty}</b>
        </p>

        {/* Amount Input */}
        <div style={styles.inputContainer}>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
            autoFocus
          />
          <span style={styles.unitText}>{unit}</span>
        </div>

        {/* Buttons */}
        <div style={styles.btnGroup}>
          <button style={styles.cancelBtn} onClick={onCancel}>
            Cancel
          </button>
          <button
            style={styles.confirmBtn}
            onClick={() => onConfirm(item.id, amount)}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default UseQuantityModal;