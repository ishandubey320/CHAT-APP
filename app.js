const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const formatMessage = require("./utils/message");
const {
  userJoin,
  getCurrentUser,
  userLeaves,
  getRoomUsers,
} = require("./utils/user");

const botName = "Chat God!";

///use satic folder
app.use(express.static(path.join(__dirname, "public")));

//Run when new connection is made
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //Welcome current user;
    socket.emit("message", formatMessage(botName, "Welcome on Chat App"));

    //Brodcast message
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has entered the Chat!`)
      );

    ///user and room info
    io.to(user.room).emit("roomInfo", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //Listen for chatMessage
  socket.on("chatMessage", (message) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit(
      "message",
      formatMessage(`${user.username}`, message)
    );
  });

  //On Disconnected
  socket.on("disconnect", () => {
    const user = userLeaves(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the Chat!`)
      );

      ///user and room info
      io.to(user.room).emit("roomInfo", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const port = 3000 || process.env.port;

server.listen(port, () => {
  console.log(`server connected to http://localhost:${port}`);
});
