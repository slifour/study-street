// reads in our .env file and makes those values available as environment variables
// require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// const passport = require('passport');

// const routes = require('./routes/main');
// const secureRoutes = require('./routes/secure');
// const passwordRoutes = require('./routes/password');

// setup mongo connection
// const uri = process.env.MONGO_CONNECTION_URL;
// mongoose.connect(uri, { useNewUrlParser : true, useCreateIndex: true });
// mongoose.connection.on('error', (error) => {
//   console.log(error);
//   process.exit(1);
// });
// mongoose.connection.on('connected', function () {
//   console.log('connected to mongo');
// });
// mongoose.set('useFindAndModify', false);

// create an instance of an express app
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const users = {};

io.on('connection', socket => {
  console.log('a user connected: ', socket.id);

  // create a new user and add it to our users object
  users[socket.id] = {
    flipX: false,
    x: 0,
    y: 0,
    userId: socket.id,
    scene: 'Boot'
  };
  
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

// have the server start listening on the provided port
http.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
