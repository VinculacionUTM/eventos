import express from 'express'
import { config } from 'dotenv'
import pg from 'pg'
import cors from 'cors';

config()

const app = express();
const port = process.env.PORT || 3000;
const allowedOrigin = 'https://eventosutmach.000webhostapp.com';
app.use(cors({ origin: allowedOrigin }));

app.use(express.json());


const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

app.get('/listaParticipantes', async(req, res) => {
    try {
        const getParticipantsQuery = 'SELECT * FROM asistencias_dias';
        const participants = await pool.query(getParticipantsQuery);

        return res.status(200).json(participants.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
});
