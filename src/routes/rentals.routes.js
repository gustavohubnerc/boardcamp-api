import { Router } from "express";
import { newRental, getRentals, deleteRental, finishRental } from "../controllers/rentals.controllers.js";z

const rentalsRouter = Router();

rentalsRouter.post("/rentals", newRental);
rentalsRouter.get("/rentals", getRentals);
rentalsRouter.delete("/rentals/:id", deleteRental);
rentalsRouter.post("/rentals/:id/return", finishRental);

export default rentalsRouter;