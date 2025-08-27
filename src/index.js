
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const authRoutes = require('./routes/auth');
const birthdaysRoutes = require('./routes/birthdays');
const cardsRoutes = require('./routes/cards');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Jukira Backend!');
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection error');
  }
});

app.use('/auth', authRoutes);
app.use('/birthdays', birthdaysRoutes);
app.use('/cards', cardsRoutes);

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
    await pool.query('SELECT NOW()');
    console.log('Database connection verified on startup.');
  } catch (err) {
    console.error('Database connection FAILED on startup:', err.message);
  }
});
