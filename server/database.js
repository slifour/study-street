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
    member: ["eunki", "haeseul"],
    colors: ['#F79489', '#F9F1F0']
  },
  "b": {
    groupID: "b",
    groupName: "We love slifour",
    member: ["hyeon", "jeonghoon"],
    colors: ['#003B73', '#BFD7ED']
  },
};

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


module.exports = {userList, groupList, goalList, bookList};