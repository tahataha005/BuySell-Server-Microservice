import messagesConnection from "./socket/socket";
import { createServer } from "http";
import Express from "express";
import cors from "cors";
import { sign } from "jsonwebtoken";
import { saveMessage } from "./controllers/chat.controller";

const app = Express();

app.use(
  cors({
    origin: "*",
  })
);

app.get("/token/:id", async (req, res) => {
  const token = await sign(
    { id: req.params.id, name: "John" },
    process.env.JWT_SECRET!
  );

  res.send({ token });
});

const server = createServer(app);

const service = messagesConnection(server, {
  port: 3001,
  route: "/messages",
  timeout: 50000,
});

service.onSendMessage(saveMessage);

server.listen(3000, () => {
  console.log("Server started on port 3000");
});
