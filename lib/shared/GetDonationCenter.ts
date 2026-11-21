import { pool } from "./DbPool"
import { UserDonationCenter, DatabaseDoncationCenter } from "./Types"

export const getDonationCenter = async (userId: string): Promise<UserDonationCenter | any | undefined> => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM DonationCenter WHERE dc_id = ? ", [userId], (error, results) => {
            if (error) { return reject(error) }
            if (Array.isArray(results) && results.length == 1) {
                // const dc: DatabaseDoncationCenter = results[0] as DatabaseDoncationCenter
                // return resolve({
                //     address: dc.stAddress,
                //     city: dc.city,
                //     zipcode: "00000",
                //     state: dc.state,
                //     lat: dc.GPSLat,
                //     long: Number(dc.GPSLong)
                // })
                return resolve(results)
            } else {
                return resolve(undefined)
            }
        })
    })
}


// let ComputeArgumentValue = (value) => {
//   let numeric_value = parseFloat(value)
//   if (isNaN(numeric_value)) {
//     return new Promise((resolve, reject) => {
//       pool.query("SELECT * FROM calc.constants WHERE name = ? ", [value], (error, rows) => {
//         if (error) { return reject(error) }
//         if ((rows) && (rows.length == 1)) {
//           return resolve(rows[0].value)
//         } else {
//           return reject("unable to locate constant '" + value + "'")
//         }
//       })
//     })
//   } else {
//     // this is just the constant
//     return new Promise((resolve) => { return resolve(numeric_value) })
//   }
// }