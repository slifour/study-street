const Chance = require("chance");
const chance = new Chance();

/* 
각 value의 key로 쓰인 userID, groupID 등의 값은 바꾸면 안돼요! 
그러면 데이터베이스에 있는 값이 정확하다고 보장할 수 없게 됩니다. 
i.e. 쓰는 사람 입장에서, 본인의 userName은 나중에 바꿀 수 있지만, userID는 바꿀 수 없어요. 
*/


const dummyAvatars = [
  'https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraightStrand&accessoriesType=Prescription01&hairColor=Black&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=ShirtScoopNeck&clotheColor=Gray01&eyeType=Side&eyebrowType=SadConcerned&mouthType=Sad&skinColor=Pale',
  'https://avataaars.io/?avatarStyle=Circle&topType=LongHairDreads&accessoriesType=Kurt&hairColor=BrownDark&facialHairType=MoustacheFancy&facialHairColor=Red&clotheType=ShirtVNeck&clotheColor=Gray02&eyeType=Wink&eyebrowType=RaisedExcitedNatural&mouthType=Default&skinColor=Brown',
  'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortWaved&accessoriesType=Wayfarers&hairColor=Blue&facialHairType=BeardLight&facialHairColor=Brown&clotheType=ShirtVNeck&clotheColor=Black&eyeType=Side&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light',
  'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Kurt&hairColor=PastelPink&facialHairType=BeardLight&facialHairColor=BlondeGolden&clotheType=BlazerSweater&clotheColor=Gray01&eyeType=Cry&eyebrowType=RaisedExcitedNatural&mouthType=Disbelief&skinColor=Pale',
  'https://avataaars.io/?avatarStyle=Circle&topType=LongHairDreads&accessoriesType=Sunglasses&hairColor=Platinum&facialHairType=MoustacheFancy&facialHairColor=BlondeGolden&clotheType=BlazerSweater&eyeType=Cry&eyebrowType=FlatNatural&mouthType=ScreamOpen&skinColor=DarkBrown',
  'https://avataaars.io/?avatarStyle=Circle&topType=LongHairFrida&accessoriesType=Kurt&hairColor=Blue&facialHairType=Blank&facialHairColor=Auburn&clotheType=BlazerShirt&eyeType=Wink&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Brown',
  'https://avataaars.io/?avatarStyle=Circle&topType=LongHairCurvy&accessoriesType=Kurt&hairColor=Brown&facialHairType=MoustacheMagnum&facialHairColor=Red&clotheType=Hoodie&clotheColor=Blue02&eyeType=Wink&eyebrowType=UpDownNatural&mouthType=ScreamOpen&skinColor=DarkBrown',
  'https://avataaars.io/?avatarStyle=Circle&topType=Hijab&accessoriesType=Kurt&hatColor=Blue03&hairColor=Black&facialHairType=MoustacheFancy&facialHairColor=Platinum&clotheType=BlazerShirt&clotheColor=Gray02&eyeType=Surprised&eyebrowType=Default&mouthType=Default&skinColor=DarkBrown',
  'https://avataaars.io/?avatarStyle=Circle&topType=LongHairDreads&accessoriesType=Round&hatColor=Blue02&hairColor=Black&facialHairType=BeardMedium&facialHairColor=BrownDark&clotheType=ShirtVNeck&clotheColor=PastelGreen&eyeType=Happy&eyebrowType=UpDownNatural&mouthType=Smile&skinColor=Pale',
  'https://avataaars.io/?avatarStyle=Circle&topType=LongHairMiaWallace&accessoriesType=Prescription02&hairColor=Blonde&facialHairType=BeardMedium&facialHairColor=Brown&clotheType=ShirtVNeck&clotheColor=PastelYellow&eyeType=Close&eyebrowType=Default&mouthType=Grimace&skinColor=Black',
];


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

//curGroup(string groupID) 추가
let userList = {
  "eunki": {
    "userID": "eunki",
    "userName": "은기",
    "status": "Developing user data system",
    "profileImage": dummyAvatars[0],
    "curGroup" : "a",
    "todayStudyTime": 7200 * 1000,
    "checklist" : {
      "8d4jnx" : {
          "checklistID" : "8d4jnx",
          "content" : "Presentation Preparation",
          "isDone" : false
      },
      "tx3b4e" : {
          "checklistID" : "tx3b4e",
          "content" : "Reading Response",
          "isDone" : true
      }
    },
    "socketID": null
  },
  "haeseul": {
    "userID": "haeseul",
    "userName": "해슬",
    "profileImage": dummyAvatars[1],
    "todayStudyTime": 7200 * 1000,
    "status": "Making chatting system",
    "curGroup" : "a",
    "socketID": null
  },
  "guest": {
    "userID": "guest",
    "userName": "게스트",
    "profileImage": dummyAvatars[1],
    "todayStudyTime": 7200 * 1000,
    "status": "Making chatting system",
    "curGroup" : "a",
    "socketID": null
  },
  "hyeon": {
    "userID": "hyeon",
    "userName": "현",
    "profileImage": dummyAvatars[2],
    "todayStudyTime": 7200 * 1000,
    "status": "Putting map objects",
    "curGroup" : "b",
    "socketID": null
  },
  "jeonghoon": {
    "userID": "jeonghoon",
    "userName": "정훈",
    "profileImage": dummyAvatars[3],
    "todayStudyTime": 7200 * 1000,
    "status": "Designing figma prototype",
    "curGroup" : "b",
    "socketID": null
  },
};

let groupList = {
  "a": {
    groupID: "a",
    groupName: "We love study",
    leader: "eunki",
    member: ["eunki", "haeseul", "guest"],
    colors: ['#F79489', '#F9F1F0'],
    quests: {
      "eq2dm5" : {
          questID : "eq2dm5",
          type : "Attendance",
          content : "11/18",
          contentDate : new Date(2021, 10, 18, 0, 0),
          acceptedUsers : ["eunki", "haeseul", "guest"], // TODO: acceptedUsers, doneUsers, notYetUsers 중 하나는 없어도 됨.
          doneUsers : ["haeseul", "guest"],
          participatingUsers : [],
          notYetUsers : ["eunki"]
      },
      "nbxm3m" : {
          questID : "nbxm3m",
          type : "Goal",
          content : "3 hours",
          contentDate : 3 * 3600 * 1000,
          acceptedUsers : ["haeseul"],
          doneUsers : [],
          participatingUsers : ["haeseul"],
          notYetUsers : []
      }
    }
  },
  "b": {
    groupID: "b",
    groupName: "We love slifour",
    leader: "hyeon",
    member: ["eunki", "hyeon", "jeonghoon"],
    colors: ['#003B73', '#BFD7ED'],
    quests: {}
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
  'a':[],
  'b':[]
};

// let bookList = {
//   "a": ['A 1','A 3','A 1', 'G 1', 'G 1'],
//   "b": ['A 1','A 3','A 1', 'G 1', 'G 1'],
// }

module.exports = {userList, groupList, invitationList, goalList, bookList};
