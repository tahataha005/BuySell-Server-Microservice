import { Router } from "express";
import { getToken } from "../controllers/auth.controller";

const router = Router();

router.get("/token/:id", getToken);

export default router;
