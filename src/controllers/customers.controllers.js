import { db } from "../database/database.connection.js";
import { customersSchema } from "../schemas/customers.schema.js";
import dayjs from "dayjs";

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

export async function getCustomers(req, res){
    try {
        const customers = await db.query(`SELECT * FROM customers;`);
        customers.rows.forEach(customer => {
            customer.birthday = dayjs(customer.birthday).format('YYYY-MM-DD');
        });
        res.send(customers.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getCustomerById(req, res){
    const {id} = req.params;

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id = $1;`, [id]);
        if(customer.rows.length === 0) return res.status(404).send("Cliente não encontrado.");

        customer.rows[0].birthday = dayjs(customer.rows[0].birthday).format('YYYY-MM-DD');

        res.send(customer.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function editCustomer(req, res){
    const {id} = req.params;
    const {name, phone, cpf, birthday} = req.body;

    const {error} = customersSchema.validate({name, phone, cpf, birthday});
    if(error) return res.status(400).send(error.details[0].message);

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id = $1;`, [id]);
        if(customer.rows.length === 0) return res.status(404).send("Cliente não encontrado.");
        
        const existingUser = await db.query(`SELECT * FROM customers WHERE cpf = $1 AND id <> $2;`, [cpf, id]);
        if(existingUser.rows.length > 0) return res.status(409).send("CPF já cadastrado.");

        await db.query(
            `UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`, [name, phone, cpf, birthday, id]
        );

        res.sendStatus(200);
    } catch(error) {
        res.status(500).send(error.message);
    }
};    