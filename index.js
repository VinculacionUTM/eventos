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

//Participantes
app.post('/registro', async(req, res) => {
    try {
        const { marca_temporal, correo_electronico, nombres, apellidos, cedula, telefono, pais, ciudad, universidad, tipo_participacion, condicion, facultad, tipo_dia, dia_1, dia_2, dia_3, dia_4, dia_5 } = req.body;

        const userExistQuery = 'SELECT * FROM Prueba WHERE correo_electronico = $1';
        const userExistValues = [correo_electronico];
        const userExistResult = await pool.query(userExistQuery, userExistValues);

        if (userExistResult.rowCount > 0) {
            return res.status(400).json({ error: 'El participante ya existe' });
        }

        const insertUserQuery = 'INSERT INTO Prueba (marca_temporal, correo_electronico, nombres, apellidos, cedula, telefono, pais, ciudad, universidad, tipo_participacion, condicion, facultad, tipo_dia, dia_1, dia_2, dia_3, dia_4, dia_5) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)';
        const insertUserValues = [marca_temporal, correo_electronico, nombres, apellidos, cedula, telefono, pais, ciudad, universidad, tipo_participacion, condicion, facultad, tipo_dia, dia_1, dia_2, dia_3, dia_4, dia_5];
        await pool.query(insertUserQuery, insertUserValues);

        return res.status(201).json({ message: 'Participante registrado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
});
// En tu archivo de rutas (participantesControllers.js)

app.post('/actualizarAsistencia', async (req, res) => {
    try {
        const { cedula, asistencia } = req.body;
        const updateQuery = 'UPDATE Prueba SET asistencia = $1 WHERE cedula = $2';
        await pool.query(updateQuery, [asistencia, cedula]);

        return res.status(200).json({ message: 'Asistencia actualizada exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error en el servidor al actualizar la asistencia' });
    }
});

// Eliminar un participante por ID
app.delete('/eliminacion/:id', async(req, res) => {
    try {
        const id = req.params.id;

        const deleteUserQuery = 'DELETE FROM Prueba WHERE id = $1';
        const deleteUserValues = [id];
        await pool.query(deleteUserQuery, deleteUserValues);

        return res.status(200).json({ message: 'Participante eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Buscar un participante por cédula
app.get('/buscarPorCedula/:cedula', async(req, res) => {
    try {
        const cedula = req.params.cedula;

        const searchByCedulaQuery = 'SELECT * FROM Prueba WHERE cedula ILIKE $1';
        const searchByCedulaValues = [`%${cedula}%`];
        const searchByCedulaResult = await pool.query(searchByCedulaQuery, searchByCedulaValues);

        if (searchByCedulaResult.rowCount > 0) {
            return res.status(200).json(searchByCedulaResult.rows);
        } else {
            return res.status(404).json([]);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
});

//btener la lista de participantes
app.get('/listaParticipantes', async(req, res) => {
    try {
        const getParticipantsQuery = 'SELECT * FROM Prueba';
        const participants = await pool.query(getParticipantsQuery);

        return res.status(200).json(participants.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
});

//Asistencia
app.post('/registrar', async (req, res) => {
    try {
        const { id, cedula, correo_electronico, nombres, apellidos, dia_seleccionado, asistencia } = req.body;
        const insertUserQuery = 'INSERT INTO asistencias_dias (id, cedula, correo_electronico, nombres, apellidos, dia_seleccionado, asistencia) VALUES ($1, $2, $3, $4, $5, $6, $7)';
        const insertUserValues = [id, cedula, correo_electronico, nombres, apellidos, dia_seleccionado, asistencia];
        await pool.query(insertUserQuery, insertUserValues);

        return res.status(201).json({ message: 'Participante registrado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
});




// Actualizar asistencia por cédula
app.post('/actualizar', async (req, res) => {
    try {
        const { cedula, dia_seleccionado, asistencia } = req.body;
        const updateQuery = 'UPDATE asistencias_dias SET asistencia = $1 WHERE cedula = $2 AND dia_seleccionado = $3';
        await pool.query(updateQuery, [asistencia, cedula, dia_seleccionado]);

        return res.status(200).json({ message: 'Asistencia actualizada exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error en el servidor al actualizar la asistencia' });
    }
});


// Eliminar un participante por ID
app.delete('/eliminar/:id', async(req, res) => {
    try {
        const id = req.params.id;

        const deleteUserQuery = 'DELETE FROM asistencias_dias WHERE id = $1';
        const deleteUserValues = [id];
        await pool.query(deleteUserQuery, deleteUserValues);

        return res.status(200).json({ message: 'Participante eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Buscar un participante por cédula
app.get('/buscar/:cedula', async(req, res) => {
    try {
        const cedula = req.params.cedula;

        const searchByCedulaQuery = 'SELECT * FROM asistencias_dias WHERE cedula ILIKE $1';
        const searchByCedulaValues = [`%${cedula}%`];
        const searchByCedulaResult = await pool.query(searchByCedulaQuery, searchByCedulaValues);

        if (searchByCedulaResult.rowCount > 0) {
            return res.status(200).json(searchByCedulaResult.rows);
        } else {
            return res.status(404).json([]);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener la lista de participantes
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

//Login
app.post('/login', async(req, res) => {
    try {
        const { nombre, password } = req.body; // Cambia email por nombre

        const loginQuery = 'SELECT iniciar_sesion($1, $2) AS is_authenticated';
        const loginValues = [nombre, password]; // Cambia email por nombre
        const loginResult = await pool.query(loginQuery, loginValues);

        const isAuthenticated = loginResult.rows[0].is_authenticated;

        if (isAuthenticated) {
            return res.status(200).json({ message: 'Inicio de sesión exitoso' });
        } else {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
});

app.post('/obtenerTipoUsuario', async(req, res) => {
    try {
        const { nombre } = req.body; 
        const obtenerTipoUsuarioQuery = 'SELECT rol FROM tb_usuarios WHERE nombre = $1'; 
        const obtenerTipoUsuarioValues = [nombre];
        const tipoUsuarioResult = await pool.query(obtenerTipoUsuarioQuery, obtenerTipoUsuarioValues);

        if (tipoUsuarioResult.rowCount > 0) {
            const tipoUsuario = tipoUsuarioResult.rows[0].rol;
            return res.status(200).json({ tipo: tipoUsuario });
        } else {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error en el servidor' });
    }
});
