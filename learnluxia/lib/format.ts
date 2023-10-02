export const PriceFormat = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    }).format(price);
};

//THIS WAS/IS FOR DOLLAR 
// export const PriceFormat = (price : number) => {
//     return new Intl.NumberFormat("en-US",{
//         style:"currency",
//         currency:"USD"
//     }).format(price)
// }

