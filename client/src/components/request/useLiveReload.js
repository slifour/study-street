import { useContext, useEffect } from "react";
import { LoginUserContext } from "../../App";
import { ReloadContext } from "./ReloadContext";

export default function useLiveReload({request, innerReloadTimeRef}) {
  const {loginUser} = useContext(LoginUserContext);
  const {reloadTime} = useContext(ReloadContext);

  useEffect(() => {
    if (loginUser && reloadTime > innerReloadTimeRef.current) {
      request();
    }
  }, [loginUser, reloadTime, innerReloadTimeRef, request]);
}