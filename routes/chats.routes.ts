import { Router } from "express";
import { getUserChats } from "../controllers/chat.controller";

const router = Router();

router.get("/", getUserChats);

export default router;
