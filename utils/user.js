let users = [];

//User Join
function userJoin(id, username, room) {
  const user = { username, room, id };
  users.push(user);

  return user;
}

//Current User
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

//User leaves
function userLeaves(id) {
  const user = users.find((user) => user.id === id);

  users = users.filter((user) => user.id !== id);

  return user;
}

//Get RoomUsers
function getRoomUsers(room) {
  console.log(users.filter((user) => user.room === room));
  return users.filter((user) => user.room === room);
}

module.exports = { userJoin, getCurrentUser, userLeaves, getRoomUsers };
