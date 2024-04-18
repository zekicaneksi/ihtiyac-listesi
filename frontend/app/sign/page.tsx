"use client";

import React, { useState, FunctionComponent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchBackendPOST } from "@/app/utils/fetch";

export default function Register() {
  const router = useRouter();

  const [tab, setTab] = useState<"login" | "register">("login");

  const [disableForm, setDisableForm] = useState<boolean>(false);

  const [username, setUsername] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordAgain, setPasswordAgain] = useState<string>("");

  const [infoMessage, setInfoMessage] = useState<string>("");

  useEffect(() => {
    setInfoMessage("");
  }, [tab]);

  async function register() {
    let checkRegexps = {
      containsSpecialCharacters: /[^a-zA-Z0-9]/,
      charactersAndSpacesOnly: /[^a-zA-Z ]/,
      containsWhiteSpace: /[ ]/,
    };

    // Validating inputs
    if (checkRegexps.containsSpecialCharacters.test(username)) {
      setInfoMessage("Username cannot contain special characters");
    } else if (username.length < 6 || username.length > 15) {
      setInfoMessage("Username must be 6-15 characters long");
    } else if (checkRegexps.charactersAndSpacesOnly.test(fullname)) {
      setInfoMessage("Full name must consist of characters and spaces only");
    } else if (fullname.length < 4 || fullname.length > 25) {
      setInfoMessage("Fullname must be 4-25 characters long");
    } else if (checkRegexps.containsWhiteSpace.test(password)) {
      setInfoMessage("Password cannot contain whitespaces");
    } else if (password.length < 8 || password.length > 20) {
      setInfoMessage("Password must be 8-20 characters long");
    } else if (password !== passwordAgain) {
      setInfoMessage("Passwords do not match");
    } else {
      // Validation successful
      // Making the backend request
      setDisableForm(true);
      setInfoMessage("please wait...");

      interface IBodyData {
        username: string;
        fullname: string;
        password: string;
      }
      const bodyData: IBodyData = {
        username: username,
        fullname: fullname,
        password: password,
      };

      const fetchResponse = await fetchBackendPOST<IBodyData>(
        "/register",
        bodyData,
      );

      if (fetchResponse.status === 406) {
        setInfoMessage("Username exists, please choose another username");
      } else {
        router.push("/");
      }
    }

    setDisableForm(false);
  }

  async function login() {
    setDisableForm(true);
    setInfoMessage("please wait...");

    interface IBodyData {
      username: string;
      password: string;
    }

    const fetchResponse = await fetchBackendPOST<IBodyData>("/login", {
      username: username,
      password: password,
    });

    if (fetchResponse.status === 401) {
      // Invalid credentials
      setInfoMessage("Invalid credentials");
    } else if (fetchResponse.status === 200) {
      // Login successful
      router.push("/");
    } else {
      // Unknown error
      setInfoMessage("Unkown error");
    }

    setDisableForm(false);
  }

  return (
    <div className="flex h-screen">
      <div
        className={`${disableForm ? "pointer-events-none opacity-70" : ""} m-auto flex w-80  flex-col gap-4 bg-slate-700 px-4 py-4`}
      >
        <Input
          value={username}
          setValue={setUsername}
          placeholder={"username"}
          type={"text"}
        />
        {tab === "register" && (
          <Input
            value={fullname}
            setValue={setFullname}
            placeholder={"full name"}
            type={"text"}
          />
        )}
        <Input
          value={password}
          setValue={setPassword}
          placeholder={"password"}
          type={"password"}
        />
        {tab === "register" && (
          <Input
            value={passwordAgain}
            setValue={setPasswordAgain}
            placeholder={"password again"}
            type={"password"}
          />
        )}
        {infoMessage !== "" && (
          <p className="self-center text-center text-base text-gray-100">
            {infoMessage}
          </p>
        )}
        <button
          className="bg-sky-500 px-3 py-3"
          onClick={() => {
            tab === "login" ? login() : register();
          }}
        >
          {tab === "login" ? "Login" : "Register"}
        </button>
        {tab === "login" && (
          <p className={"self-center text-base text-gray-100"}>or</p>
        )}
        <button
          className="bg-sky-500 px-3 py-3"
          onClick={() => {
            setTab((old) => (old === "login" ? "register" : "login"));
          }}
        >
          {tab === "login" ? "Register" : "<"}
        </button>
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
