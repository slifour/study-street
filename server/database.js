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
    "avatarSprite": "user_1",
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
    "avatarSprite": "user_2",
    "profileImage": dummyAvatars[1],
    "todayStudyTime": 7200 * 1000,
    "status": "Making chatting system",
    "curGroup" : "a",
    "socketID": null
  },
  "guest": {
    "userID": "guest",
    "userName": "게스트",
    "avatarSprite": "user_3",
    "profileImage": dummyAvatars[1],
    "todayStudyTime": 7200 * 1000,
    "status": "Making chatting system",
    "curGroup" : "a",
    "socketID": null
  },
  "hyeon": {
    "userID": "hyeon",
    "userName": "현",
    "avatarSprite": "user_4",
    "profileImage": dummyAvatars[2],
    "todayStudyTime": 7200 * 1000,
    "status": "Putting map objects",
    "curGroup" : "a",
    "socketID": null
  },
  "jeonghoon": {
    "userID": "jeonghoon",
    "userName": "정훈",
    "avatarSprite": "user_1",
    "profileImage": dummyAvatars[3],
    "todayStudyTime": 7200 * 1000,
    "status": "Designing figma prototype",
    "curGroup" : "a",
    "socketID": null
  },
  "Alua Orazbek": {
    "userID": "Alua Orazbek",
    "userName": "Alua Orazbek",
    "profileImage": dummyAvatars[4],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Assem Zhunis": {
    "userID": "Assem Zhunis",
    "userName": "Assem Zhunis",
    "profileImage": dummyAvatars[9],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Auejin Ham": {
    "userID": "Auejin Ham",
    "userName": "Auejin Ham",
    "profileImage": dummyAvatars[5],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Bauyrzhan Tokenov": {
    "userID": "Bauyrzhan Tokenov",
    "userName": "Bauyrzhan Tokenov",
    "profileImage": dummyAvatars[6],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Bekzat Tilekbay": {
    "userID": "Bekzat Tilekbay",
    "userName": "Bekzat Tilekbay",
    "profileImage": dummyAvatars[0],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Charlie .": {
    "userID": "Charlie .",
    "userName": "Charlie .",
    "profileImage": dummyAvatars[8],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Cheryl Siy": {
    "userID": "Cheryl Siy",
    "userName": "Cheryl Siy",
    "profileImage": dummyAvatars[3],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Chigon Ryu": {
    "userID": "Chigon Ryu",
    "userName": "Chigon Ryu",
    "profileImage": dummyAvatars[3],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Chloe McCracken": {
    "userID": "Chloe McCracken",
    "userName": "Chloe McCracken",
    "profileImage": dummyAvatars[4],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Chulhwan Kim": {
    "userID": "Chulhwan Kim",
    "userName": "Chulhwan Kim",
    "profileImage": dummyAvatars[7],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Dain Kim": {
    "userID": "Dain Kim",
    "userName": "Dain Kim",
    "profileImage": dummyAvatars[5],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Diyar Tulenov": {
    "userID": "Diyar Tulenov",
    "userName": "Diyar Tulenov",
    "profileImage": dummyAvatars[9],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Eunki Joung": {
    "userID": "Eunki Joung",
    "userName": "Eunki Joung",
    "profileImage": dummyAvatars[6],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "fathony achmad": {
    "userID": "fathony achmad",
    "userName": "fathony achmad",
    "profileImage": dummyAvatars[1],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Haeseul Cha": {
    "userID": "Haeseul Cha",
    "userName": "Haeseul Cha",
    "profileImage": dummyAvatars[9],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Haesoo Kim": {
    "userID": "Haesoo Kim",
    "userName": "Haesoo Kim",
    "avatarSprite": "user_1",
    "profileImage": dummyAvatars[6],
    "todayStudyTime": null,
    "status": null,
    "curGroup": "kixlab",
    "socketID": null,
    "checklist": null
  },
  "hong beom yoo": {
    "userID": "hong beom yoo",
    "userName": "hong beom yoo",
    "profileImage": dummyAvatars[3],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Huikyeong An": {
    "userID": "Huikyeong An",
    "userName": "Huikyeong An",
    "profileImage": dummyAvatars[9],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Hyeon Pyo": {
    "userID": "Hyeon Pyo",
    "userName": "Hyeon Pyo",
    "profileImage": dummyAvatars[1],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Hyunwoo Kim": {
    "userID": "Hyunwoo Kim",
    "userName": "Hyunwoo Kim",
    "avatarSprite": "user_2",
    "profileImage": dummyAvatars[4],
    "todayStudyTime": null,
    "status": null,
    "curGroup": "kixlab",
    "socketID": null,
    "checklist": null
  },
  "Inhwa Song": {
    "userID": "Inhwa Song",
    "userName": "Inhwa Song",
    "profileImage": dummyAvatars[1],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Jeongeon Park": {
    "userID": "Jeongeon Park",
    "userName": "Jeongeon Park",
    "avatarSprite": "user_3",
    "profileImage": dummyAvatars[5],
    "todayStudyTime": null,
    "status": null,
    "curGroup": "kixlab",
    "socketID": null,
    "checklist": null
  },
  "Jeonghoon Han": {
    "userID": "Jeonghoon Han",
    "userName": "Jeonghoon Han",
    "profileImage": dummyAvatars[6],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "JeongYoon Shin": {
    "userID": "JeongYoon Shin",
    "userName": "JeongYoon Shin",
    "profileImage": dummyAvatars[6],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Jinhyen Kim": {
    "userID": "Jinhyen Kim",
    "userName": "Jinhyen Kim",
    "profileImage": dummyAvatars[7],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Jiseung Ryu": {
    "userID": "Jiseung Ryu",
    "userName": "Jiseung Ryu",
    "profileImage": dummyAvatars[9],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Juho Kim": {
    "userID": "Juho Kim",
    "userName": "Juho Kim",
    "avatarSprite": "user_4",
    "profileImage": dummyAvatars[2],
    "todayStudyTime": null,
    "status": null,
    "curGroup": "kixlab",
    "socketID": null,
    "checklist": null
  },
  "Junyeong Park": {
    "userID": "Junyeong Park",
    "userName": "Junyeong Park",
    "profileImage": dummyAvatars[1],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Kim Taewoo": {
    "userID": "Kim Taewoo",
    "userName": "Kim Taewoo",
    "profileImage": dummyAvatars[2],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Kwanghyun Jung": {
    "userID": "Kwanghyun Jung",
    "userName": "Kwanghyun Jung",
    "profileImage": dummyAvatars[5],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Lee jeonga": {
    "userID": "Lee jeonga",
    "userName": "Lee jeonga",
    "profileImage": dummyAvatars[0],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Minh Hoang Dang": {
    "userID": "Minh Hoang Dang",
    "userName": "Minh Hoang Dang",
    "profileImage": dummyAvatars[9],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Ngoc Doan": {
    "userID": "Ngoc Doan",
    "userName": "Ngoc Doan",
    "profileImage": dummyAvatars[6],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Nicole Lee": {
    "userID": "Nicole Lee",
    "userName": "Nicole Lee",
    "profileImage": dummyAvatars[3],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Nurlykhan Kopenov": {
    "userID": "Nurlykhan Kopenov",
    "userName": "Nurlykhan Kopenov",
    "profileImage": dummyAvatars[2],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "SeongHye Cho": {
    "userID": "SeongHye Cho",
    "userName": "SeongHye Cho",
    "profileImage": dummyAvatars[6],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Seungho Baek": {
    "userID": "Seungho Baek",
    "userName": "Seungho Baek",
    "profileImage": dummyAvatars[5],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Shinung Ahn": {
    "userID": "Shinung Ahn",
    "userName": "Shinung Ahn",
    "profileImage": dummyAvatars[2],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Subin Kim": {
    "userID": "Subin Kim",
    "userName": "Subin Kim",
    "profileImage": dummyAvatars[7],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Suchan Kim": {
    "userID": "Suchan Kim",
    "userName": "Suchan Kim",
    "profileImage": dummyAvatars[1],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Tung Duong Mai": {
    "userID": "Tung Duong Mai",
    "userName": "Tung Duong Mai",
    "profileImage": dummyAvatars[0],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Yeon Su Park": {
    "userID": "Yeon Su Park",
    "userName": "Yeon Su Park",
    "profileImage": dummyAvatars[8],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Yohan Yun": {
    "userID": "Yohan Yun",
    "userName": "Yohan Yun",
    "profileImage": dummyAvatars[7],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Yoonjeong Park": {
    "userID": "Yoonjeong Park",
    "userName": "Yoonjeong Park",
    "profileImage": dummyAvatars[4],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Yoonjoo Lee": {
    "userID": "Yoonjoo Lee",
    "userName": "Yoonjoo Lee",
    "avatarSprite": "user_1",
    "profileImage": dummyAvatars[7],
    "todayStudyTime": null,
    "status": null,
    "curGroup": "kixlab",
    "socketID": null,
    "checklist": null
  },
  "Yumi Lee": {
    "userID": "Yumi Lee",
    "userName": "Yumi Lee",
    "profileImage": dummyAvatars[2],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Zhaoyan Wang": {
    "userID": "Zhaoyan Wang",
    "userName": "Zhaoyan Wang",
    "profileImage": dummyAvatars[1],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "Zihan Lin": {
    "userID": "Zihan Lin",
    "userName": "Zihan Lin",
    "profileImage": dummyAvatars[0],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "김 경연": {
    "userID": "김 경연",
    "userName": "김 경연",
    "profileImage": dummyAvatars[0],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  },
  "guest": {
    "userID": "guest",
    "userName": "guest",
    "profileImage": dummyAvatars[0],
    "todayStudyTime": null,
    "status": null,
    "curGroup": null,
    "socketID": null,
    "checklist": null
  }  
};

let groupList = {
  "kixlab": {
    groupID: "kixlab",
    groupName: "KIXLAB",
    leader: "Juho Kim",
    member: ["Juho Kim", "Yoonjoo Lee", "Haesoo Kim", "Hyunwoo Kim", "Jeongeon Park",],
    colors: ['#F79489', '#F9F1F0'],
    quests: {
      "eq2dm5" : {
          questID : "eq2dm5",
          type : "Attendance",
          content : "11/18",
          contentDate : new Date(2021, 11, 18, 0, 0),
          acceptedUsers : ["Juho Kim", "Yoonjoo Lee", "Haesoo Kim", "Hyunwoo Kim", "Jeongeon Park",], // TODO: acceptedUsers, doneUsers, notYetUsers 중 하나는 없어도 됨.
          doneUsers : ["Juho Kim", "Yoonjoo Lee", "Haesoo Kim", "Hyunwoo Kim", "Jeongeon Park",],
          participatingUsers : [],
          notYetUsers : []
      },
      "jkqb7p" : {
        questID : "jkqb7p",
        type : "Goal",
        content : "3 hours",
        contentDate : 3 * 3600 * 1000,
        acceptedUsers : ["Juho Kim", "Yoonjoo Lee", "Jeongeon Park"],
        doneUsers : ["Juho Kim"],
        participatingUsers : [],
        notYetUsers : ["Yoonjoo Lee", "Jeongeon Park"]
      },
    }      
  },
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
  // "b": {
  //   groupID: "b",
  //   groupName: "We love slifour",
  //   leader: "hyeon",
  //   member: ["eunki", "hyeon", "jeonghoon"],
  //   colors: ['#003B73', '#BFD7ED'],
  //   quests: {}
  // },
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
