// Import necessary modules and types
import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

// Define a type that combines Purchase with Course
type PurchaseWithCourse = Purchase & {
    course: Course;
};

// Function to group purchases by course title
const groupByCourse = (purchases: PurchaseWithCourse[]) => {
    // Initialize an empty object to hold the grouped purchases
    const grouped: { [courseTitle: string]: number } = {};

    // Iterate over each purchase
    purchases.forEach((purchase) => {
        // Get the title of the course associated with the purchase
        const courseTitle = purchase.course.title;
        // If the course title is not yet a key in the grouped object, initialize it to 0
        if (!grouped[courseTitle]) {
            grouped[courseTitle] = 0;
        }
        // Add the price of the course to the total for that course in the grouped object
        grouped[courseTitle] += purchase.course.price!;
    });

    // Return the grouped object
    return grouped;
};

// Export the getAnalytics function
export const getAnalytics = async (userId: string) => {
    try {
        // Find all purchases associated with the given user ID
        const purchases = await db.purchase.findMany({
            where: {
                course: {
                    userId: userId
                }
            },
            include: {
                course: true,
            }
        });

        // Group the purchases by course title
        const groupedEarnings = groupByCourse(purchases);
        // Map the grouped earnings to an array of objects with name and total properties
        const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
            name: courseTitle,
            total: total,
        }));

        // Calculate the total revenue and total sales
        const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
        const totalSales = purchases.length;

        // Return an object containing the data, total revenue, and total sales
        return {
            data,
            totalRevenue,
            totalSales,
        }
    } catch (error) {
        // Log any errors and return an object indicating no data was found
        console.log("[GET_ANALYTICS_ACTIONS]", error);
        return {
            data: [],
            totalRevenue: 0,
            totalSales: 0,
        }
    }
}