const socket = io();
const chatMessage = document.querySelector(".chat-messages");
const chatForm = document.getElementById("chat-form");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("joinRoom", { username, room });

socket.on("roomInfo", ({ room, users }) => {
  outputRoom(room);
  outputRoomUsers(users);
});

socket.on("message", (message) => {
  outputMessage(message);

  chatMessage.scrollTop = chatMessage.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //Get Message
  const message = e.target.msg.value;

  //Send message to Server
  socket.emit("chatMessage", message);

  // Clear Input
  e.target.msg.value = "";
  e.target.msg.focus();
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

/// Output Room Name
function outputRoom(room) {
  roomName.innerText = room;
}

// Output All users

function outputRoomUsers(users) {
  userList.innerHTML = `
    ${users.map((user) => `<li> ${user.username} </li>`).join("")}
   `;
}
