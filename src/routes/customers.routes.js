import { Router } from "express";
import { getCustomers, newCustomer, getCustomerById, editCustomer } from "../controllers/customers.controllers.js";
import { customersSchema } from "../schemas/customers.schema.js";
import { validateSchema } from "../middlewares/validateSchema.js";

const customersRouter = Router();

customersRouter.post("/customers", validateSchema(customersSchema), newCustomer);
customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.put("/customers/:id", validateSchema(customersSchema), editCustomer);

export default customersRouter;