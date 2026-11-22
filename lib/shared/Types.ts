export interface UserDonationCenter {
    name: string,
    address: string,
    city: string,
    zipcode: string
    state: string,
    lat: number,
    long: number
}

export interface DatabaseDonationCenter {
    dc_id: string,
    orgo_id: string,    
    dc_name: string,
    dc_address: string,
    dc_city: string,
    dc_state: string,
    dc_zipcode: string
    dc_latitude: number,
    dc_longitude: number,
}

export interface UserData {
    accType: string,
    userName: string,
    userEmail: string,
}