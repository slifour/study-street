# Study-street의 서버는 어떻게 작동하는가?

## 이 글이 다루는 내용
- 큰 줄기
- 서버에 요청 보내기
- 서버에게 응답 받기 (클라이언트에 응답 보내기)

## 큰 줄기

이 시스템에는 두 주체가 있어요. 클라이언트와 서버입니다. 

클라이언트는 브라우저 쪽이에요. 우리 코드에서는 `client` 폴더에 있는 것들입니다. 개발할 때는 `localhost:3000`에 해당하구요, `socket.io-client` 라이브러리를 써서 통신합니다. 주요 파일은 `socket.js`, `App.js` `components/request/*.js`, 그리고 react 컴포넌트들이에요.

서버는 그 반대에요. 우리 코드에서는 `server` 폴더에 있는 것들이구요, `localhost:4001`에 해당해요. `socket.io` 라이브러리를 씁니다. 주요 파일은 `socketIOServer.js`, `database.js`, `requestHandle.js`, `requestType.js`에요.

클라이언트가 현재 그룹의 그룹 목표를 보여주고 싶어요. 어떻게 하면 좋을까요? 우선 서버와 통신을 해서 데이터를 불러와야 해요. 우리 시스템에서 이 과정은 클라이언트의 요청(request)과 서버의 응답(response)으로 이루어집니다.

생활 속 비유를 하나 들어볼게요. 그러면서 payload가 무엇인지도 설명할게요.

1. 운동화 주문
- 재석이가 운동화를 갖고 싶어요. 어떻게 할까요? 쇼핑몰에 주문을 하겠죠? 클라이언트가 request를 보내는 건 이렇게 쇼핑몰에게 내가 원하는 걸 알려주는 것에 해당해요.

- 쇼핑몰 주인인 홍철이는 그 요청을 받고 창고에서 운동화를 꺼내와요. 그 다음에 이걸 택배로 보냅니다. 서버의 response에요.

- 며칠 뒤 재석이가 받는 건 뭘까요? 운동화만 받지는 않겠죠, 택배 박스에 담긴 운동화를 받을 거에요. 택배 박스에는 보낸 사람의 이름, 받는 사람의 이름, 주소 등 여러 부가 정보가 있어요. 여기서 택배 박스 전체가 response라면, 운동화는 payload에 해당합니다. 재석이는 택배 박스에 적힌 정보를 확인하고, 제대로 온 박스라면 안에 있는 payload를 꺼내 쓰게 될 거에요.

우리 시스템이 쓰는 실제 reponse는 다음과 같아요. request 역시 실제로는 payload와 나머지로 구성됩니다.

```js
const exampleResponse = {
  // socketio event name: RESPONSE_MY_GROUP_LIST
  responseType: this.ResponseType.MY_GROUP_LIST,
  requestKey: "b4de2a49c8ffa3fbee04446f045483b2", 
  status: this.ResponseStatus.OK, // 이게 FAIL일 수도 있어요. 그러면 요청을 처리하지 못한 것입니다.
  payload: { // payload가 정말 보내려는 데이터입니다. payload의 형식은 response type마다 다를 수 있어요.
    "a": {
      groupID: "a",
      groupName: "We love study",
      leader: "eunki",
      color: "#FFE76A",
      member: ["eunki", "haeseul"]
    },
    "b": {
      groupID: "b",
      groupName: "We love slifour",
      leader: "hyeon",
      color: null,
      member: ["eunki", "hyeon", "jeonghoon"]
    },
  }
}
```



## 서버에 요청 보내기

