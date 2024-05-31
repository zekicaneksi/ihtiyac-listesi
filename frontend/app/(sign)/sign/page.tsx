"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchBackendPOST } from "@/app/utils/fetch";
import { IoArrowBack } from "react-icons/io5";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import regexp from "@/app/utils/regexp";
import { useLanguageContext } from "@/app/context/LanguageContext";

export default function Register() {
  const router = useRouter();

  const [tab, setTab] = useState<"login" | "register">("login");

  const [disableForm, setDisableForm] = useState<boolean>(false);

  const [username, setUsername] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordAgain, setPasswordAgain] = useState<string>("");

  const [infoMessage, setInfoMessage] = useState<string>("");

  const { langMap, setLanguage } = useLanguageContext();

  useEffect(() => {
    setInfoMessage("");
  }, [tab]);

  async function register() {
    // Validating inputs
    if (RegExp(regexp.containsSpecialCharacter).test(username)) {
      setInfoMessage(langMap.values.sign.username_special);
    } else if (username.length < 6 || username.length > 15) {
      setInfoMessage(langMap.values.sign.username_length);
    } else if (
      RegExp(regexp.containsSpecialCharacterExceptSpaceOrNumber).test(fullname)
    ) {
      setInfoMessage(langMap.values.sign.fullname_special);
    } else if (fullname.length < 4 || fullname.length > 25) {
      setInfoMessage(langMap.values.sign.fullname_length);
    } else if (RegExp(regexp.containsWhiteSpace).test(password)) {
      setInfoMessage(langMap.values.sign.password_spaces);
    } else if (password.length < 8 || password.length > 20) {
      setInfoMessage(langMap.values.sign.password_length);
    } else if (password !== passwordAgain) {
      setInfoMessage(langMap.values.sign.password_match);
    } else {
      // Validation successful
      // Making the backend request
      setDisableForm(true);
      setInfoMessage(langMap.values.sign.creating_user);

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
        setInfoMessage(langMap.values.sign.username_exists);
      } else {
        router.push("/");
      }
    }

    setDisableForm(false);
  }

  async function login() {
    setDisableForm(true);
    setInfoMessage(langMap.values.sign.please_wait);

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
      setInfoMessage(langMap.values.sign.invalid_credentials);
    } else if (fetchResponse.status === 200) {
      // Login successful
      router.push("/");
    } else {
      // Unknown error
      setInfoMessage(langMap.values.sign.unknown_error);
    }

    setDisableForm(false);
  }

  return (
    <div className="flex h-screen">
      <div className="absolute right-0 mr-5 mt-5 h-10">
        <div className={`aspect-square h-[100%] w-auto hover:cursor-pointer`}>
          <img
            src={"/language/" + langMap.code + ".png"}
            className="size-full rounded-full"
            onClick={() => {
              if (langMap.code === "tr") setLanguage("en");
              else setLanguage("tr");
            }}
          />
        </div>
      </div>

      <div
        className={`${disableForm ? "pointer-events-none opacity-70" : ""} m-auto flex w-80  flex-col gap-4 bg-foreground px-4 py-4`}
      >
        <Input
          value={username}
          setValue={setUsername}
          placeholder={langMap.values.sign.username}
          type={"text"}
        />
        {tab === "register" && (
          <Input
            value={fullname}
            setValue={setFullname}
            placeholder={langMap.values.sign.fullname}
            type={"text"}
          />
        )}
        <Input
          value={password}
          setValue={setPassword}
          placeholder={langMap.values.sign.password}
          type={"password"}
        />
        {tab === "register" && (
          <Input
            value={passwordAgain}
            setValue={setPasswordAgain}
            placeholder={langMap.values.sign.password_again}
            type={"password"}
          />
        )}
        {infoMessage !== "" && (
          <p className="self-center text-center text-base text-gray-100">
            {infoMessage}
          </p>
        )}
        <Button
          onClick={() => {
            tab === "login" ? login() : register();
          }}
        >
          {tab === "login"
            ? langMap.values.sign.login
            : langMap.values.sign.register}
        </Button>
        {tab === "login" && (
          <p className={"self-center text-base text-gray-100"}>
            {langMap.values.sign.or}
          </p>
        )}
        <Button
          onClick={() => {
            setTab((old) => (old === "login" ? "register" : "login"));
          }}
        >
          {tab === "login" ? (
            langMap.values.sign.register
          ) : (
            <IoArrowBack className={"m-auto size-6"} />
          )}
        </Button>
      </div>
    </div>
  );
}
