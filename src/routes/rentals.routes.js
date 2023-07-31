import { Router } from "express";
import { newRental, getRentals, deleteRental, finishRental } from "../controllers/rentals.controllers.js";
import { rentalsSchema } from "../schemas/rentals.schema.js";
import { validateSchema } from "../middlewares/validateSchema.js";

const rentalsRouter = Router();

rentalsRouter.post("/rentals", validateSchema(rentalsSchema), newRental);
rentalsRouter.get("/rentals", getRentals);
rentalsRouter.delete("/rentals/:id", deleteRental);
rentalsRouter.post("/rentals/:id/return", finishRental);

export default rentalsRouter;