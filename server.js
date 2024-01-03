//#region Servers
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const socketServer = require("socket.io");
const app = express();
//#endregion

//#region Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + "/public"));
const PORT = process.env.PORT || 10000;
//#endregion

//#region Run Server
const expressServer = app.listen(PORT, () => {
  console.log(`Server Is Listening On https://live-chat-ju5a.onrender.com`);
});
const io = socketServer(expressServer, {
  cors: {
    origin: 'https://live-chat-ju5a.onrender.com',
  },
});
//#endregion

io.on("connection", (visitor) => {
  console.log(`New Visitor Conection ID => ${visitor.id}`);
  // give user its own id
  visitor.emit("yourSocketId", visitor.id);
  // on new msg
  visitor.on("msg", (data) => {
    io.sockets.emit("newMsg", {
      visitor: visitor.id,
      msg: data.msg,
      username: data.username,
    });
  });
  // New User Connected
  visitor.on("userConnected", (user) => {
    visitor.broadcast.emit("newUser", user);
  });

  // typing
  visitor.on("typing", () => {
    visitor.broadcast.emit("someoneIsTyping");
  });
  // clear typing status
  visitor.on("stopedTyping", () => {
    visitor.broadcast.emit("clearTypingStatus");
  });
});
