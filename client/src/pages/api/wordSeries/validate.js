import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { playerIds } = req.body;

  if (!playerIds || !Array.isArray(playerIds) || playerIds.length !== 4) {
    return res.status(400).json({
      valid: false,
      message: 'Must select exactly 4 players'
    });
  }

  try {
    const conn = await pool.getConnection();

    //TODO: Check for correct groupings

    conn.release();
    return res.status(200).json({
      valid: false,
      message: "These players don't form a valid group"
    });

  } catch (error) {
    console.error('Error validating group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}