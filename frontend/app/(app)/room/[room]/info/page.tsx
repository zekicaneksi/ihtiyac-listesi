"use client";

import Footer from "@/app/components/Footer";

const Info = () => {
  return (
    <>
      <div className="flex flex-grow flex-col items-center justify-center gap-10 [&>p]:text-center">
        <p>Hello from info</p>
      </div>
      <Footer
        backFunction={() => {
          console.log("back it up");
        }}
      />
    </>
  );
};

export default Info;
