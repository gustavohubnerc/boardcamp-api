import { db } from "../database/database.connection.js";
import { gamesSchema } from "../schemas/games.schema.js";

export async function createGame(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body;
    const { error } = gamesSchema.validate({ name, stockTotal, pricePerDay });
    if (error) return res.status(400).send(error.details[0].message);
    
    try {
        const existingGame = await db.query(`SELECT * FROM games WHERE name = $1;`, [name]);
        if (existingGame.rows.length > 0) return res.status(409).send("Já existe um jogo com este nome.");

        await db.query(
            `INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`, [name, image, stockTotal, pricePerDay]
        )
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getGames(req, res) {
    try {
        const games = await db.query(`SELECT * FROM games;`);
        res.send(games.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
}