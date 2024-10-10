import { Server, Socket } from "socket.io";
import { verify } from "jsonwebtoken";
import { service, onlineUsers, io, setOnlineUsers } from "../socket";
import { v4 as uuid } from "uuid";

export const verifyToken = async (token: string) => {
  try {
    const check = await verify(token, process.env.JWT_SECRET!);

    return check;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return false;
  }
};

export const registerChatEvents = (socket: Socket) => {
  onSendMessage(socket);
};

export const onSendMessage = async (socket: Socket) => {
  socket.on(
    "send-message",
    async (data: { to: string; message: string; token: string; payload }) => {
      const user: any = await verifyToken(data.token);

      const id = user.sub ?? user.id;

      const { to, payload } = data;

      const date = new Date();
      const message = {
        // id: uuid(),
        user: id,
        content: data.message,
        createdAt: date.toISOString(),
        read: false,
      };

      service.onSendMessage(message, payload);

      const onlineRecipient: any = onlineUsers.find((user) => user.id === to);

      const self = onlineUsers.find((user) => user.id === id);

      if (onlineRecipient) {
        io.to(onlineRecipient.room).emit("new-message", {
          message,
          payload: {
            ...payload,
            isSender: false,
          },
        });
      }

      if (self) {
        io.to(self.room).emit("new-message", {
          message,
          payload: {
            ...payload,
            isSender: true,
          },
        });
      }
    }
  );
};

export type OnlineUser = {
  room: string;
  id: string;
};

export const authenticateUser = async (socket: Socket) => {
  const token = socket.handshake.auth.token;

  console.log(token);

  const payload: any = await verifyToken(token);
  const id = payload.sub ?? payload.id;

  const isOnline = onlineUsers.some((user) => user.id === id);

  if (!isOnline) {
    onlineUsers.push({ id, room: socket.id });
  }

  io.emit("online", onlineUsers);
};

export const disconnectUser = async (socket: Socket) => {
  const token = socket.handshake.auth.token;

  const { id }: any = await verifyToken(token);

  setOnlineUsers(onlineUsers.filter((user) => user.id !== id));

  io.emit("online", onlineUsers);
};
