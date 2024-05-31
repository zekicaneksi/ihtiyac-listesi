"use client";

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import LangMap from "./LangMap";
import FullPageLoadingScreen from "../components/FullPageLoadingScreen";

interface ILanguageContext {
  langMap: Required<Language>;
  setLanguage: (newLang: string) => void;
}

const LanguageContext = createContext<ILanguageContext>({} as ILanguageContext);

interface Language {
  code: string;
  values?: LangMap;
}

interface Props {
  children?: ReactNode;
}

export const LanguageProvider = ({ children }: Props) => {
  const [language, setLanguage] = useState<Language>({
    code:
      typeof window !== "undefined"
        ? getLanguageCode(window.navigator.language)
        : "en",
  });

  function getLanguageCode(langCode: string) {
    const trLangs = ["tr", "tr-CY", "tr-TR"];
    if (trLangs.includes(langCode)) {
      return "tr";
    } else return "en";
  }

  async function fetchLanguage() {
    if (language.values !== undefined) return;

    const response = await fetch("/language/" + language.code + ".json");
    const responseJson = await response.json();

    setLanguage({
      code: language.code,
      values: responseJson,
    });
  }

  function setNewLanguage(newLangCode: string) {
    setLanguage({ code: getLanguageCode(newLangCode) });
  }

  useEffect(() => {
    fetchLanguage();
  }, [language]);

  if (language.values === undefined) {
    return (
      <FullPageLoadingScreen show={true} message={"Getting language file..."} />
    );
  }

  return (
    <LanguageContext.Provider
      value={{
        langMap: language as Required<Language>,
        setLanguage: setNewLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx)
    throw new Error("useLanguageContext must be used within LanguageProvider");
  return ctx;
};
