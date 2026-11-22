import mysql, { Pool } from "mysql2"
import { UserDonationCenter } from '../shared/Types.js'

interface RequestPayload {
  requestContext: any
  body: any
}

interface ResponsePayload {
  statusCode: number,
  body: string,
}

const isOrg = async (id: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM calc.Organization WHERE orgo_user = ?", [id], (err, rows) => {
      if (err) { reject(err) }
      if (rows) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

const isOnboarded = async (id: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM calc.DonationCenter WHERE dc_id = ?", [id], (err, rows) => {
      if (err) { reject(err) }
      if (Array.isArray(rows) && rows.length > 0 ) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

const validateJSON = (obj: any): boolean => {
    return (typeof obj.name === "string" &&
            typeof obj.address === "string" &&
            typeof obj.city === "string" &&
            typeof obj.state === "string" &&
            typeof obj.zipcode === "string" &&
            typeof obj.lat === "number" &&
            typeof obj.long === "number")
}

export const pool: Pool = mysql.createPool({
  host: process.env.RDS_HOST!,
  user: process.env.RDS_USER!,
  password: process.env.RDS_PASSWORD!,
  database: process.env.RDS_DATABASE!
})

export const handler = async (event: RequestPayload): Promise<ResponsePayload> => {
  // check if user is a org, if so deny else create db entry
  const reqId: string = event.requestContext.authorizer.claims.sub
  const orgStatus: boolean = await isOrg(reqId)
  const onboardStatus: boolean = await isOnboarded(reqId)
  let body: UserDonationCenter

  try {
    body = JSON.parse(event.body)
  } catch (error) {
    return {statusCode: 500, body: JSON.stringify({"message":"Invalid Body"})} 
  }
  
  if (!validateJSON(body)) {
    return {statusCode: 400, body: JSON.stringify({"message":"Body missing fields"})}
  }

  if (orgStatus || onboardStatus) {
    return {statusCode: 400, body: JSON.stringify({"message":"User not eligible"})}
  }

  // console.log(JSON.stringify(event), null, 2)

  try {
    await new Promise<void>((resolve, reject) => {
      pool.query(`INSERT INTO DonationCenter 
        (dc_id, orgo_id, dc_name, dc_address, dc_city, dc_state, dc_zipcode, dc_latitude, dc_longitude)
        VALUES (?,?,?,?,?,?,?,?,?)`,
        [reqId, "0", body.name, body.address, body.city, body.state, body.zipcode, body.lat, body.long],
      (err) => (err ? reject(err) : resolve()))
    })
  } catch (error) {
    // console.log(error)
    return {statusCode: 500, body: JSON.stringify({"message":"Database error"})}
  }
  return {statusCode: 200, body: JSON.stringify({"message":"Donation Center added successfully"})}
}