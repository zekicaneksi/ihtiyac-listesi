"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "./context/LanguageContext";

interface ChildrenProps {
  children: ReactNode;
}

const Layout = ({ children }: ChildrenProps) => {
  return <LanguageProvider>{children}</LanguageProvider>;
};

export default Layout;
