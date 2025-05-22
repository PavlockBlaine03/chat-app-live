const express = require("express");
const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors");
const { Socket } = require("dgram");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const users = {};

function getRandomUsername() {
  const names = ["Alice", "Bob", "Charlie", "Daisy", "Eli", "Zoe", "Nova", "John", "Jill", "Bill"];
  return names[Math.floor(Math.random() * names.length)];
}

function getRandomColor() {
  const colors = ["#e91e63", "#3f51b5", "#009688", "#ff9800", "#9c27b0"];
  return colors[Math.floor(Math.random() * colors.length)];
}

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    users[socket.id] = {
        name: getRandomUsername(),
        color: getRandomColor(),
    };

    socket.on("chat message", (msg) => {
        const user = users[socket.id];
        io.emit("chat message", {
            text: msg,
            sender: user.name,
            color: user.color,
            from: socket.id,
        });
    });

    socket.on("disconnect", () => {
        console.log(users[socket.id].name + " disconnected.");
        delete users[socket.id];
    });
});

server.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
})