[compoents/ui/Home/HomeInfoGotInvitation.js]
```jsx
import React, { useCallback, useContext, useState } from "react";
import { LoginUserContext } from "../../../App";
import GotInvitationListItem from "./GotInvitationListItem";
import styles from "./home.module.css";
import useLiveReload from "../../request/useLiveReload";
import useRequest from "../../request/useRequest";

export default function HomeInfoGotInvitation() {
  const {loginUser} = useContext(LoginUserContext);
  const [gotInvitationList, setGotInvitationList] = useState([]);

  const onResponseOK = useCallback(({payload}) => {
    setGotInvitationList(payload);
  }, [setGotInvitationList]);

  const onResponseFail = useCallback(({payload}) => {
    console.warn(payload.msg || "Failed to obtain got invitation lists (client msg)");
  }, []);

  const makePayload = useCallback(() => ({      
    userID: loginUser.userID
  }), [loginUser.userID]);

  const [request, innerReloadTimeRef] = useRequest({
    requestType: "REQUEST_PENDING_INVITE_LIST", responseType: "RESPONSE_PENDING_INVITE_LIST",
    onResponseOK, onResponseFail, makePayload
  });

  useLiveReload({request, innerReloadTimeRef});

  return (
    <div>
      <h1>Invites</h1>
      <div>
        {gotInvitationList.map( gotInvitation => (
          <GotInvitationListItem 
            key={`${gotInvitation.groupID} ${gotInvitation.friendID}`}
            gotInvitation={gotInvitation}/>
        ))}
      </div>
    </div>
  );
}
```

이 컴포넌트는 나에게 온 초대장의 목록을 서버에서 불러와 보여줍니다.
하나씩 살펴볼게요.

### 1.
```jsx
  const {loginUser} = useContext(LoginUserContext);
  const [gotInvitationList, setGotInvitationList] = useState([]);
```
`useContext`는 react에서 전역 변수를 관리할 수 있게 하는 hook이에요. `LoginUserContext`는 현재 유저 정보를 담고 있구요. 이렇게 하면 `loginUser`에 현재 유저 정보가 저장됩니다. `loginUser`는 `database.js`의 `userList`에서 그 타입을 확인할 수 있어요. 

주의하실 건, `const {loginUser} = ...`이지 `const [loginUser] = ...`이 아니라는 점이에요.

`gotInvitationList`는 이 컴포넌트에서 쓰는 state에요. 나중에 서버에서 response를 받으면 이 state를 변경할 예정이에요.

### 2.
```jsx
  const onResponseOK = useCallback(({payload}) => {
    setGotInvitationList(payload);
  }, [setGotInvitationList]);

  const onResponseFail = useCallback(({payload}) => {
    console.warn(payload.msg || "Failed to obtain got invitation lists (client msg)");
  }, []);

  const makePayload = useCallback(() => ({      
    userID: loginUser.userID
  }), [loginUser.userID]);
```

서버에서 초대장 목록을 받으면 그걸 컴포넌트에 업데이트해야 할 거예요. 이와 같이 response가 잘 왔을 때 할 일은 `onResponseOK = useCallback({payload} => { ... }, []);` 안에 작성합니다. 여기서는 `setGotInvitationList`를 통해 컴포넌트의 state를 업데이트했어요.

만약 어떤 이유로든 초대장 목록을 받아오지 못했어요. 이 예에서는 실패할 이유가 별로 없지만, 이미 다른 goal에 참여 중인데 새로운 goal을 또 accept하려 하는 경우, 그룹에 이미 있는 유저에게 초대장을 보내는 경우 등 서버에서 클라이언트의 request를 처리하지 못할 때가 있어요. 이렇게 실패했다는 response가 왔을 때 할 일은 `const onResponseFail = useCallback(({payload}) => { ... }. []);` 안에 넣습니다. 이때 서버는 `payload.msg`에 request를 처리 못한 이유를 써주기 때문에, 여기서는 그것을 console에 표시하도록 했어요.

request의 내용, 다시말해 request의 payload는 어떻게 적어야 할까요? 그건 request의 종류에 따라 달라요. 이건 서버가 `requestHandle.js`에서 request를 어떻게 처리하는지를 보면 됩니다. 우리는 `REQUEST_PENDING_INVITE_LIST` 요청을 보내니 서버 코드를 볼게요.

  [server/requestHandle.js]
  ```js
  const onRequestPendingInviteList = (socket, request) => {
      const {requestUser, requestKey, payload} = request;
      const responseType = ResponseType.PENDING_INVITE_LIST;

      if (!requestUser) {
        return responseFail(socket, requestKey, responseType, "Login is required.");
      }

      /* There are two types of payload.
        1. { userID }
        2. { groupID } */ 

      let filtered;
      if (payload.userID) {
        filtered = Object.values(invitationList).filter( ({friendID}) => payload.userID === friendID );
      } else if (payload.groupID) {
        filtered = Object.values(invitationList).filter( ({groupID}) => payload.groupID === groupID );
      } else {
        return responseFail(socket, requestKey, responseType, "Invalid payload.");
      }
      return socket.emit(responseType, {
        requestKey,
        responseType,
        status: ResponseStatus.OK,
        payload: filtered
      });
    }
  ```

