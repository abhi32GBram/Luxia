// Import necessary libraries and modules
import Stripe from "stripe"; // Import Stripe library
import { headers } from "next/headers" // Import headers from next.js
import { NextResponse } from "next/server"; // Import NextResponse from next.js server
import { stripe } from "@/lib/stripe"; // Import stripe instance from local file
import { db } from "@/lib/db"; // Import database instance from local file

// Define the POST function
export async function POST(req: Request) {
    // Get the request body and Stripe Signature from the headers
    const body = await req.text()
    const signature = headers().get("Stripe-Signature") as string

    // Initialize the event variable
    let event: Stripe.Event

    // Try to construct the event using the body, signature, and secret key
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        // If there's an error, return a response with the error message and status 400
        return new NextResponse(`WEBHOOK ERROR : ${error.message}`, { status: 400 })
    }

    // Extract the session and userId, courseId from the event metadata
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session?.metadata?.userId
    const courseId = session?.metadata?.courseId

    // Check if the event type is "checkout.session.completed"
    if (event.type === "checkout.session.completed") {
        // If userId or courseId is missing, return a response with an error message and status 400
        if (!userId || !courseId) {
            return new NextResponse(`WEBHOOK ERROR : Missing Metadata`, { status: 400 })
        }

        // If everything is fine, create a new purchase in the database
        await db.purchase.create({
            data: {
                courseId: courseId,
                userId: userId
            }
        })
    } else {
        // If the event type is not handled, return a response with an error message and status 200
        return new NextResponse(`WEBHOOK ERROR : Unhandled Event Type - ${event.type}`, { status: 200 })
    }

    // If everything goes well, return a response with status 200
    return new NextResponse(null, { status: 200 })
}
