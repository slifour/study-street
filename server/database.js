/* 
각 value의 key로 쓰인 userID, groupID 등의 값은 바꾸면 안돼요! 
그러면 데이터베이스에 있는 값이 정확하다고 보장할 수 없게 됩니다. 
i.e. 쓰는 사람 입장에서, 본인의 userName은 나중에 바꿀 수 있지만, userID는 바꿀 수 없어요. 
*/
class Goal {
  constructor(id, startDate, repeat){
    this.id = id;
    this.startDate = startDate;
    this.repeat = repeat;
  }
}

class timeGoal extends Goal{
  constructor(id, startDate, repeat){
    super(id, startDate, repeat);
  }
}

class appointmentGoal extends Goal {
  constructor(id, startDate, repeat){
    super(id, startDate, repeat);
  }
}

let userList = {
  "eunki": {
    "userID": "eunki",
    "userName": "은기",
    "status": "Developing user data system",
  },
  "haeseul": {
    "userID": "haeseul",
    "userName": "해슬",
    "status": "Making chatting system",
  },
  "hyeon": {
    "userID": "hyeon",
    "userName": "현",
    "status": "Putting map objects",
  },
  "jeonghoon": {
    "userID": "jeonghoon",
    "userName": "정훈",
    "status": "Designing figma prototype",
  },
};

let groupList = {
  "a": {
    groupID: "a",
    groupName: "We love study",
    leader: "eunki",
    member: ["eunki", "haeseul"],
    colors: ['#F79489', '#F9F1F0']
  },
  "b": {
    groupID: "b",
    groupName: "We love slifour",
    leader: "hyeon",
    member: ["eunki", "hyeon", "jeonghoon"],
    colors: ['#003B73', '#BFD7ED']
  },
};

/* 살짝 창의적으로 키를 띄어쓰기로 구분한 두 아이디로 써봤어요. "{Group ID} {User ID}" 형식입니다.
   왜 키를 이렇게 했냐면, 각 invitation이 [Group ID, User ID]로 unique하게 구분되기 때문이에요.
   i.e. [Group ID, User ID]가 invitation 테이블의 primary key입니다.
*/
let invitationList = {
  "a hyeon": {
    groupID: "a",
    friendID: "hyeon",
    hostUser: "eunki",
    inviteTime: new Date('07 Nov 2021 14:30:00 GMT+9')
  },
  "b haeseul": {
    groupID: "b",
    friendID: "haeseul",
    hostUser: "jeonghoon",
    inviteTime: new Date('07 Nov 2021 13:15:00 GMT+9')
  }
}

let goalList = {
  "a": {
    0 : new timeGoal(),
    1 : new appointmentGoal(),
  },
  "b": {
  },  
}

let bookList = {
  "a": {
    0 : [1,3,1,1,1],
    1 : [5,3,2,3],
  },
  "b": {
  },  
}


module.exports = {userList, groupList, invitationList, goalList, bookList};
