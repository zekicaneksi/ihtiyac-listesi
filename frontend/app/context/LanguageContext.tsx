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
    code: typeof window !== "undefined" ? window.navigator.language : "en",
  });

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
