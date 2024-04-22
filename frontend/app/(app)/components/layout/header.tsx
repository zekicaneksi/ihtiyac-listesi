"use cilent";

const LogoWithName = () => {
  return (
    <img
      src={"/logo-with-name.png"}
      alt={"clickable logo that takes to home"}
      height={"100%"}
      width={"auto"}
      className="h-[100%] w-auto hover:cursor-pointer"
    />
  );
};

// Replace with the actual profile image later on
const ProfilePicturePlaceHolder = () => {
  return (
    <div className="aspect-square h-[100%] w-auto rounded-full bg-teal-500 hover:cursor-pointer"></div>
  );
};

export const Header = () => {
  return (
    <div className="relative flex h-[10vh] justify-between bg-[#575C5F] p-2 md:h-[6vh]">
      <LogoWithName />
      <ProfilePicturePlaceHolder />
    </div>
  );
};
