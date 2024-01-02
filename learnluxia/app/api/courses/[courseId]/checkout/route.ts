// Import necessary modules and functions
import Stripe from "stripe"; // Import Stripe module
import { currentUser } from "@clerk/nextjs"; // Import currentUser function from clerk
import { NextResponse } from "next/server"; // Import NextResponse from next server

import { db } from "@/lib/db"; // Import database connection
import { stripe } from "@/lib/stripe"; // Import stripe instance

// Define the POST function
export async function POST(
    req: Request, // The request object
    { params }: { params: { courseId: string } } // The parameters passed in the request
) {
    try {
        // Get the current user
        const user = await currentUser();

        // Check if user exists and has valid id and email
        if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
            // If not, return unauthorized response
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Find the course in the database using the courseId from the request parameters
        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                isPublished: true,
            }
        });

        // Check if the user has already purchased this course
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: params.courseId
                }
            }
        });

        // If the user has already purchased the course, return an error response
        if (purchase) {
            return new NextResponse("Already purchased", { status: 400 });
        }

        // If the course does not exist, return a not found response
        if (!course) {
            return new NextResponse("Not found", { status: 404 });
        }

        // Define the line items for the Stripe checkout session
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: course.title,
                        description: course.description!,
                    },
                    unit_amount: Math.round(course.price! * 100),
                }
            }
        ];

        // Find the Stripe customer associated with the user
        let stripeCustomer = await db.stripeCustomer.findUnique({
            where: {
                userId: user.id,
            },
            select: {
                stripeCustomerId: true,
            }
        });

        // If the user does not have a Stripe customer, create one
        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress,
            });

            // Save the Stripe customer ID in the database
            stripeCustomer = await db.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id,
                }
            });
        }

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
            metadata: {
                courseId: course.id,
                userId: user.id,
            }
        });

        // Return the URL of the Stripe checkout session
        return NextResponse.json({ url: session.url });
    } catch (error) {
        // Log any errors and return an internal error response
        console.log("[COURSE_ID_CHECKOUT]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}
