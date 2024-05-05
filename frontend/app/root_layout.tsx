"use client";

import { ReactNode } from "react";

interface ChildrenProps {
  children: ReactNode;
}

const Layout = ({ children }: ChildrenProps) => {
  return <>{children}</>;
};

export default Layout;