아래서 자세히 설명하겠지만, 서버는 `REQUEST_PENDING_INVITE_LIST` 요청에 `payload.userID`가 있다면 그 user에게 온 초대장의 목록을 response에 담아 보내요. 따라서 우리는 payload를 `{ userID: "jeonghoon" }`과 같이 보내면 돼요. 이와 같이 payload를 만드는 코드는 `const makePayload = useCallback(() => ({ ... (payload) }))` 안에 넣어줍니다. 주의할 점은, 이 코드에서는 payload를 `() => (...)` 안에 넣어 바로 반환하도록 했다는 거예요. 다르게 하려면 `() => { return ... }`으로 써도 됩니다.

### 3. 
```jsx
const [request, innerReloadTimeRef] = useRequest({
  requestType: "REQUEST_PENDING_INVITE_LIST", responseType: "RESPONSE_PENDING_INVITE_LIST",
  onResponseOK, onResponseFail, makePayload
});
```
`useRequest`는 request를 보내고 데이터가 잘 왔는지 확인할 수 있게 도와주는 custom hook이에요. (제가 만들었어요👏) socket.io가 택배원 명수 씨라면, `useRequest`는 편의점에서 택배를 보내게 도와주는 알바생 준하 씨와 같은 역할을 해요. 여기에 `requestType`, `responseType`을 등록하고 앞에서 만든 함수를 넣어줍니다. 

`requestType`, `responseType`은 [($PROJECT_HOME)/requestType.js]에 있어요. 새로운 request, response 종류를 만들 때는 이 파일도 함꼐 수정해야 합니다. 사실 `reponseType`이 없어도 될 것 같은데, 일단 지금은 작성해줘야 해요. `requestType`에서 `REQUEST_`만 `RESPONSE_`로 바꿔주면 됩니다.

useRequest는 `[request, innerReloadTimeRef]`를 return해요. 
- `request`는 request를 보내는 함수입니다.
- `innerReloadTimeRef`는 live reload를 관리하기 위한 reference에요. 
이것들을 어떻게 쓰는지는 4번에서 설명할게요.

### 4. 

`useRequest`까지 했다면 모든 준비는 끝났어요. 이제 request를 보내려면 `request();` 이렇게 쓰면 그만입니다!

그런데, request는 언제 보내야 할까요? 상황별로 예시를 들어볼게요.

#### (1) live reload (예시 코드에서 씀)
```jsx
useLiveReload({request, innerReloadTimeRef});
```
`useLiveReload`는 특정 범위에 있는 컴포넌트가 실시간으로 업데이트되도록 도와주는 custom hook이에요. 이렇게 쓰면 필요할 때마다 request가 자동으로 다시 보내집니다. 그렇다면 '필요할 때'를 어떻게 결정할까요? 그것을 도와주는 게 `ReloadContext` [components/request/ReloadContext.js] 에 있는 `setReloadTime` 함수에요. 예시 코드를 볼게요.

[components/ui/Home/GotInvitationJoinButton.js]
```jsx
// 일부
const onResponseOK = useCallback(({payload}) => {
  setReloadTime(new Date());
}, [setReloadTime]);
```
이 컴포넌트는 다른 그룹에서 온 초대를 수락하는 버튼이에요. `REQUEST_JOIN_GROUP` request를 보낸 뒤, 성공하면 `setReloadTime(new Date());`를 호출합니다. 이러면 전역의 `reloadTime` 값이 현재 시간으로 바뀌어요. `useLiveReload` hook은 이 `reloadTime` 값이 `innerReloadTimeRef.current`보다 최신이라면 request를 다시 보내요.

그러니까 정리하면 이렇습니다.
- 알아서 업데이트되는 컴포넌트: `useLiveReload({request, innerReloadTimeRef});` 사용
- 다른 컴포넌트가 업데이트되도록 하기: `setReloadTime(new Date());` 사용

