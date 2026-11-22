import { UserData, UserDonationCenter, DatabaseDonationCenter } from "./Types"
import { Pool } from "mysql2"

export const getUserData = async (
  userId: string,
  pool: Pool,
): Promise<UserData | undefined> => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM DonationCenter WHERE donationcenterid = ? ",
      [userId],
      (error, results) => {
        if (error) {
          return reject(error)
        }
        if (Array.isArray(results) && results.length == 1) {
          const dc: DatabaseDonationCenter =
            results[0] as DatabaseDonationCenter
          return resolve(undefined)
        } else {
          return resolve(undefined)
        }
      },
    )
  })
}
