"use client";

import { ReactNode } from "react";
import { Header } from "@/app/(app)/components/layout/header";

interface ChildrenProps {
  children: ReactNode;
}

const Layout = ({ children }: ChildrenProps) => {
  return (
    <>
      <Header />
      <div className="flex flex-grow flex-col overflow-auto">{children}</div>
    </>
  );
};

export default Layout;
