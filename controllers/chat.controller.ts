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

  return newMessage;
};

export const getUserChats = async (req: Request, res: Response) => {
  const id = req["user"].id;

  const chats = await Chat.findMany({
    include: {
      messages: {
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
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

  res.send(
    chats.map((chat) => {
      return {
        id: parseInt(chat.id.toString().split("n")[0]),
        recieverId: parseInt(chat.recieverId?.toString().split("n")[0]!),
        senderId: parseInt(chat.senderId?.toString().split("n")[0]!),
        productId: parseInt(chat.productId),
        lastMessage:
          chat.messages.length === 0
            ? null
            : {
                id: parseInt(chat.messages[0].id.toString().split("n")[0]),
                text: chat.messages[0].text,
                createdAt: chat.messages[0].createdAt,
                payload: JSON.parse(chat.messages[0].payload),
                isSender: chat.messages[0].userId === id,
              },
      };
    })
  );
};

export const getChatMessages = async (req: Request, res: Response) => {
  const chatId = parseInt(req.params.id);

  const messages = await Message.findMany({
    where: {
      chatId,
    },
  });

  res.send(
    messages.map((message) => ({
      id: parseInt(message.id.toString().split("n")[0]),
      text: message.text,
      createdAt: message.createdAt,
      payload: JSON.parse(message.payload),
      isSender: message.userId === req["user"].id,
    }))
  );
};
