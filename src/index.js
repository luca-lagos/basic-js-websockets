const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();
const server = require("http").Server(app);
const webSocketServer = require("websocket").server;

app.set("port", 3880);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));

const wsServer = new webSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

let conn = null;

wsServer.on("request", (request) => {
  const connection = request.accept(null, request.origin);
  conn = connection;
  conn.on("message", (message) => {
    console.log("Mensaje recibido: " + message.utf8Data);
    conn.sendUTF("Recibido: " + message.utf8Data);
  });
  conn.on("close", (reasonCode, description) => {
      console.log("El cliente se ha desconectado");
  })
});

let i = 1;
setInterval(() => {
  if(conn != null && conn.connected){
    conn.sendUTF("Mensaje " + i + " del servidor");
    i++;
  }
}, 5000);

server.listen(app.get("port"), () => {
    console.log("Servidor iniciado en el puerto " + app.get("port"));
})
