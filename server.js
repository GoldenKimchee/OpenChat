const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages.js');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const openChat = 'OpenChat';

// Set static folder to map to '/' path
app.use('/', express.static(path.join(__dirname, 'public')));

// Run when client connects
// Listen for 'connection' event
io.on('connection', socket => {

  socket.on('joinRoom', ({ username, group }) => {

    const user = userJoin(socket.id, username, group);  
    
    // Socket is now in a channel/group of 'user.room'
    socket.join(user.group);

    socket.emit('chatMessage', formatMessage(openChat, 'Welcome to OpenChat'));
    console.log(user.group);
    // Broadcast when a user connects (except client)
    socket.broadcast
    .to(user.group)
    .emit('chatMessage', 
    formatMessage(openChat, `${user.username} has joined the chat!`)
    );

    // Send users and group info
    io.to(user.group).emit('groupUsers', {
      group: user.group,
      users: getRoomUsers(user.group)
    });

  });

  // Listen for chat message
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.group).emit('chatMessage', formatMessage(user.username, msg));
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    // If user was deleted from our users list
    if (user) {
      io.to(user.group).emit(
        'message', 
        formatMessage(openChat, `${user.username} has left the chat.`)
      );

      console.log(user.group);
      // Send users and group info
      io.to(user.group).emit('groupUsers', {
        group: user.group,
        users: getRoomUsers(user.group)
      });

    }
    console.log(user.group);
    socket.broadcast.to(user.group).emit('chatMessage', formatMessage(openChat, `${user.username} has left the chat.`));
    
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));