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
