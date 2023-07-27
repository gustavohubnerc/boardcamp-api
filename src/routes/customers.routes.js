import { Router } from "express";
import { getCustomers, newCustomer, getCustomerById, editCustomer } from "../controllers/customers.controllers.js";

const customersRouter = Router();

customersRouter.post("/customers", newCustomer);
customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.put("/customers/:id", editCustomer);

export default customersRouter;