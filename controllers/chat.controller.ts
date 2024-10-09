import type { Request, Response } from "express";
import { Chat, Message } from "../prisma/client";

export const saveMessage = async (message, payload) => {
  const { user, content, createdAt, read } = message;
  const { chatId, ...rest } = payload;

  const chat = await Chat.findUnique({
    where: {
      id: chatId,
    },
  });

  if (!chat) return;

  const newMessage = await Message.create({
    data: {
      payload: JSON.stringify(rest),
      chatId: chatId,
      text: content,
      userId: user,
    },
  });
};

export const getUserChats = async (req: Request, res: Response) => {
  const id = req["user"].id;

  const chats = await Chat.findMany({
    where: {
      OR: [
        {
          senderId: id,
        },
        {
          recieverId: id,
        },
      ],
    },
  });

  console.log(chats);

  res.send(
    chats.map((chat) => {
      return {
        id: chat.id.toString().split("n")[0],
        reciever: chat.recieverId?.toString().split("n")[0],
        sender: chat.senderId?.toString().split("n")[0],
        productId: chat.productId,
      };
    })
  );
};
