import { pool } from "./DbPool"
import { UserDonationCenter, DatabaseDonationCenter} from "./Types"

export const getDonationCenter = async (userId: string): Promise<UserDonationCenter | undefined> => {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM DonationCenter WHERE dc_id = ? ", [userId], (error, results) => {
            if (error) { return reject(error) }
            if (Array.isArray(results) && results.length == 1) {
                const dc: DatabaseDonationCenter = results[0] as DatabaseDonationCenter
                return resolve({
                    name: dc.dc_name,
                    address: dc.dc_address,
                    city: dc.dc_city,
                    state: dc.dc_state,
                    zipcode: dc.dc_zipcode,
                    lat: dc.dc_latitude,
                    long: dc.dc_longitude
                })
            } else {
                return resolve(undefined)
            }
        })
    })
}