import { Router } from "express";
import { createGame, getGames } from "../controllers/games.controllers.js";

const gamesRouter = Router();

gamesRouter.use("/games", createGame);
gamesRouter.use("/games", getGames);

export default gamesRouter;