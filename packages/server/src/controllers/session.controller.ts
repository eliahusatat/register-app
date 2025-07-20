import { SessionLogModel } from "../DB/models/SessionLog";
import { Request, Response } from "express";


export async function getSessions(req: Request, res: Response) {
  const sessions = await SessionLogModel.find().sort({ loginTime: -1 });
  res.json(sessions);
}