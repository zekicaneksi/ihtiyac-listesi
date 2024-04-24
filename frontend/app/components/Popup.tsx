"use client";

import { ReactNode, useRef } from "react";

interface PopupProps {
  children: ReactNode;
  open: boolean;
  handleClose: () => void;
}

const Popup = (props: PopupProps) => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  if (!props.open) return false;

  function handleClose(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target !== backgroundRef.current) return;
    props.handleClose();
  }

  return (
    <div
      className="fixed inset-0 z-10 bg-black opacity-40"
      onClick={handleClose}
      ref={backgroundRef}
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
        {props.children}
      </div>
    </div>
  );
};

export default Popup;
