"use client";

import React, { useState, FunctionComponent } from "react";

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordAgain, setPasswordAgain] = useState<string>("");

  return (
    <div className="flex h-screen">
      <div className="m-auto flex flex-col gap-4 bg-slate-700 px-4 py-4">
        <Input
          value={username}
          setValue={setUsername}
          placeholder={"username"}
          type={"text"}
        />
        <Input
          value={fullname}
          setValue={setFullname}
          placeholder={"full name"}
          type={"text"}
        />
        <Input
          value={password}
          setValue={setPassword}
          placeholder={"password"}
          type={"password"}
        />
        <Input
          value={passwordAgain}
          setValue={setPasswordAgain}
          placeholder={"password again"}
          type={"password"}
        />
        <button className="bg-sky-500 px-3 py-3">Register</button>
      </div>
    </div>
  );
}

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
