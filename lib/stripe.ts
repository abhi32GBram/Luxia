// Importing the Stripe library
import Stripe from "stripe";

// Creating a new instance of Stripe using the API key stored in the environment variables
// The API version is set to "2023-10-16" and TypeScript support is enabled
export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    apiVersion: "2023-10-16",
    typescript: true
});
