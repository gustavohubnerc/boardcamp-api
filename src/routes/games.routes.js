import { Router } from "express";
import { createGame, getGames } from "../controllers/games.controllers.js";
import { gamesSchema } from "../schemas/games.schema.js";
import { validateSchema } from "../middlewares/validateSchema.js";

const gamesRouter = Router();

gamesRouter.post("/games", validateSchema(gamesSchema), createGame);
gamesRouter.get("/games", getGames);

export default gamesRouter;