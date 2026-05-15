"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

// ── Types ──────────────────────────────────────────────────────────────────

interface FridgeItem {
  id: number;
  name: string;
  category: string;
  qty: string;
  exp: string;
  icon: null | string;
  storageType: string;
}

interface Alert {
  id: string | number;
  name: string;
  category: string;
  qty: string;
  priority: number;
  alertType: string;
  alertMsg: string;
  missingItems?: string[];
  recipeName?: string;
}

interface RecipeBroadcast {
  recipeName: string;
  missingItems: string[];
}

interface DashboardContextType {
  fridgeItems: FridgeItem[];
  setFridgeItems: React.Dispatch<React.SetStateAction<FridgeItem[]>>;
  favorites: any[];
  setFavorites: React.Dispatch<React.SetStateAction<any[]>>;
  alerts: Alert[];
  recipeBroadcasts: RecipeBroadcast[];
  setRecipeBroadcasts: React.Dispatch<React.SetStateAction<RecipeBroadcast[]>>;
  showSuccessPopup: any;
  setShowSuccessPopup: React.Dispatch<React.SetStateAction<any>>;
  notificationSent: boolean;
  setNotificationSent: React.Dispatch<React.SetStateAction<boolean>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

// ── Context ────────────────────────────────────────────────────────────────

const DashboardContext = createContext<DashboardContextType | null>(null);

// ── Hooks ──────────────────────────────────────────────────────────────────

export function useDashboard(): DashboardContextType {
  const ctx = useContext(DashboardContext);
  if (!ctx)
    throw new Error("useDashboard must be used inside DashboardProvider");
  return ctx;
}

/** Use when component can be inside or outside dashboard (e.g. Admin). Returns null outside provider. */
export function useDashboardOptional(): DashboardContextType | null {
  return useContext(DashboardContext);
}

// ── Default Data ───────────────────────────────────────────────────────────

const defaultFridgeItems: FridgeItem[] = [
  {
    id: 1,
    name: "Green Apples",
    category: "Fruits",
    qty: "6 units",
    exp: "Exp. 2 days",
    icon: null,
    storageType: "Fridge",
  },
  {
    id: 2,
    name: "Whole Milk",
    category: "Dairy",
    qty: "8 liter",
    exp: "Exp. 5 days",
    icon: null,
    storageType: "Fridge",
  },
  {
    id: 3,
    name: "Farm Fresh Eggs",
    category: "Protein",
    qty: "1 dozen",
    exp: "Exp. 1 week",
    icon: null,
    storageType: "Freezer",
  },
  {
    id: 4,
    name: "Organic Carrots",
    category: "Vegetables",
    qty: "1 bag",
    exp: "Exp. 10 days",
    icon: null,
    storageType: "Fridge",
  },
];

// ── Provider ───────────────────────────────────────────────────────────────

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>(defaultFridgeItems);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [recipeBroadcasts, setRecipeBroadcasts] = useState<RecipeBroadcast[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState<any>(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const alerts = useMemo<Alert[]>(() => {
    const expiryAlerts = fridgeItems
      .map((item) => {
        const expStatus = (item.exp || "").toLowerCase();
        const qtyValue = parseInt(item.qty) || 0;
        let priority = 0,
          type = "",
          message = "";

        if (
          expStatus.includes("expired") ||
          expStatus.includes("1 day") ||
          expStatus.includes("2 days")
        ) {
          priority = 1;
          type = "Expiry";
          message = expStatus.includes("expired")
            ? "Item is expired!"
            : `Expiring soon: ${item.exp}`;
        } else if (qtyValue <= 1) {
          priority = 2;
          type = "Low Stock";
          message = `Only ${item.qty} left. Please restock soon.`;
        }

        return type
          ? { ...item, priority, alertType: type, alertMsg: message }
          : null;
      })
      .filter(Boolean) as Alert[];

    const broadcastAlerts: Alert[] = recipeBroadcasts.map((b, idx) => ({
      id: `broadcast-${idx}`,
      name: b.recipeName,
      category: "Recipe Alert",
      qty: "Urgent",
      priority: 3,
      alertType: "Broadcast",
      alertMsg: `Missing: ${(b.missingItems || []).join(", ")}.`,
      missingItems: b.missingItems || [],
    }));

    return [...expiryAlerts, ...broadcastAlerts].sort(
      (a, b) => a.priority - b.priority
    );
  }, [fridgeItems, recipeBroadcasts]);

  const value = useMemo<DashboardContextType>(
    () => ({
      fridgeItems,
      setFridgeItems,
      favorites,
      setFavorites,
      alerts,
      recipeBroadcasts,
      setRecipeBroadcasts,
      showSuccessPopup,
      setShowSuccessPopup,
      notificationSent,
      setNotificationSent,
      searchTerm,
      setSearchTerm,
    }),
    [
      fridgeItems,
      favorites,
      alerts,
      recipeBroadcasts,
      showSuccessPopup,
      notificationSent,
      searchTerm,
    ]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}