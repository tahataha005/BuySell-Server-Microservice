import { PrismaClient } from "@prisma/client";

const { users: User, chats: Chat, chat_messages: Message } = new PrismaClient();

export { User, Chat, Message };
