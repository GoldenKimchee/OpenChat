const users = [];

// Join user to chat
function userJoin(id, username, group) {
  const user = {id, username, group};

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id == id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  // User found
  if (index !== -1) {
    // splice(index, deleteCount, insertItem1) returns array of deleted items
    // Delete the user with matching id, return users array
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(group) {
  return users.filter(user => user.group === group);
}

module.exports = {
  userJoin, 
  getCurrentUser,
  userLeave,
  getRoomUsers,
};