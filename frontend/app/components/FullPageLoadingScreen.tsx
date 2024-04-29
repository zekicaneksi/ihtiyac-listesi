"use client";

import { GrInProgress } from "react-icons/gr";

interface FullPageLoadingScreenProps {
  show: boolean;
  message: string;
}

const FullPageLoadingScreen = (props: FullPageLoadingScreenProps) => {
  if (!props.show) return false;
  return (
    <div className={"fixed inset-0 z-10 flex bg-black opacity-90"}>
      <div className={"m-auto flex flex-col items-center justify-center gap-8"}>
        <GrInProgress className="size-8 animate-spin text-foreground" />
        <p className="text-element">{props.message}</p>
      </div>
    </div>
  );
};

export default FullPageLoadingScreen;
