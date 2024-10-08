import { Server, Socket } from "socket.io";
import {
  authenticateUser,
  disconnectUser,
  type OnlineUser,
  registerChatEvents,
} from "./messages/events";

type MessagesConnectionOptions = {
  timeout?: number;
  route?: string;
  port?: number;
};

export let onlineUsers: OnlineUser[] = [];
export let io: Server;

export const service = {
  onSendMessage: (message, room) => {},
};

const messagesConnection = (server, data?: MessagesConnectionOptions) => {
  const { timeout = 10000, route = undefined, port = undefined } = data ?? {};

  io = new Server(server ?? port, {
    cors: {
      origin: "*",
    },

    connectTimeout: timeout,
    path: route,
  });

  io.on("connection", async (socket: Socket) => {
    authenticateUser(socket);

    registerChatEvents(socket);

    socket.on("disconnect", () => {
      disconnectUser(socket);
    });
  });

  return {
    onlineUsers,
    onSendMessage: (cb) => {
      service.onSendMessage = cb;
    },
  };
};

export const setOnlineUsers = (users: OnlineUser[]) => {
  onlineUsers = users;
};

export default messagesConnection;
