import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Query to find all 5 letter last names of baseball players
export default async function handler(req, res) {
  try {
    const [rows] = await pool.execute(
      `SELECT nameLast
       FROM people
       WHERE CHAR_LENGTH(nameLast) = 5
       ORDER BY RAND()
       LIMIT 1`
    );

    if (rows.length > 0) {
      res.status(200).json({ word: rows[0].nameLast.toLowerCase() });
    } else {
      res.status(404).json({ error: 'No 5-letter last names found.' });
    }
  } catch (error) {
    console.error('Error fetching random word:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
