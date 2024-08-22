import { PassageUser } from "@passageidentity/passage-elements/passage-user";
import { useEffect, useState } from "react";

type CurrentUser = {
  isLoading: boolean;
  isAuthorized: boolean;
  username: string;
  signOut: () => void;
};

export function useCurrentUser() {
  const [result, setResult] = useState<CurrentUser>({
    isLoading: true,
    isAuthorized: false,
    username: "",
    signOut: () => {
      throw new Error("Not implemented");
    },
  });

  useEffect(() => {
    let cancelRequest = false;
    let user: PassageUser | null = null;
    try {
      user = new PassageUser();
    } catch (e) {
      setResult({
        isLoading: false,
        isAuthorized: false,
        username: "",
        signOut: () => {
          throw new Error("Not implemented");
        },
      });
      return () => {
        cancelRequest = true;
      };
    }
    user.userInfo().then((userInfo) => {
      if (cancelRequest) {
        return;
      }
      if (userInfo === undefined) {
        setResult({
          isLoading: false,
          isAuthorized: false,
          username: "",
          signOut: () => {
            throw new Error("Not implemented");
          },
        });
        return;
      }
      setResult({
        isLoading: false,
        isAuthorized: true,
        username: userInfo.email ? userInfo.email : userInfo.phone,
        signOut: () => {
          user?.signOut();
        },
      });
    });
    return () => {
      cancelRequest = true;
    };
  }, []);
  return result;
}
