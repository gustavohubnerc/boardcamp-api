import { db } from "../database/database.connection.js";
import { customersSchema } from "../schemas/customers.schema.js";

export async function newCustomer(req, res){
    const {name, phone, cpf, birthday} = req.body;
    const {error} = customersSchema.validate({name, phone, cpf, birthday});
    if(error) return res.status(400).send(error.details[0].message);

    try {
        const existingUser = await db.query(`SELECT * FROM customers WHERE cpf = $1;`, [cpf]);
        if(existingUser.rows.length > 0) return res.status(409).send("CPF já cadastrado.");

        await db.query(
            `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`, [name, phone, cpf, birthday]
        )
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}