#### (2) 직접 request 보내기
[components/ui/Home/GotInvitationJoinButton.js]
```jsx
// 일부
return ( <button onClick={request}> Join </button> );
```
방금 살펴본 다른 그룹에서 온 초대를 수락하는 버튼이에요. 이 버튼은 `REQUEST_JOIN_GROUP` request를 보내는데, 아무 때나 보내면 안 돼요. 유저가 Join 버튼을 눌렀을 때만 request를 보내야 합니다. 그래서 여기서는 버튼을 누르면 `request` 함수가 실행되도록 했어요.

### 참고

- `loginUser`는 같은 `<LoginUserContext.Provider> ... </LoginUserContext.Provider>` 안에 들어있는 컴포넌트들 사이에서 공유됩니다. `App.js`를 확인하세요.

- `reloadTime`과 `setReloadTime`은 같은 `<ReloadContext.Provider> ... </ReloadContext.Provider>` 안에 들어있는 컴포넌트들 사이에서 공유됩니다. `HomeMain.js`를 확인하세요. 만약 체크리스트에서 live reload 기능을 쓰려면, 체크리스트 컴포넌트들을 새로운 `<ReloadContext.Provider> ... </ReloadContext.Provider>` 안에 넣고 간단한 설정을 해야 해요. 제가 아직 체크리스트 코드를 못 봐서, 저한테 코드와 함께 물어봐주시면 알려드릴게요. `HomeMain.js`에 있는 코드를 그대로 적용하면 될 겁니다.

- 코드를 쓰면서 자바스크립트의 destructuring assignment 문법을 자주 썼어요. 혹시 문법이 이상하게 느껴지시면 이걸 참고하시면 도움이 될 것 같아요.
[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment] (Eng)
[https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment] (Kor)

