import express from 'express'
import { config } from 'dotenv'
import pg from 'pg'
import cors from 'cors';

config()

const app = express();
const port = process.env.PORT || 3000;
const allowedOrigin = process.env.ACCESS_CONTROL_ALLOW_ORIGIN || '*'; // Usamos la variable de entorno aquí

app.use(cors({ origin: allowedOrigin }));

app.use(express.json());

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});


// Obtener la lista de participantes
app.get('/lista', async(req, res) => {
    try {
        const getParticipantsQuery = 'SELECT * FROM asistencias_dias';
        const participants = await pool.query(getParticipantsQuery);

        return res.status(200).json(participants.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
});

