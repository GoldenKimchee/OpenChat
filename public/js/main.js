const chatForm = document.querySelector('#chat-form');
const messages = document.querySelector('.chat-messages');
const groupName = document.querySelector('#group-name');
const userList = document.querySelector('#users');

// Get username and group from URL
const { username, group } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, group });

// Get group and users
socket.on('groupUsers', ({ group, users }) => {
  outputGroup(group);
  outputUsers(users);
})

socket.on('chatMessage', msg => {
  // Add message element to the DOM
  addMessage(msg);

  // Scroll down
  messages.scrollTop = messages.scrollHeight;
});


// Listen for message to be sent
chatForm.addEventListener('submit', (element) => {
  element.preventDefault();

  // Get message text
  const msg = element.target.msg.value;

  // Send message to server
  socket.emit('chatMessage', msg);

  // Clear message input
  element.target.msg.value = '';
  element.target.msg.focus();  // Puts cursor focused on message input
});
/*
var message = document.getElementById('messagebox');
var istyping = document.getElementById('istyping')
var timeout  = setTimeout(function(){}, 0)


message.addEventListener('keypress', function(){
	  clearTimeout(timeout);
    istyping.innerHTML = 'User is typing'
    timeout = setTimeout(function() { istyping.innerHTML = '' }, 1000)
})
*/


function addMessage(msg) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
  <p class="meta">${msg.username} <span>${msg.time}</span></p>
  <p class="text">
    ${msg.text}
  </p>
  `;
  messages.appendChild(div);
}

// Add group name to DOM
function outputGroup(group) {
  groupName.innerText = group;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}