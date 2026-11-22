import { UserData, UserDonationCenter } from '../shared/Types.js'
import { pool } from '../shared/DbPool.js'

interface RequestPayload extends UserDonationCenter{
  requestContext: any
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
      if (rows) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

const handler = async (event: RequestPayload): Promise<ResponsePayload> => {
  // check if user is a org, if so deny else create db entry
  const reqId: string = event.requestContext.authorizer.claims.sub
  const orgStatus: boolean = await isOrg(reqId)
  const onboardStatus: boolean = await isOnboarded(reqId)

  if (orgStatus || onboardStatus) {
    const response:ResponsePayload = {
      statusCode: 400,
      body: "User not eligible",
    }
    return response
  }

  let response:ResponsePayload = {
    statusCode: 200,
    body: "",
  }

  pool.query(`INSERT INTO DonationCenter )
    (dc_id, orgo_id, dc_name, dc_address, 
    dc_city, dc_state, dc_zipcode, 
    dc_latitude dc_longitude ) 
    VALUES (?,?,?,?,?,?,?,?,?)`, 
    [event.name, event.address, event.city, 
      event.state, event.zipcode, event.lat, event.long], 
      (err, row) => {
        if (err || !row) {
          response.statusCode = 500
          response.body = "Database error"
        }
        else if (row) {
          response.statusCode = 200
          response.body = "User added"
        } 
    })
  return response
}