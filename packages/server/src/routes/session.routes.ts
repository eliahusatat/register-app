import express from "express";
import { getSessions } from "../controllers/session.controller";
import { asyncHandler, authenticateToken, requireRole } from "../middleware/auth";
import { ROLES } from "@register-app/shared";

const router = express.Router();

router.get("/", asyncHandler(authenticateToken) ,asyncHandler(requireRole([ROLES.ADMIN])), getSessions);

export default router;