import { Router } from "express";
import { getChatMessages, getUserChats } from "../controllers/chat.controller";

const router = Router();

router.get("/", getUserChats);
router.get("/:id", getChatMessages);

export default router;
