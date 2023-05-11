
export default async () => {
    let res = await fetch("https://localhost:7777/geo/hydrants");
    return res.json();
}