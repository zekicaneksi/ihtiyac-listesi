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
      {children}
    </>
  );
};

export default Layout;
