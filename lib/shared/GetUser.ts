import { pool } from "./DbPool"
import { UserData, UserDonationCenter, DatabaseDonationCenter } from "./Types"

export const getUserData = async (userId: string): Promise<UserData | undefined> => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM DonationCenter WHERE donationcenterid = ? ", [userId], (error, results) => {
            if (error) { return reject(error) }
            if (Array.isArray(results) && results.length == 1) {
                const dc: DatabaseDonationCenter = results[0] as DatabaseDonationCenter
                return resolve(undefined)
            } else {
                return resolve(undefined)
            }
        })
    })
}