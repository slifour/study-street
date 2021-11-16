import { useRef, useEffect, useContext, useCallback } from 'react';
import { LoginUserContext } from '../../App';
import uniqueString from 'unique-string';
import socket from '../../socket';

export default function useRequest({
    requestType, responseType, makePayload,
    onRequest, onResponseOK, onResponseFail
}) {
  const {loginUser} = useContext(LoginUserContext);
  const usedRequestKeyRef = useRef(null);
  const innerReloadTimeRef = useRef(new Date(0));

  const request = useCallback(() => {
    if (!loginUser) {
      console.warn("Request requires login");
    }
    usedRequestKeyRef.current = uniqueString();
      
    socket.emit(requestType, {
      requestUser: loginUser.userID,
      requestKey: usedRequestKeyRef.current,
      requestType,
      payload: makePayload ? makePayload() : {}
    });

    innerReloadTimeRef.current = new Date();
  }, [loginUser, makePayload, requestType]);

  const onResponse = useCallback(({responseType, requestKey, status, payload}) => {
    if (requestKey === usedRequestKeyRef.current) {
      console.log("Use request: got response ", {responseType, requestKey, status, payload});
      switch (status) {
        case "STATUS_OK": 
          onResponseOK && onResponseOK({requestKey, status, payload});
          break;
        case "STATUS_FAIL":
          onResponseFail && onResponseFail({requestKey, status, payload});
          break;
      }
    }
  }, [onResponseOK, onResponseFail]);

  useEffect(() => {
    socket.on(responseType, onResponse);
    return () => {socket.off(responseType, onResponse);};
  }, [onResponse, responseType]);

  return [request, innerReloadTimeRef];
}