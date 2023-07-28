import { Router } from "express";
import { newRental } from "../controllers/rentals.controllers.js";

const rentalsRouter = Router();

rentalsRouter.post("/rentals", newRental);

export default rentalsRouter;