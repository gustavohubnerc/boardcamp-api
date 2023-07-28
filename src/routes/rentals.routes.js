import { Router } from "express";
import { newRental, deleteRental } from "../controllers/rentals.controllers.js";

const rentalsRouter = Router();

rentalsRouter.post("/rentals", newRental);
//rentalsRouter.get("/rentals", getRentals);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;