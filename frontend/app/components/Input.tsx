"use client";

import { FunctionComponent } from "react";

interface InputProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  type: "text" | "password";
}

const Input: FunctionComponent<InputProps> = (props) => {
  return (
    <input
      className="px-2 py-2"
      value={props.value}
      onChange={(e) => props.setValue(e.target.value)}
      placeholder={props.placeholder}
      type={props.type}
    ></input>
  );
};

export default Input;
