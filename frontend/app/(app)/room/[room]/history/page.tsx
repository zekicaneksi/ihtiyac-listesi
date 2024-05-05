"use client";

import Footer from "@/app/components/Footer";

const History = () => {
  return (
    <>
      <div className="flex flex-grow flex-col items-center justify-center gap-10 [&>p]:text-center">
        <p>Hello from history</p>
      </div>
      <Footer
        backFunction={() => {
          console.log("back it up");
        }}
      />
    </>
  );
};

export default History;
