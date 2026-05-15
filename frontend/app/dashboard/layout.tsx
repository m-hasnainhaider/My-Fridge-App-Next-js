"use client";

import { DashboardProvider } from "@/context/DashboardContext";
import DashboardLayout from "@/components/common/DashboardLayout";
import DashboardPopups from "@/components/common/DashboardPopups";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <DashboardPopups />
      <DashboardLayout>{children}</DashboardLayout>
    </DashboardProvider>
  );
}