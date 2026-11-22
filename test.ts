import { getDonationCenter } from "./lib/shared/GetDonationCenter"
import mysql, { Pool } from 'mysql2'
import 'dotenv/config'

export const pool: Pool = mysql.createPool({
  host: process.env.SQL_ENDPOINT!,
  user: process.env.SQL_USER!,
  password: process.env.SQL_PASSWORD!,
  database: process.env.SQL_DB!
})


async function main() {

	const result = await getDonationCenter("aa", pool)
    if (result) {
        const  { address, city, state, lat, long } = result
    }
    
    console.log(result)
}

void main()