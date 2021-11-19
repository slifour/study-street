/**
 * request.js
 */
import uniqueString from 'unique-string';
import socket from '../../socket';

export default class Request {
  constructor(socket, loginUser){
    this.usedRequestKeyRef = {current : uniqueString()};
    this.socket = socket 
    this.loginUser = loginUser
  }

  request = (requestType, payload = {}) => {
    this.socket.emit(requestType, {
      requestUser: this.loginUser.userID,
      requestKey: this.usedRequestKeyRef.current,
      requestType,
      payload: payload
    });
    console.log('request')
  
    // this.socket.on(responseType, this.onResponse);      
  }  

  onResponse = (onResponseOK, onResponseFail, requestKey, status, payload) => {
    console.log('response')
    if (requestKey === this.usedRequestKeyRef.current) {
      switch (status) {
        case "STATUS_OK": 
          onResponseOK && onResponseOK({requestKey, status, payload});
          break;
        case "STATUS_FAIL":
          onResponseFail && onResponseFail({requestKey, status, payload});
          break;
      }
    }
  }  
}

