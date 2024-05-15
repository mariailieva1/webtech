let socket;
myUsername = null;

function connectToSocket() {
    socket = io("http://localhost:3000");
    socket.emit('connected', { username: myUsername })
}

function initializeSocketEvents() {
    if (!socket) throw new Error("No socket connection!")

    socket.on("newChatMessage", ({ message, username, date }) => {
        const messagesContainer = document.querySelector(".messages");
        const template = document.getElementById("message-template");
        const messageElement = template.content.cloneNode(true);

        messageElement.querySelector(".message-content").innerText = message;
        messageElement.querySelector(".username").innerText = username;
        messageElement.querySelector(".time").innerText = new Date(date).toLocaleTimeString();

        const messageClass =
            username == myUsername ? "my-chats" : "other-chats";
        messageElement
            .querySelector(".message")
            .classList.add(messageClass);

        messagesContainer.appendChild(messageElement);
        messagesContainer.lastElementChild.scrollIntoView()
    });

    socket.on("newUserConnected", ({ username, connectedUsers }) => {
        userConnectionTemplate(username, connectedUsers, 'connected')
    })

    socket.on("userDisconnected", ({ username, connectedUsers}) => {
        userConnectionTemplate(username, connectedUsers, 'disconnected')
    })
}

function sendMessage() {
    const input = document.getElementById("message");
    if (!message.value) {
        alert("Please enter a message");
        return;
    }

    socket.emit("chat message", {
        message: input.value,
        username: myUsername,
        date: new Date(),
    });
    input.value = "";
}

function sendMessageIfEnter(event) {
    if (event.keyCode === 13) {
        sendMessage();
    }
}

function joinChat() {
    const input = document.getElementById("username");
    if (!input.value) {
        alert("Please enter a username");
        return;
    }

    myUsername = input.value;
    document.getElementById("user-info").style.display = "none";
    document.getElementById("chat-container").style.display = "block";
    connectToSocket();
    initializeSocketEvents();
}

function userConnectionTemplate(username, connectedUsers, message) {
    const messagesContainer = document.querySelector(".messages");
    const template = document.getElementById("user-connected-template");
    const messageElement = template.content.cloneNode(true);

    messageElement.querySelector('.username').innerText = `${username} has ${message}`
    messagesContainer.appendChild(messageElement);
    messagesContainer.lastElementChild.scrollIntoView()
    document.querySelector('.connected-users').innerText = `connected users: ${connectedUsers.join(',')}`
}