- 제가 주로 참고한 문서입니다.
[https://react.vlpt.us/basic/12-variable-with-useRef.html]
[https://react.vlpt.us/basic/18-useCallback.html]
[https://react.vlpt.us/basic/22-context-dispatch.html]


## 서버에게 응답 받기 (클라이언트에 응답 보내기)

서버는 `requestHandle.js`에서 요청을 처리하고 응답을 보내요. 예시는 아까 봤던 초대장 목록을 응답하는 코드입니다. 하나씩 살펴볼게요.

### 1. 
[server/requestHandle.js]
```js
module.exports = onRequest = (socket, requestName, request) => {
  console.log("Got request:", request);
  let requestUser, requestKey, requestType, payload;
  try {
    ({requestUser, requestKey, requestType, payload} = request);
    if (requestName !== requestType) throw new Error();
  } catch {
    console.warn("Invalid request: ", request);
    responseFail(socket, request.requestKey || "", ResponseType.OTHER, "Invalid request.");
    return;
  }
  let response;
  switch (requestType) {
    case RequestType.MY_GROUP_LIST: onRequestMyGroupList(socket, request); break;
    case RequestType.INVITE_FRIEND: onRequestInviteFriend(socket, request); break;
    case RequestType.LOGIN: onRequestLogin(socket, request); break;
    case RequestType.MY_PROFILE: onRequestMyProfile(socket, request); break;
    case RequestType.PENDING_INVITE_LIST: onRequestPendingInviteList(socket, request); break;
    case RequestType.CREATE_GROUP: onRequestCreateGroup(socket, request); break;
    case RequestType.JOIN_GROUP: onRequestJoinGroup(socket, request); break;
  }
  socket.emit("response", response);
}
```

`onRequest`는 모든 request를 우선 처리하는 함수에요. 택배사의 중앙 물류센터와 비슷합니다. 여기서 중요한 건, 새로운 request handler를 만들고 나면 그걸 등록해줘야 한다는 거에요. 예를 들어 초대장 목록을 응답하는 함수를 등록하기 위해 해야 할 일은 다음과 같아요.

**큰 줄기는 이렇습니다. 구현할 때는 여기를 먼저 보세요**

- `requestType.js` 에서
  
  `RequestType`에 `PENDING_INVITE_LIST: "REQUEST_PENDING_INVITE_LIST"` 추가,

  `ResponseType`에 `PENDING_INVITE_LIST: "RESPONSE_PENDING_INVITE_LIST"` 추가

- `requestHandle.js`에서
  
  `onRequest` 안에 
  `case RequestType.PENDING_INVITE_LIST: onRequestPendingInviteList(socket, request); break;` 추가

- `requestHandle.js`에서 `onRequestPendingInviteList(socket, request)` 함수 작성

**========================================**

### 2. 

```jsx
const onRequestPendingInviteList = (socket, request) => {
  const {requestUser, requestKey, payload} = request;
  const responseType = ResponseType.PENDING_INVITE_LIST;

  if (!requestUser) {
    return responseFail(socket, requestKey, responseType, "Login is required.");
  }

  /* There are two types of payload.
    1. { userID }
    2. { groupID } */ 

  let filtered;
  if (payload.userID) {
    filtered = Object.values(invitationList).filter( ({friendID}) => payload.userID === friendID );
  } else if (payload.groupID) {
    filtered = Object.values(invitationList).filter( ({groupID}) => payload.groupID === groupID );
  } else {
    return responseFail(socket, requestKey, responseType, "Invalid payload.");
  }
  return socket.emit(responseType, {
    requestKey,
    responseType,
    status: ResponseStatus.OK,
    payload: filtered
  });
}
```

아까도 본 `onRequestPendingInviteList` 함수에요. 이 함수가 실제로 요청을 처리하고 응답을 보냅니다. 운동화 주문을 받은 우리의 쇼핑몰 주인 홍철이가 바로 여기 있다고 볼 수 있어요. 

설명을 위해 코드를 좀 요약해볼게요. 아래는 동작하는 최소한의 코드입니다.
```jsx
// onRequestPendingInviteList 짧은 버전
const onRequestPendingInviteList = (socket, request) => {
  /* There are two types of payload.
    1. { userID }
    2. { groupID } */ 

  let filtered;
  if (payload.userID) {
    filtered = Object.values(invitationList).filter( ({friendID}) => payload.userID === friendID );
  } else if (payload.groupID) {
    filtered = Object.values(invitationList).filter( ({groupID}) => payload.groupID === groupID );
  }

  return socket.emit(ResponseType.PENDING_INVITE_LIST, {
    requestKey: request.requestKey,
    responseType: ResponseType.PENDING_INVITE_LIST,
    status: ResponseStatus.OK,
    payload: filtered
  });
}
```

홍철이가 이 함수에서 하는 일은 크게 두 가지에요. 
1. 만약 userID를 포함한 요청이 오면, 그 유저가 받은 초대장의 목록을 응답합니다.
2. 만약 groupID를 포함한 요청이 오면, 그 그룹이 보낸 초대장의 목록을 응답합니다.

응답을 보낼 때는 `socket.emit` 함수를 써요. 주의할 점은, 정해진 형식에 맞게 보내야 한다는 겁니다. 택배 박스에 붙어있는 운송장에 형식이 있는 것과 비슷해요. 위 코드와 같이 하면 됩니다. socketio event name은 `responseType`과 같고, 응답은 `requestKey`, `responseType`, `status`, `payload`를 포합합니다. payload의 형식은 requestType에 따라 자유롭게 정할 수 있구요.

이제 요약하기 전 함수를 볼까요? 만약 홍철이가 받은 요청을 처리할 수 없으면 Fail 응답을 보내요. 앞에서 본 것과 같이 보내면서 `status: ResponseStatus.FAIL`을 설정해주면 되는데, 비슷한 식으로 자주 보내게 되기 때문에 이걸 도와주는 함수가 있습니다. 앞의 코드처럼 `return responseFail(socket, requestKey, responseType, "Login is required.");` 와 같은 식으로 호출하면 됩니다.

### 참고
- 코드를 쓰면서 제가 주로 참고한 문서입니다.
[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values] // 데이터베이스가 자바스크립트 Object라서, Object 관련 함수들을 많이 쓰게 되더라구요.

## 뒷얘기

글이 길어졌네요. 코드 자체가 그렇게 복잡해지지는 않을 거에요. 이런 식으로 request와 response에 규칙을 두는 게 그렇게 안 하는 것보다는 코드가 길어질 수 있겠지만, 코드가 많아질 수록 결국 길이도 짧아지고 디버깅도 쉬워질 거라고 생각합니다. 

잘 모르지만 시행착오를 겪으면서 쓰는 방법을 계속 업데이트하고 있어요. 지금도 관련 코드가 구현이나 쓰는 방법의 디자인 모두 여러모로 부족한 점이 많은데, 그래도 한번 얘기를 길게 했으니 앞으로는 쓰는 방법을 가능한 바꾸지 않을게요. 뭐든 편하게 물어봐주세요! 감사합니다.