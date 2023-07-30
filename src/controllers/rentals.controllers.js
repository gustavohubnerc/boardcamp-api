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

        const stockTotal = game.rows[0].stockTotal;
        const pricePerDay = game.rows[0].pricePerDay;
        const originalPrice = daysRented * pricePerDay;

        const rentals = await db.query(`SELECT * FROM rentals WHERE "gameId" = $1;`, [gameId]);
        if(rentals.rows.length > stockTotal) return res.status(400).send("Jogo já alugado.");
        
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

export async function deleteRental(req, res) {
    const {id} = req.params;

    try {
        const rental = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);
        if(rental.rows.length === 0) return res.sendStatus(404);
        if(rental.rows[0].returnDate !== null) return res.sendStatus(400);

        await db.query(`DELETE FROM rentals WHERE id = $1;`, [id]); 

        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getRentals(req, res) {
    try {
        const rentals = await db.query(`
            SELECT 
                r.id,
                r."customerId",
                r."gameId",
                r."rentDate",
                r."daysRented",
                r."returnDate",
                r."originalPrice",
                r."delayFee",
                c.id AS "customer.id",
                c.name AS "customer.name",
                g.id AS "game.id",
                g.name AS "game.name"
            FROM 
                rentals r
            JOIN
                customers c ON r."customerId" = c.id
            JOIN
                games g ON r."gameId" = g.id;
        `);

        const formattedRentals = rentals.rows.map((rental) => ({
            id: rental.id,
            customerId: rental.customerId,
            gameId: rental.gameId,
            rentDate: rental.rentDate,
            daysRented: rental.daysRented,
            returnDate: rental.returnDate,
            originalPrice: rental.originalPrice,
            delayFee: rental.delayFee,
            customer: {
                id: rental['customer.id'],
                name: rental['customer.name']
            },
            game: {
                id: rental['game.id'],
                name: rental['game.name']
            }
        }));

        res.send(formattedRentals);
    } catch (error) {
        res.status(500).send(error.message);
    }
}