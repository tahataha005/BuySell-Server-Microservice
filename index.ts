import messagesConnection from "./socket/socket";
import { createServer } from "http";
import Express from "express";
import cors from "cors";
import { saveMessage } from "./controllers/chat.controller";

import authRoutes from "./routes/auth.routes";
import chatsRoutes from "./routes/chats.routes";
import { authMiddleware } from "./middlewares/auth.middleware";

const app = Express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(Express.json());
app.use("/auth", authRoutes);
app.use("/chats", authMiddleware, chatsRoutes);

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
