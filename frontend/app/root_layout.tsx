"use client";

import { UserProvider } from "@/app/context/user_context";
import { ReactNode } from "react";

interface ChildrenProps {
  children: ReactNode;
}

const Layout = ({ children }: ChildrenProps) => {
  return <UserProvider>{children}</UserProvider>;
};

export default Layout;
