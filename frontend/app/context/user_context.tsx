import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchBackendGET } from "@/app/utils/fetch";
import { usePathname, useRouter } from "next/navigation";
import { GrInProgress } from "react-icons/gr";

export interface User {
  id: number;
  username: string;
  fullname: string;
  profilePictureId: string | null;
}

interface IUserContext {
  user: User;
}

const UserContext = createContext<IUserContext>({} as IUserContext);

interface Props {
  children?: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User>();

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
    if (pathname !== "/sign" && !user) {
      fetchUser();
    }
  }, [pathname]);

  if (pathname === "/sign") return <> {children} </>;

  if (!user)
    return (
      <div className={"flex h-screen"}>
        <div className={"m-auto"}>
          <GrInProgress className="size-8 animate-spin" />
        </div>
      </div>
    );

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext must be used within UserProvider");
  return ctx;
};
