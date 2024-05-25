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
}

const UserContext = createContext<IUserContext>({} as IUserContext);

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

  async function fetchUser() {
    let response = await fetchBackendGET("/hello");
    if (response.status === 200) {
      const responseUser: User = await response.json();
      setUser(responseUser);
    } else {
      router.push("/sign");
    }
  }

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

  return (
    <UserContext.Provider
      value={{
        user: user,
        setUser: setUser,
        wsSendJsonMessage: ws.sendJsonMessage,
        wsLastJsonMessage: wsLastJsonMessage,
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
