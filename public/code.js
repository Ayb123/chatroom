(function () {
    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    // Join chat when the user clicks "Join"
    app.querySelector(".join-screen #join-user").addEventListener("click", function () {
        let username = app.querySelector(".join-screen #username").value;
        if (username.length == 0) {
            return;
        }

        // Emit event to notify the server of a new user
        socket.emit("newuser", username);
        uname = username;

        // Switch from join screen to chat screen
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    // Send message when the user clicks "Send"
    app.querySelector(".chat-screen #send-message").addEventListener("click", function () {
        let message = app.querySelector(".chat-screen #message-input").value;

        // Don't send empty messages
        if (message.length == 0) {
            return;
        }

        // Render the message locally (my message)
        renderMessage("my", {
            username: uname,
            text: message
        });

        // Send the message to the server
        socket.emit("chat", {
            username: uname,
            text: message
        });

        // Clear the message input field after sending
        app.querySelector(".chat-screen #message-input").value = "";
    });

app.querySelector(".chat-screen #exit-chat").addEventListener("click",function(){
socket.emit("exituser",uname)
window.location.href=window.location.href
})


    // Function to render messages on the chat screen
    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        let el = document.createElement("div");

        if (type == "my") {
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
        } else if (type == "other") {
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
        } else if (type == "update") {
            el.setAttribute("class", "update");
            el.innerText = message;
        }

        // Append the message to the container
        messageContainer.appendChild(el);

        // Scroll to the bottom to view the latest messages
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }

    // Listen for chat messages from other users
    socket.on("chat", function (message) {
        renderMessage("other", message);
    });

    // Listen for system updates (e.g., user joins or leaves)
    socket.on("update", function (updateMessage) {
        renderMessage("update", updateMessage);
    });

})();
