"use client";

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchBackendGET } from "@/app/utils/fetch";
import { usePathname, useRouter } from "next/navigation";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import useWS from "@/app/hooks/useWS";
import FullPageLoadingScreen from "@/app/components/FullPageLoadingScreen";
import { ReadyState } from "react-use-websocket";
import LangMap from "./LangMap";

export interface User {
  _id: string;
  fullname: string;
  profilePictureId: string | null;
}

interface ILastJsonMessage {
  message: any;
  location: string;
}

interface IUserContext {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  wsSendJsonMessage: SendJsonMessage;
  wsLastJsonMessage: ILastJsonMessage | undefined;
  langMap: Required<Language>;
  setLanguage: (newLang: string) => void;
}

const UserContext = createContext<IUserContext>({} as IUserContext);

interface Language {
  code: string;
  values?: LangMap;
}

interface Props {
  children?: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User>();
  const ws = useWS({ url: "/" });
  const [wsLastJsonMessage, setWsLastJsonMessage] =
    useState<ILastJsonMessage>();
  const router = useRouter();
  const pathname = usePathname();

  const [language, setLanguage] = useState<Language>({
    code: typeof window !== "undefined" ? window.navigator.language : "en",
  });

  async function fetchUser() {
    let response = await fetchBackendGET("/hello");
    if (response.status === 200) {
      const responseUser: User = await response.json();
      setUser(responseUser);
    } else {
      router.push("/sign");
    }
  }

  async function fetchLanguage() {
    if (language.values !== undefined) return;

    async function getLangValue(lang: string): Promise<LangMap> {
      const response = await fetch("/language/" + lang + ".json");
      const responseJson = await response.json();
      return responseJson;
    }

    const trLangs = ["tr", "tr-CY", "tr-TR"];
    if (trLangs.includes(language.code)) {
      setLanguage({
        code: "tr",
        values: await getLangValue("tr"),
      });
    } else {
      setLanguage({
        code: "en",
        values: await getLangValue("en"),
      });
    }
  }

  function setNewLanguage(newLangCode: string) {
    setLanguage({ code: newLangCode });
  }

  useEffect(() => {
    fetchLanguage();
  }, [language]);

  useEffect(() => {
    setWsLastJsonMessage({ message: ws.lastJsonMessage, location: pathname });
  }, [ws.lastJsonMessage]);

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user)
    return (
      <FullPageLoadingScreen show={true} message={"Fetching credentials..."} />
    );

  if (ws.readyState !== ReadyState.OPEN)
    return (
      <FullPageLoadingScreen show={true} message={"Connecting real-time..."} />
    );

  if (language.values === undefined) {
    return (
      <FullPageLoadingScreen show={true} message={"Getting language file..."} />
    );
  }

  return (
    <UserContext.Provider
      value={{
        user: user,
        setUser: setUser,
        wsSendJsonMessage: ws.sendJsonMessage,
        wsLastJsonMessage: wsLastJsonMessage,
        langMap: language as Required<Language>,
        setLanguage: setNewLanguage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext must be used within UserProvider");
  return ctx;
};
