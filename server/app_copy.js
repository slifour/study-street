const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
}); // < Interesting!

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");

  /* 1초에 한번씩 소켓에 데이터를 emit하기 */
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});



const users = {};

io.on('connection', socket => {
  console.log('a user connected: ', socket.id);

  // create a new user and add it to our users object
  users[socket.id] = {
    flipX: false,
    x: 0,
    y: 0,
    userId: socket.id,
    userStatus: 'Status',
    scene: 'Boot'
  };


  socket.emit('Imaadeagroup', 3)

  socket.on('Imakdeagroup', data)
    if (data.group == 1){
      socket.join("1");
      socket.emit('message')
      socket.broadcast.emit('Group1 Artifact')
      socket.leave("1")
    }

  /** 
   * 그룹 함수
   * socket.broadcast.emit('이벤트명', 데이터); 나를 제외한 전체에게 메시지 보내기
   * io.to(소켓아이디).emit('이벤트명' 데이터); 특정 사람에게 메시지 보내기
   * socket.join(방의 아이디); // 그룹에 들어가기
   * socket.leave(방의 아이디); // 그룹 떠나기
   * io.to(방의 아이디).emit('이벤트명', 데이터); // 그룹 전체
   * socket.broadcast.to(방의 아이디).emit('이벤트명', 데이터); // 나를 제외한 그룹 전체
   * 
   * 그룹 목록과 그룹 안 소켓 확인
   * io.adapter.rooms
   * io.of(네임스페이스).adapter.rooms
   * socket.adapter.rooms
   * 
   * 위의 방법대로 참여 인원 수나 방의 수를 구하는 것이 불안정하기 때문에
   * 서버 상에서 배열을 만들어 방의 아이디를 모아두는 것이 편할 것 같습니다.
   * 그리고 방 안에는 참여한 사람들의 소켓 아이디를 넣어두고요.
   * [
   *   { _id: 'room01', members: ['zero_id', 'aero_id']}
   *   { _id: 'room02', members: ['nero_id', 'hero_id']},
   * ]
   * 이런 식으로요.
   * 
   * 그룹의 이름을 서버 내 그룹 id로 받는 기능?코드?
   * 그룹 유저 / 그룹 목표 / 그룹 아티펙트
   * 유저들의 그룹 데이터 -> 그룹 등록시 그룹의 유저 목록에 유저 추가
  */


io.adapter.rooms //그룹 목록 확인



  socket.on('shiftScene', function (newScene) {
    console.log('shiftScene', newScene)
    prevScene = users[socket.id].scene
    users[socket.id].scene = newScene

    if (prevScene !== 'Boot'){
      socket.leave(prevScene);       
      socket.to(prevScene).emit('left', socket.id);
    }       
    socket.join(newScene);
    socket.to(newScene).emit('entered', socket.id);

    const currentUsers = Object.values(users).filter(user =>
      user.scene === newScene);
    io.to(socket.id).emit('currentUsers', currentUsers);
  }) 

  socket.on('study', function () {     

    prevScene = users[socket.id].scene
    users[socket.id].scene = 'Study'
    socket.to('Library').emit('studied', socket.id);    

    if (prevScene !== 'Boot'){
      socket.leave(prevScene);       
      socket.to(prevScene).emit('left', socket.id);
    }      
  }) 

  // when a user disconnects, remove them from our users object
  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
    delete users[socket.id];

    // emit a message to all users to remove this user
    io.emit('disconnected', socket.id);
  });

  // when a user moves, update the user data
  socket.on('userMovement', function (movementData) {
    users[socket.id].x = movementData.x;
    users[socket.id].y = movementData.y;
    users[socket.id].flipX = movementData.flipX;

    // emit a message to all users about the user that moved
    socket.broadcast.to(socket.scene).emit('userMoved', users[socket.id]);
  });

  // 
  socket.on('userStudy', function () {
    // emit a message to all users about the user that moved
    socket.broadcast.emit('otherStudy', users[socket.id]);
  });

});

// update express settings
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cookieParser());

// require passport auth
// require('./auth/auth');

/*
app.get('/game.html', passport.authenticate('jwt', { session : false }), function (req, res) {
  res.sendFile(__dirname + '/public/game.html');
});
*/

app.get('/game.html', function (req, res) {
  res.sendFile(__dirname + '/public/game.html');
});

app.use(express.static(__dirname + '/public'));

// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/index.html');
// });

// main routes
// app.use('/', routes);
// app.use('/', passwordRoutes);
// app.use('/', passport.authenticate('jwt', { session : false }), secureRoutes);

// catch all other routes
app.use((req, res, next) => {
  res.status(404).json({ message: '404 - Not Found' });
});

// handle errors
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(err.status || 500).json({ error: err.message });
});



server.listen(port, () => console.log(`Listening on port ${port}`));