import { db } from "../database/database.connection.js";
import { rentalsSchema } from "../schemas/rentals.schema.js";
import dayjs from "dayjs";

export async function newRental(req, res){
    const {customerId, gameId, daysRented} = req.body;
    const {error} = rentalsSchema.validate({customerId, gameId, daysRented});
    if(error) return res.status(400).send(error.details[0].message);

    try {
        if(!daysRented || daysRented <= 0) return res.status(400).send("Não é possível alugar por menos de 1 dia!");
        
        const customer = await db.query(`SELECT * FROM customers WHERE id = $1;`, [customerId]);
        if(customer.rows.length === 0) return res.status(400).send("Cliente não encontrado.");

        const game = await db.query(`SELECT * FROM games WHERE id = $1;`, [gameId]);
        if(game.rows.length === 0) return res.status(400).send("Jogo não encontrado.");

        const pricePerDay = game.rows[0].pricePerDay;
        const originalPrice = daysRented * pricePerDay;

        req.body.returnDate = null;
        req.body.delayFee = null;
        req.body.rentDate = dayjs().format('YYYY-MM-DD');
        req.body.originalPrice = originalPrice;
        
        await db.query(
            `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
             VALUES ($1, $2, $3, $4, $5, $6, $7);`,
            [customerId, gameId, req.body.rentDate, daysRented, req.body.returnDate, req.body.originalPrice, req.body.delayFee]
        )

        res.sendStatus(201);     
    } catch (error) {
        res.status(500).send(error.message);
    }   
}