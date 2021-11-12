import { useContext, useEffect } from "react";
import { LoginUserContext } from "../../../App";
import { HomeContext } from "./HomeMain";

export default function useLiveReloadHome({request, innerReloadTimeRef}) {
  const {loginUser} = useContext(LoginUserContext);
  const {reloadTime} = useContext(HomeContext);

  useEffect(() => {
    if (loginUser && reloadTime > innerReloadTimeRef.current) {
      request();
    }
  }, [loginUser, reloadTime, innerReloadTimeRef, request]);
}