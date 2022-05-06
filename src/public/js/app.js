/*const ws = require("websocket");*/

const formMessage = document.getElementById("form-message");
const formSubmit = document.getElementById("form-submit");
const responsePanel = document.getElementById("response-panel");

formMessage.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();
  let message = e.target.message;
  console.log(message);
  doSend(message.value);
  message.value = "";
});

const init = () => {
  wsConnect();
};

const wsConnect = () => {
  ws = new WebSocket("ws://localhost:3880");

  ws.onopen = (e) => {
    onOpen(e);
  };

  ws.onclose = (e) => {
    onClose(e);
  };

  ws.onmessage = (e) => {
    onMessage(e);
  };

  ws.onerror = (e) => {
    onError(e);
  };
};

const onOpen = (e) => {
  formSubmit.disabled = false;
  doSend("Se ha establecido la conexion via WS");
};

const onClose = (e) => {
  formSubmit.disabled = true;
  responsePanel.innerHTML = "";
  doSend("La conexion via WS ha finalizado, reconectando...");
  setTimeout(() => {
    wsConnect();
  }, 3000);
};

const onMessage = (e) => {
  responsePanel.innerHTML += e.data + "\n";
};

const onError = (e) => {
  console.log("Error: " + e);
};

const doSend = (message) => {
  ws.send(message);
};

window.addEventListener("load", init, false);
