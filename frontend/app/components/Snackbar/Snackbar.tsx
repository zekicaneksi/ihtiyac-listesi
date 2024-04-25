"use client";
import { useEffect, useState } from "react";
import "./Snackbar.css";

interface SnackbarProps {
  message: string;
  open: boolean;
  onClose: () => void;
}

const Snackbar = (props: SnackbarProps) => {
  const [_, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (props.open) {
      setTimeoutId((prevState) => {
        if (prevState === null) {
          return setTimeout(() => {
            setTimeoutId(null);
            props.onClose();
          }, 3000);
        } else {
          return null;
        }
      });
    } else {
      setTimeoutId(null);
    }
  }, [props.open]);

  if (!props.open) return false;

  return (
    <div className="fixed left-1/2 top-0 z-20 min-w-36 -translate-x-1/2 -translate-y-full transform animate-[inAndOut_3s_linear] rounded-3xl bg-red-300 p-4 text-center">
      <p>{props.message}</p>
    </div>
  );
};

export default Snackbar;
