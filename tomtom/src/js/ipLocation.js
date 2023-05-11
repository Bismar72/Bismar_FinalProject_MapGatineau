
// https://api.ipgeolocation.io/ipgeo?apiKey=d64aa29252fe4a60b04461f4b28adbab

export default async () => {
    let res = await fetch("https://localhost:7777/geo");
    return res.json();
}