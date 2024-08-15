import express from "express";
import env from "dotenv";
import pg from "pg";
import cors from "cors";
import bcrypt from "bcrypt";
import jwf from "jsonwebtoken";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT ?? 8000;
env.config();

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});
db.connect();

// Get note data from db
app.get('/notes/:users_id', async (req, res) => {
    const { users_id } = req.params;
    try {
        const notes = await db.query('SELECT * FROM notes WHERE users_id = $1 ORDER BY ID', [users_id]);
        res.json(notes.rows);
    } catch (error) {
        console.log(error);

    }
})

//Create a notes
app.post('/notes', async (req, res) => {
    const { title, content, users_id } = req.body;
    console.log(title, content, users_id)
    try {
        const newNotes = await db.query(`INSERT INTO notes (title, content, users_id) VALUES ($1 ,$2, $3);`,
            [title, content, users_id]);
        res.json(newNotes);
    } catch (error) {
        console.error(error);

    }
})

// edit a note
app.put('/notes/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const updateNotes = await db.query("UPDATE notes SET title = $1, content = $2 WHERE id = $3;", [title, content, id]);
        res.json(updateNotes);
    } catch (error) {
        console.error(error);
    }
})

// delete a note
app.delete('/notes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deleteNotes = await db.query("DELETE FROM notes where id = $1", [id]);
        res.json(deleteNotes);
    } catch (error) {
        console.error(error);
    }
});


// sign up
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedpassword = bcrypt.hashSync(password, salt);

    try {
        const signUp = await db.query("INSERT INTO users (email, hashed_password) VALUES ($1, $2) RETURNING ID",
            [email, hashedpassword]);

        const userId = signUp.rows[0].id;
        const token = jwf.sign({ email }, 'broom', { expiresIn: '1hr' });
        res.json({ email, token, userId });
    } catch (error) {
        console.error(error);
        if (error) {
            res.json({ detail: error.detail });
        }
    }
});


// login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if (!users.rows.length) return res.json({ detail: 'User does not exist' });

        const userId = users.rows[0].id;
        const storedHashedPassword = users.rows[0].hashed_password;
        const success = await bcrypt.compare(password, storedHashedPassword);
        
        if (success) {
            const token = jwf.sign({ email }, 'broom', { expiresIn: '1hr' });
            res.json({ userId, token });
        } else {
            res.json({ detail: 'Login failed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ detail: 'Server error' });
    }
});


app.use(express.static(path.join(__dirname, '../client/build')));


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
