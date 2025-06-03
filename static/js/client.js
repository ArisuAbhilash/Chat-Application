const socket = io();  // Connect to Flask-SocketIO server

// DOM elements
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.getElementById('message-container');

// Optional audio for incoming messages
const audio = new Audio('/static/audio/beep.mp3'); // Ensure this path is correct or update as needed

// Append a message to the chat container
function append(message, position) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    messageContainer.appendChild(messageElement);
    if (position === 'left') audio.play();
}

// Ask for the user's name
let name = '';
while (!name.trim()) {
    name = prompt("Enter your name to join:");
}
socket.emit('new-user-joined', name);

// Listen for events from server
socket.on('user-joined', userName => {
    append(`${userName} joined the chat`, 'right');
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', userName => {
    append(`${userName} left the chat`, 'right');
});

// Handle message submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message !== "") {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    } else {
        alert("Please enter a message");
    }
});
