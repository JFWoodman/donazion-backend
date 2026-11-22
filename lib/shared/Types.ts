export interface UserDonationCenter {
    address: string,
    city: string,
    zipcode: string
    state: string,
    lat: number,
    long: number
}

export interface DatabaseDoncationCenter {
    dc_name: string,
    dc_latitude: number,
    dc_longitude: number,
    dc_address: string,
    dc_city: string,
    dc_state: string,
    dc_zipcode: string,
    dc_id: string,
    orgo_id: string,
}

export interface UserData {
    accType: string,
    userName: string,
    userEmail: string,
}