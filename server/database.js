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
    "avatarSprite": "user_6",
    "curGroup" : "cs473",
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
    "userName": "**Hyeon**",
    "avatarSprite": "user_5",
    "profileImage": dummyAvatars[2],
    "todayStudyTime": 7200 * 1000,
    "status": "Linear Algebra Chp.7",
    "curGroup" : "cs473",
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
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Assem Zhunis": {
    "userID": "Assem Zhunis",
    "userName": "Assem Zhunis",
    "profileImage": dummyAvatars[9],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Auejin Ham": {
    "userID": "Auejin Ham",
    "userName": "Auejin Ham",
    "profileImage": dummyAvatars[5],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Bauyrzhan Tokenov": {
    "userID": "Bauyrzhan Tokenov",
    "userName": "Bauyrzhan Tokenov",
    "profileImage": dummyAvatars[6],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Bekzat Tilekbay": {
    "userID": "Bekzat Tilekbay",
    "userName": "Bekzat Tilekbay",
    "profileImage": dummyAvatars[0],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Charlie .": {
    "userID": "Charlie .",
    "userName": "Charlie .",
    "profileImage": dummyAvatars[8],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Cheryl Siy": {
    "userID": "Cheryl Siy",
    "userName": "Cheryl Siy",
    "profileImage": dummyAvatars[3],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Chigon Ryu": {
    "userID": "Chigon Ryu",
    "userName": "Chigon Ryu",
    "profileImage": dummyAvatars[3],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Chloe McCracken": {
    "userID": "Chloe McCracken",
    "userName": "Chloe McCracken",
    "profileImage": dummyAvatars[4],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Chulhwan Kim": {
    "userID": "Chulhwan Kim",
    "userName": "Chulhwan Kim",
    "profileImage": dummyAvatars[7],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Dain Kim": {
    "userID": "Dain Kim",
    "userName": "Dain Kim",
    "profileImage": dummyAvatars[5],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Diyar Tulenov": {
    "userID": "Diyar Tulenov",
    "userName": "Diyar Tulenov",
    "profileImage": dummyAvatars[9],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Eunki Joung": {
    "userID": "Eunki Joung",
    "userName": "Eunki Joung",
    "profileImage": dummyAvatars[6],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "fathony achmad": {
    "userID": "fathony achmad",
    "userName": "fathony achmad",
    "profileImage": dummyAvatars[1],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Haeseul Cha": {
    "userID": "Haeseul Cha",
    "userName": "Haeseul Cha",
    "profileImage": dummyAvatars[9],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Haesoo Kim": {
    "userID": "Haesoo Kim",
    "userName": "Haesoo Kim",
    "avatarSprite": "user_1",
    "profileImage": dummyAvatars[6],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "kixlab",
    "socketID": null,
    "checklist": null
  },
  "hong beom yoo": {
    "userID": "hong beom yoo",
    "userName": "hong beom yoo",
    "profileImage": dummyAvatars[3],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Huikyeong An": {
    "userID": "Huikyeong An",
    "userName": "Huikyeong An",
    "profileImage": dummyAvatars[9],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Hyeon Pyo": {
    "userID": "Hyeon Pyo",
    "userName": "Hyeon Pyo",
    "profileImage": dummyAvatars[1],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Hyunwoo Kim": {
    "userID": "Hyunwoo Kim",
    "userName": "Hyunwoo Kim",
    "avatarSprite": "user_2",
    "profileImage": dummyAvatars[4],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "kixlab",
    "socketID": null,
    "checklist": null
  },
  "Inhwa Song": {
    "userID": "Inhwa Song",
    "userName": "Inhwa Song",
    "profileImage": dummyAvatars[1],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Jeongeon Park": {
    "userID": "Jeongeon Park",
    "userName": "Jeongeon Park",
    "avatarSprite": "user_3",
    "profileImage": dummyAvatars[5],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "kixlab",
    "socketID": null,
    "checklist": null
  },
  "Jeonghoon Han": {
    "userID": "Jeonghoon Han",
    "userName": "Jeonghoon Han",
    "profileImage": dummyAvatars[6],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "JeongYoon Shin": {
    "userID": "JeongYoon Shin",
    "userName": "JeongYoon Shin",
    "profileImage": dummyAvatars[6],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Jinhyen Kim": {
    "userID": "Jinhyen Kim",
    "userName": "Jinhyen Kim",
    "profileImage": dummyAvatars[7],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Jiseung Ryu": {
    "userID": "Jiseung Ryu",
    "userName": "Jiseung Ryu",
    "profileImage": dummyAvatars[9],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Juho Kim": {
    "userID": "Juho Kim",
    "userName": "Juho Kim",
    "avatarSprite": "user_4",
    "profileImage": dummyAvatars[2],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "kixlab",
    "socketID": null,
    "checklist": null
  },
  "Junyeong Park": {
    "userID": "Junyeong Park",
    "userName": "Junyeong Park",
    "profileImage": dummyAvatars[1],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Kim Taewoo": {
    "userID": "Kim Taewoo",
    "userName": "Kim Taewoo",
    "profileImage": dummyAvatars[2],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Kwanghyun Jung": {
    "userID": "Kwanghyun Jung",
    "userName": "Kwanghyun Jung",
    "profileImage": dummyAvatars[5],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Lee jeonga": {
    "userID": "Lee jeonga",
    "userName": "Lee jeonga",
    "profileImage": dummyAvatars[0],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Minh Hoang Dang": {
    "userID": "Minh Hoang Dang",
    "userName": "Minh Hoang Dang",
    "profileImage": dummyAvatars[9],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Ngoc Doan": {
    "userID": "Ngoc Doan",
    "userName": "Ngoc Doan",
    "profileImage": dummyAvatars[6],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Nicole Lee": {
    "userID": "Nicole Lee",
    "userName": "Nicole Lee",
    "profileImage": dummyAvatars[3],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Nurlykhan Kopenov": {
    "userID": "Nurlykhan Kopenov",
    "userName": "Nurlykhan Kopenov",
    "profileImage": dummyAvatars[2],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "SeongHye Cho": {
    "userID": "SeongHye Cho",
    "userName": "SeongHye Cho",
    "profileImage": dummyAvatars[6],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Seungho Baek": {
    "userID": "Seungho Baek",
    "userName": "Seungho Baek",
    "profileImage": dummyAvatars[5],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Shinung Ahn": {
    "userID": "Shinung Ahn",
    "userName": "Shinung Ahn",
    "profileImage": dummyAvatars[2],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Subin Kim": {
    "userID": "Subin Kim",
    "userName": "Subin Kim",
    "profileImage": dummyAvatars[7],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Suchan Kim": {
    "userID": "Suchan Kim",
    "userName": "Suchan Kim",
    "profileImage": dummyAvatars[1],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Tung Duong Mai": {
    "userID": "Tung Duong Mai",
    "userName": "Tung Duong Mai",
    "profileImage": dummyAvatars[0],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Yeon Su Park": {
    "userID": "Yeon Su Park",
    "userName": "Yeon Su Park",
    "profileImage": dummyAvatars[8],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Yohan Yun": {
    "userID": "Yohan Yun",
    "userName": "Yohan Yun",
    "profileImage": dummyAvatars[7],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Yoonjeong Park": {
    "userID": "Yoonjeong Park",
    "userName": "Yoonjeong Park",
    "profileImage": dummyAvatars[4],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Yoonjoo Lee": {
    "userID": "Yoonjoo Lee",
    "userName": "Yoonjoo Lee",
    "avatarSprite": "user_1",
    "profileImage": dummyAvatars[7],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "kixlab",
    "socketID": null,
    "checklist": null
  },
  "Yumi Lee": {
    "userID": "Yumi Lee",
    "userName": "Yumi Lee",
    "profileImage": dummyAvatars[2],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Zhaoyan Wang": {
    "userID": "Zhaoyan Wang",
    "userName": "Zhaoyan Wang",
    "profileImage": dummyAvatars[1],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Zihan Lin": {
    "userID": "Zihan Lin",
    "userName": "Zihan Lin",
    "profileImage": dummyAvatars[0],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "김경연": {
    "userID": "김경연",
    "userName": "김경연",
    "profileImage": dummyAvatars[0],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "guest": {
    "userID": "guest",
    "userName": "guest",
    "profileImage": dummyAvatars[0],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Guest1": {
    "userID": "Guest1",
    "userName": "Guest1",
    "profileImage": dummyAvatars[0],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Guest2": {
    "userID": "Guest2",
    "userName": "Guest2",
    "profileImage": dummyAvatars[0],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Guest3": {
    "userID": "Guest3",
    "userName": "Guest3",
    "profileImage": dummyAvatars[0],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Guest4": {
    "userID": "Guest4",
    "userName": "Guest4",
    "profileImage": dummyAvatars[0],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  "Guest5": {
    "userID": "Guest5",
    "userName": "Guest5",
    "profileImage": dummyAvatars[0],
    "todayStudyTime": null,
    "status": "Click avatar to write status",
    "curGroup": "cs473",
    "socketID": null,
    "checklist": null
  },
  // "Guest6": {
  //   "userID": "Guest6",
  //   "userName": "Guest6",
  //   "profileImage": dummyAvatars[0],
  //   "todayStudyTime": null,
  //   "status": "Click avatar to write status",
  //   "curGroup": "cs473",
  //   "socketID": null,
  //   "checklist": null
  // },
  // "Guest7": {
  //   "userID": "Guest7",
  //   "userName": "Guest7",
  //   "profileImage": dummyAvatars[0],
  //   "todayStudyTime": null,
  //   "status": "Click avatar to write status",
  //   "curGroup": "cs473",
  //   "socketID": null,
  //   "checklist": null
  // },
  // "Guest8": {
  //   "userID": "Guest8",
  //   "userName": "Guest8",
  //   "profileImage": dummyAvatars[0],
  //   "todayStudyTime": null,
  //   "status": "Click avatar to write status",
  //   "curGroup": "cs473",
  //   "socketID": null,
  //   "checklist": null
  // },
  // "Guest9": {
  //   "userID": "Guest9",
  //   "userName": "Guest9",
  //   "profileImage": dummyAvatars[0],
  //   "todayStudyTime": null,
  //   "status": "Click avatar to write status",
  //   "curGroup": "cs473",
  //   "socketID": null,
  //   "checklist": null
  // },
  // "Guest10": {
  //   "userID": "Guest10",
  //   "userName": "Guest10",
  //   "profileImage": dummyAvatars[0],
  //   "todayStudyTime": null,
  //   "status": "Click avatar to write status",
  //   "curGroup": "cs473",
  //   "socketID": null,
  //   "checklist": null
  // },
  // "sehoon": {
  //   "userID": "sehoon",
  //   "userName": "sehoon",
  //   "profileImage": dummyAvatars[0],
  //   "todayStudyTime": null,
  //   "status": "Click avatar to write status",
  //   "curGroup": "cs473",
  //   "socketID": null,
  //   "checklist": null
  // },
  // "woojung": {
  //   "userID": "woojung",
  //   "userName": "woojung",
  //   "profileImage": dummyAvatars[0],
  //   "todayStudyTime": null,
  //   "status": "Click avatar to write status",
  //   "curGroup": "cs473",
  //   "socketID": null,
  //   "checklist": null
  // },
  // "손손히": {
  //   "userID": "손손히",
  //   "userName": "손손히",
  //   "profileImage": dummyAvatars[0],
  //   "todayStudyTime": null,
  //   "status": "Click avatar to write status",
  //   "curGroup": "cs473",
  //   "socketID": null,
  //   "checklist": null
  // },
  // "als121401": {
  //   "userID": "als121401",
  //   "userName": "als121401",
  //   "profileImage": dummyAvatars[0],
  //   "todayStudyTime": null,
  //   "status": "Click avatar to write status",
  //   "curGroup": "cs473",
  //   "socketID": null,
  //   "checklist": null
  // },
  // "musemary": {
  //   "userID": "musemary",
  //   "userName": "musemary",
  //   "profileImage": dummyAvatars[0],
  //   "todayStudyTime": null,
  //   "status": "Click avatar to write status",
  //   "curGroup": "cs473",
  //   "socketID": null,
  //   "checklist": null
  // },
  // "jung2min0524": {
  //   "userID": "jung2min0524",
  //   "userName": "jung2min0524",
  //   "profileImage": dummyAvatars[0],
  //   "todayStudyTime": null,
  //   "status": "Click avatar to write status",
  //   "curGroup": "cs473",
  //   "socketID": null,
  //   "checklist": null
  // },
};

let groupList = {
  "kixlab": {
    groupID: "kixlab",
    groupName: "KIXLAB",
    leader: "Juho Kim",
    member: ["Juho Kim", "Yoonjoo Lee", "Haesoo Kim", "Hyunwoo Kim", "Jeongeon Park",],
    colors: ['#F79256', '#fbd1a2'],
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
    colors: ['#8d1c1a', '#F9F1F0'],
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
    groupName: "Team slifour",
    leader: "hyeon",
    member: ["eunki", "hyeon", "jeonghoon"],
    colors: ['#A0E7E5', '#B4F8C8'],
    quests: {}
  },
  "cs473": {
    groupID: "cs473",
    groupName: "CS473 LET'S NAIL FINAL",
    leader: "eunki",
    member: ["eunki", "hyeon", "Alua Orazbek","Assem Zhunis","Auejin Ham","Bauyrzhan Tokenov","Bekzat Tilekbay","Charlie .","Cheryl Siy","Chigon Ryu","Chloe McCracken","Chulhwan Kim","Dain Kim","Diyar Tulenov","Eunki Joung","fathony achmad","Haeseul Cha","Haesoo Kim","hong beom yoo","Huikyeong An","Hyeon Pyo","Hyunwoo Kim","Inhwa Song","Jeongeon Park","Jeonghoon Han","JeongYoon Shin","Jinhyen Kim","Jiseung Ryu","Juho Kim","Junyeong Park","Kim Taewoo","Kwanghyun Jung","Lee jeonga","Minh Hoang Dang","Ngoc Doan","Nicole Lee","Nurlykhan Kopenov","SeongHye Cho","Seungho Baek","Shinung Ahn","Subin Kim","Suchan Kim","Tung Duong Mai","Yeon Su Park","Yohan Yun","Yoonjeong Park","Yoonjoo Lee","Yumi Lee","Zhaoyan Wang","Zihan Lin","김경연","guest",
    "Guest1","Guest2","Guest3","Guest4","Guest5", ],
    colors: ['#e5989b', '#ffcdb2'],
    quests: {
    }
  },

};

/* 살짝 창의적으로 키를 띄어쓰기로 구분한 두 아이디로 써봤어요. "{Group ID} {User ID}" 형식입니다.
   왜 키를 이렇게 했냐면, 각 invitation이 [Group ID, User ID]로 unique하게 구분되기 때문이에요.
   i.e. [Group ID, User ID]가 invitation 테이블의 primary key입니다.
*/
let invitationList = {
  "a eunki": {
    groupID: "a",
    friendID: "eunki",
    hostUser: "eunki",
    inviteTime: new Date('07 Nov 2021 14:30:00 GMT+9')
  },
  "b haeseul": {
    groupID: "b",
    friendID: "haeseul",
    hostUser: "jeonghoon",
    inviteTime: new Date('07 Nov 2021 13:15:00 GMT+9')
  },
  // "cs473 Alua Orazbek": {
  //   "groupID": "cs473",
  //   "friendID": "Alua Orazbek",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Assem Zhunis": {
  //   "groupID": "cs473",
  //   "friendID": "Assem Zhunis",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Auejin Ham": {
  //   "groupID": "cs473",
  //   "friendID": "Auejin Ham",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Bauyrzhan Tokenov": {
  //   "groupID": "cs473",
  //   "friendID": "Bauyrzhan Tokenov",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Bekzat Tilekbay": {
  //   "groupID": "cs473",
  //   "friendID": "Bekzat Tilekbay",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Charlie .": {
  //   "groupID": "cs473",
  //   "friendID": "Charlie .",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Cheryl Siy": {
  //   "groupID": "cs473",
  //   "friendID": "Cheryl Siy",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Chigon Ryu": {
  //   "groupID": "cs473",
  //   "friendID": "Chigon Ryu",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Chloe McCracken": {
  //   "groupID": "cs473",
  //   "friendID": "Chloe McCracken",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Chulhwan Kim": {
  //   "groupID": "cs473",
  //   "friendID": "Chulhwan Kim",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Dain Kim": {
  //   "groupID": "cs473",
  //   "friendID": "Dain Kim",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Diyar Tulenov": {
  //   "groupID": "cs473",
  //   "friendID": "Diyar Tulenov",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Eunki Joung": {
  //   "groupID": "cs473",
  //   "friendID": "Eunki Joung",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 fathony achmad": {
  //   "groupID": "cs473",
  //   "friendID": "fathony achmad",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Haeseul Cha": {
  //   "groupID": "cs473",
  //   "friendID": "Haeseul Cha",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Haesoo Kim": {
  //   "groupID": "cs473",
  //   "friendID": "Haesoo Kim",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 hong beom yoo": {
  //   "groupID": "cs473",
  //   "friendID": "hong beom yoo",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Huikyeong An": {
  //   "groupID": "cs473",
  //   "friendID": "Huikyeong An",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Hyeon Pyo": {
  //   "groupID": "cs473",
  //   "friendID": "Hyeon Pyo",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Hyunwoo Kim": {
  //   "groupID": "cs473",
  //   "friendID": "Hyunwoo Kim",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Inhwa Song": {
  //   "groupID": "cs473",
  //   "friendID": "Inhwa Song",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Jeongeon Park": {
  //   "groupID": "cs473",
  //   "friendID": "Jeongeon Park",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Jeonghoon Han": {
  //   "groupID": "cs473",
  //   "friendID": "Jeonghoon Han",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 JeongYoon Shin": {
  //   "groupID": "cs473",
  //   "friendID": "JeongYoon Shin",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Jinhyen Kim": {
  //   "groupID": "cs473",
  //   "friendID": "Jinhyen Kim",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Jiseung Ryu": {
  //   "groupID": "cs473",
  //   "friendID": "Jiseung Ryu",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Juho Kim": {
  //   "groupID": "cs473",
  //   "friendID": "Juho Kim",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Junyeong Park": {
  //   "groupID": "cs473",
  //   "friendID": "Junyeong Park",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Kim Taewoo": {
  //   "groupID": "cs473",
  //   "friendID": "Kim Taewoo",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Kwanghyun Jung": {
  //   "groupID": "cs473",
  //   "friendID": "Kwanghyun Jung",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Lee jeonga": {
  //   "groupID": "cs473",
  //   "friendID": "Lee jeonga",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Minh Hoang Dang": {
  //   "groupID": "cs473",
  //   "friendID": "Minh Hoang Dang",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Ngoc Doan": {
  //   "groupID": "cs473",
  //   "friendID": "Ngoc Doan",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Nicole Lee": {
  //   "groupID": "cs473",
  //   "friendID": "Nicole Lee",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Nurlykhan Kopenov": {
  //   "groupID": "cs473",
  //   "friendID": "Nurlykhan Kopenov",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 SeongHye Cho": {
  //   "groupID": "cs473",
  //   "friendID": "SeongHye Cho",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Seungho Baek": {
  //   "groupID": "cs473",
  //   "friendID": "Seungho Baek",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Shinung Ahn": {
  //   "groupID": "cs473",
  //   "friendID": "Shinung Ahn",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Subin Kim": {
  //   "groupID": "cs473",
  //   "friendID": "Subin Kim",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Suchan Kim": {
  //   "groupID": "cs473",
  //   "friendID": "Suchan Kim",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Tung Duong Mai": {
  //   "groupID": "cs473",
  //   "friendID": "Tung Duong Mai",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Yeon Su Park": {
  //   "groupID": "cs473",
  //   "friendID": "Yeon Su Park",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Yohan Yun": {
  //   "groupID": "cs473",
  //   "friendID": "Yohan Yun",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Yoonjeong Park": {
  //   "groupID": "cs473",
  //   "friendID": "Yoonjeong Park",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Yoonjoo Lee": {
  //   "groupID": "cs473",
  //   "friendID": "Yoonjoo Lee",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Yumi Lee": {
  //   "groupID": "cs473",
  //   "friendID": "Yumi Lee",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Zhaoyan Wang": {
  //   "groupID": "cs473",
  //   "friendID": "Zhaoyan Wang",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Zihan Lin": {
  //   "groupID": "cs473",
  //   "friendID": "Zihan Lin",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 김경연": {
  //   "groupID": "cs473",
  //   "friendID": "김경연",
  //   "hostUser": "eunki",
  //   "inviteTime": "new Date('07 Nov 2021 13:15:00 GMT+9')"
  // },
  // "cs473 Guest1": {
  //   groupID: "cs473",
  //   friendID: "Guest1",
  //   hostUser: "eunki",
  //   inviteTime: new Date('07 Nov 2021 13:15:00 GMT+9')
  // },
  // "cs473 Guest2": {
  //   groupID: "cs473",
  //   friendID: "Guest2",
  //   hostUser: "eunki",
  //   inviteTime: new Date('07 Nov 2021 13:15:00 GMT+9')
  // },
  // "cs473 Guest3": {
  //   groupID: "cs473",
  //   friendID: "Guest3",
  //   hostUser: "eunki",
  //   inviteTime: new Date('07 Nov 2021 13:15:00 GMT+9')
  // },
  // "cs473 Guest4": {
  //   groupID: "cs473",
  //   friendID: "Guest4",
  //   hostUser: "eunki",
  //   inviteTime: new Date('07 Nov 2021 13:15:00 GMT+9')
  // },
  // "cs473 Guest5": {
  //   groupID: "cs473",
  //   friendID: "Guest5",
  //   hostUser: "eunki",
  //   inviteTime: new Date('07 Nov 2021 13:15:00 GMT+9')
  // },
  // "cs473 Guest6": {
  //   groupID: "cs473",
  //   friendID: "Guest6",
  //   hostUser: "eunki",
  //   inviteTime: new Date('07 Nov 2021 13:15:00 GMT+9')
  // },
  // "cs473 Guest7": {
  //   groupID: "cs473",
  //   friendID: "Guest7",
  //   hostUser: "eunki",
  //   inviteTime: new Date('07 Nov 2021 13:15:00 GMT+9')
  // },
  // "cs473 Guest8": {
  //   groupID: "cs473",
  //   friendID: "Guest8",
  //   hostUser: "eunki",
  //   inviteTime: new Date('07 Nov 2021 13:15:00 GMT+9')
  // },
  // "cs473 Guest9": {
  //   groupID: "cs473",
  //   friendID: "Guest9",
  //   hostUser: "eunki",
  //   inviteTime: new Date('07 Nov 2021 13:15:00 GMT+9')
  // },
  // "cs473 Guest10": {
  //   groupID: "cs473",
  //   friendID: "Guest10",
  //   hostUser: "eunki",
  //   inviteTime: new Date('07 Nov 2021 13:15:00 GMT+9')
  // },
  // "cs473 sehoon": {
  //   groupID: "cs473",
  //   friendID: "sehoon",
  //   hostUser: "eunki",
  //   inviteTime: new Date('07 Nov 2021 13:15:00 GMT+9')
  // },
  // "cs473 woojung": {
  //   groupID: "cs473",
  //   friendID: "woojung",
  //   hostUser: "eunki",
  //   inviteTime: new Date('07 Nov 2021 13:15:00 GMT+9')
  // },
  // "cs473 손손히": {
  //   groupID: "cs473",
  //   friendID: "손손히",
  //   hostUser: "eunki",
  //   inviteTime: new Date('07 Nov 2021 13:15:00 GMT+9')
  // },
  // "cs473 als121401": {
  //   groupID: "cs473",
  //   friendID: "als121401",
  //   hostUser: "eunki",
  //   inviteTime: new Date('07 Nov 2021 13:15:00 GMT+9')
  // },
  // "cs473 musemary": {
  //   groupID: "cs473",
  //   friendID: "musemary",
  //   hostUser: "eunki",
  //   inviteTime: new Date('07 Nov 2021 13:15:00 GMT+9')
  // },
  // "cs473 jung2min0524": {
  //   groupID: "cs473",
  //   friendID: "jung2min0524",
  //   hostUser: "eunki",
  //   inviteTime: new Date('07 Nov 2021 13:15:00 GMT+9')
  // },
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
