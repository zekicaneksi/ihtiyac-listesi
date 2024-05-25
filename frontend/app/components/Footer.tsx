import { useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export interface MenuElementProps {
  onClick: () => void;
  text: string;
}

export interface FooterProps {
  menuElements?: MenuElementProps[]; // Provide this for a menu
  backFunction?: () => void; // Provide this for the back variation
}

const Footer = (props: FooterProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  function showMenu() {
    setIsMenuOpen(true);
  }

  function hideMenu() {
    setIsMenuOpen(false);
  }

  const MenuElementHeight_BigScreen = 6;
  const MenuElementHeight_SmallScreen = 10;

  if (props.backFunction) {
    return (
      <div
        className={`relative h-[${MenuElementHeight_SmallScreen}vh] bg-foreground md:h-[${MenuElementHeight_BigScreen}vh]`}
      >
        <div
          className="relative z-[1] flex h-full items-center justify-center bg-foreground p-4 hover:brightness-150"
          onClick={props.backFunction}
        >
          <FaArrowUp className={`size-8 rotate-[270deg]`} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative h-[${MenuElementHeight_SmallScreen}vh] bg-foreground md:h-[${MenuElementHeight_BigScreen}vh]`}
    >
      <div
        className="relative z-[1] flex h-full items-center justify-center bg-foreground p-4 hover:brightness-150"
        onClick={isMenuOpen ? hideMenu : showMenu}
        onMouseEnter={showMenu}
      >
        <FaArrowUp className={`size-8 ${isMenuOpen && "rotate-180"}`} />
      </div>
      {isMenuOpen && props.menuElements && (
        <>
          <div
            className={`absolute bottom-[100%] z-[1] h-[${MenuElementHeight_SmallScreen * props.menuElements.length}vh]  md:h-[${MenuElementHeight_BigScreen * props.menuElements.length}vh]  w-full`}
          >
            {props.menuElements.map((elem, index) => {
              return (
                <div
                  key={index}
                  className={`flex items-center justify-center ${index === 0 && "border-t-4"} border-b-4 border-background h-[${MenuElementHeight_SmallScreen}vh] md:h-[${MenuElementHeight_BigScreen}vh] bg-foreground hover:brightness-150`}
                  onClick={() => {
                    elem.onClick();
                    setIsMenuOpen(false);
                  }}
                >
                  <p>{elem.text}</p>
                </div>
              );
            })}
          </div>
          <div
            className="fixed left-0 top-0 h-[100vh] w-[100vw] bg-black opacity-60"
            onClick={hideMenu}
            onMouseEnter={hideMenu}
          ></div>
        </>
      )}
    </div>
  );
};

export default Footer;
