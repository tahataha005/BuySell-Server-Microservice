const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

let message = "";
let token = "";

const id = Math.random().toString(36).slice(2);

fetch(`http://192.168.1.108:3000/token/${id}`).then((response) => {
  response.json().then((data) => {
    token = data.token;

    console.log(id);

    const socket = io("http://192.168.1.108:3000", {
      path: "/messages",
      auth: { token: token },
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("online", (data) => {
      console.log("Online users: ", data);
      online = data;
    });

    socket.on("new-message", (data) => {
      console.log("Message received: ", data);
    });

    messageInput.addEventListener("change", (event) => {
      message = event.target.value;
    });

    sendButton.addEventListener("click", () => {
      console.log("Sending message: ", message);
      const to = online.find((u) => u.id !== id);
      socket.emit("send-message", {
        to,
        message,
        payload: {},
        token,
      });
      messageInput.value = "";
      message = "";
    });
  });
});
