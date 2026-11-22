import { getDonationCenter } from "./lib/shared/GetDonationCenter"

async function main() {
	const result = await getDonationCenter("aa")
    if (result) {
        const  { address, city, state, lat, long } = result
    }
    
    console.log(result)
}

void main()