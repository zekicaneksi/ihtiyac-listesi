"use client";

import Footer, { MenuElementProps } from "@/app/components/Footer";

const Room = () => {
  const menuElements: MenuElementProps[] = [
    {
      text: "Room Info",
      onClick: () => {
        console.log("room info");
      },
    },
    {
      text: "History",
      onClick: () => {
        console.log("history");
      },
    },
  ];

  return (
    <>
      <div className="flex flex-grow flex-col items-center justify-center gap-10 [&>p]:text-center">
        <p>Hello from room</p>
      </div>
      <Footer menuElements={menuElements} />
    </>
  );
};

export default Room;
