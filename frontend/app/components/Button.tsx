"use client";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Button = (props: ButtonProps) => {
  return (
    <button className="bg-element px-3 py-3" onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default Button;
