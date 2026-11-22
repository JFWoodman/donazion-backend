import 'dotenv/config';
import mysql from 'mysql2'

let pool = mysql.createPool({
  host: 	process.env.RDS_HOST,
  user: 	process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE
})

export const handler = async (event) => {
  const input = typeof event.body === 'string' ? JSON.parse(event.body) : (event.body ?? event)
  const { orgoid, cat_name } = input;
  if (orgoid === undefined || !cat_name) {
    return { statusCode: 400, body: JSON.stringify({ message: 'orgoid and cat_name are required' }) }
  }
  try {
    const [result] = await pool.query(
      'INSERT IGNORE INTO Category (orgoid, cat_name) VALUES (?, ?)',
      [orgoid, cat_name]
    )

    const [rows] = result.insertId
      ? await pool.query('SELECT * FROM Category WHERE cat_id = ?', [result.insertId])
      : await pool.query('SELECT * FROM Category WHERE orgoid = ? AND cat_name = ?', [orgoid, cat_name])

    if (rows.length === 0) {
      return { 
        statusCode: 404, 
        body: JSON.stringify({ message: 'Could not locate category' })
      }
    }
    return { 
      statusCode: 200,
       body: JSON.stringify(rows[0]) 
    }
  } catch (err) {
    return { 
      statusCode: 500,
      body: JSON.stringify({
        message: 'Database error' 
        }) 
    }
  }
}