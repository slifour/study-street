/* 이 파일은 서버에서 import해 사용합니다. 클라이언트에서도 같은 파일을 import할 수 있다면
   무척 편해질 것 같은데, 아직 방법을 찾지 못했어요. */

module.exports.RequestType = { // they are also used as socket event name
  LOGIN: "REQUEST_LOGIN",
  MY_PROFILE: "REQUEST_MY_PROFILE",
  MY_GROUP_LIST: "REQUEST_MY_GROUP_LIST",
  INVITE_FRIEND: "REQUEST_INVITE_FRIEND",
  PENDING_INVITE_LIST: "REQUEST_PENDING_INVITE_LIST",
  // 앞으로 더 만들기
};

module.exports.ResponseType = {
  OTHER: "OTHER", // For some invalid requests
  LOGIN: "RESPONSE_LOGIN", 
  MY_PROFILE: "RESPONSE_MY_PROFILE",
  MY_GROUP_LIST: "RESPONSE_MY_GROUP_LIST", // { groupID, groupName, etc. }
  INVITE_FRIEND: "RESPONSE_INVITE_FRIEND",
  PENDING_INVITE_LIST: "RESPONSE_PENDING_INVITE_LIST",
  // 앞으로 더 만들기
};

module.exports.ResponseStatus = {
  FAIL: "STATUS_FAIL",
  OK: "STATUS_OK"
};

/* Client는 아래 형식을 지켜 request를 보냅니다. */
/* Request user는 어떤 user가 보낸 요청인지에 따라 다른 response를 보내야 하는 경우가
     많아서 넣었어요. 예를 들어 MY_GROUP_LIST 요청은 요청한 user가 가입한 그룹을 모두
     response에 넣습니다. */
/* Request key는 각 request가 unique하게 지니는 키로, 클라이언트 입장에서 같은 
     이름의 request를 여러 번 보냈을 때 돌아오는 response를 구분할 수 없는 문제가 있어서
     넣었어요. 클라이언트는 import 'unique-string'을 한 뒤 uniqueString() 메소드로
     이 값을 생성해 request에 담아 보냅니다. 서버는 response를 할 때 그 requestKey를 
     그대로 다시 보냅니다. */
const exampleRequest = { // socketio event name: REQUEST_MY_GROUP_LIST
  requestUser: "eunki", // userID
  requestKey: "b4de2a49c8ffa3fbee04446f045483b2", // uniqueString()
  requestType: this.RequestType.MY_GROUP_LIST,
  payload: {} // // payload가 정말 보내려는 데이터입니다. payload의 형식은 request type마다 다를 수 있어요.
}

/* Server는 아래 형식으로 response를 보냅니다. */
/* status는 서버가 들어온 request을 제대로 처리했는지 payload에서 알려주기 어려운 문제를
     해결하기 위해 넣었어요. 예를 들어 client가 자기가 가입하지도 않은 그룹에 다른 유저를 초대하겠다는
     잘못된 요청을 보내면, 이 값은 "STATUS_FAIL"이 됩니다. client는 먼저 STATUS_OK를 확인한 뒤
     payload를 확인하면 많은 오류를 피할 수 있을 걸로 생각합니다. */

const exampleResponse = {
  requestKey: "b4de2a49c8ffa3fbee04446f045483b2", // socketio event name: RESPONSE_MY_GROUP_LIST
  responseType: this.ResponseType.MY_GROUP_LIST,
  status: this.ResponseStatus.OK,
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