import 'dotenv/config';
import mysql from 'mysql2'

let pool = mysql.createPool({
  host: ProcessingInstruction.env.SQL_ENDPOINT,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE
})

export const handler = async (event) => {
  const orgoid = event.orgoid
  const cat_name = event.cat_name
  await pool.query("INSERT IGNORE INTO dbcalc.Category VALUES (?, ?) ", [orgoid, cat_name], (error, result) => {
    if (error){ 
      return {
        statusCode: 400,
        body: "could not insert into database"
      }
    }
    if (result){
      pool.query("SELECT LAST_INSERT_ID()", [], (error, rows) => {
      if (error) { 
        return {
          statusCode : 400,
          body: "Could not validate categoryid"
        }
      }
      if (rows){ const cat_id = rows[0].cat_id }
    })
    }
  })
  const [rows] = await pool.query("SELECT * FROM calcdb.Category WHERE cat_id = ? ", [cat_id], (error, result) => {
    if (error) { 
      return {
        statusCode: 400,
        body: "Could not locate created table item"
      }
    }
    if (result){
      const response = {
        statusCode: 200,
        body: JSON.stringify(rows)
      };
    }
  });
  return response
}