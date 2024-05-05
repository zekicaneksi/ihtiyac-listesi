import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchBackendGET } from "@/app/utils/fetch";
import { usePathname, useRouter } from "next/navigation";
import FullPageLoadingScreen from "../components/FullPageLoadingScreen";
import useWS from "../(app)/hooks/useWS";
import { WebSocketHook } from "react-use-websocket/dist/lib/types";

export interface User {
  id: number;
  username: string;
  fullname: string;
  profilePictureId: string | null;
}

interface IUserContext {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  ws: WebSocketHook<any, MessageEvent<any> | null>;
}

const UserContext = createContext<IUserContext>({} as IUserContext);

interface Props {
  children?: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User>();
  const ws = useWS({ url: "/" });

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
    if (pathname === "/sign") setUser(undefined);
    if (pathname !== "/sign" && !user) {
      fetchUser();
    }
  }, [pathname]);

  if (pathname === "/sign") return <> {children} </>;

  if (!user)
    return (
      <FullPageLoadingScreen show={true} message={"Fetching credentials..."} />
    );

  if (!ws)
    return (
      <FullPageLoadingScreen show={true} message={"Connecting real-time..."} />
    );

  return (
    <UserContext.Provider value={{ user, setUser, ws }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext must be used within UserProvider");
  return ctx;
};
