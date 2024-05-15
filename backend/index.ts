import express from "express";
import http from "http";
import path from "path";
import { Server, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use("/assets", express.static("../frontend/assets"));
app.use("/scripts", express.static("../frontend/scripts"));
app.use("/styles", express.static("../frontend/styles"));

app.get("/", (req, res) => {
  const pathToFrontend = path.resolve(__dirname + "/../../frontend/index.html");
  res.sendFile(pathToFrontend);
});

const connectedUsers: { [socketId: string]: string } = {};

interface INewMessage {
    message: string
    username: string
    date: string
}

io.on("connection", (socket) => {
  socket.on("chat message", ({ message, username,  date}: INewMessage) => {
    console.log("message: " + message, ". from user: ", username);
    io.emit("newChatMessage", { message, username, date}); // This will emit the event to all connected sockets
  });

  socket.on("connected", ({ username }: { username: string}) => {
    console.log(`user  ${username} connected`);
    connectedUsers[socket.id] = username;
    io.emit("newUserConnected", { username, connectedUsers: Object.values(connectedUsers) });
  });

  socket.once("disconnect", () => {
    const username = connectedUsers[socket.id]
    delete connectedUsers[socket.id]
    io.emit("userDisconnected", { username, connectedUsers: Object.values(connectedUsers) });
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
