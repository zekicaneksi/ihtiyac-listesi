"use client";

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  bgColor?: string;
}

const Button = (props: ButtonProps) => {
  return (
    <button
      className={`${props.bgColor ? props.bgColor : "bg-element"} px-3 py-3 ${props.disabled ? "pointer-events-none opacity-70" : "hover:brightness-105"}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
