"use client";

import { ReactNode } from "react";
import { Header } from "@/app/(app)/layout/Header";
import { UserProvider } from "./context/user_context";

interface ChildrenProps {
  children: ReactNode;
}

const Layout = ({ children }: ChildrenProps) => {
  return (
    <UserProvider>
      <Header />
      <div className="flex flex-grow flex-col overflow-auto">{children}</div>
    </UserProvider>
  );
};

export default Layout;
