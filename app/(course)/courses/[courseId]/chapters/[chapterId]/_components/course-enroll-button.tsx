"use client"

// Import necessary components and libraries
import { Button } from "@/components/ui/button" // Importing Button component
import { PriceFormat } from "@/lib/format" // Importing PriceFormat utility
import axios from "axios" // Importing Axios for making HTTP requests
import { useState } from "react" // Importing useState hook from React
import toast from "react-hot-toast" // Importing toast library for showing notifications

// Define the props interface for the CourseEnrollButton component
interface CourseEnrollButtonProps {
    price: number // The price of the course
    courseId: string // The ID of the course
}

// Define the CourseEnrollButton component
export const CourseEnrollButton = ({ price, courseId }: CourseEnrollButtonProps) => {

    // Initialize state variable for loading status
    const [isLoading, setIsLoading] = useState(false)

    // Define the onClick handler for the button
    const onClick = async () => {
        try {
            // Set loading status to true
            setIsLoading(true)
            // Make a POST request to the checkout API
            const response = await axios.post(`/api/courses/${courseId}/checkout`)
            // Redirect the user to the returned URL
            window.location.assign(response.data.url)
        } catch {
            // Show an error notification if something goes wrong
            toast.error("Something Went Wrong !")
        } finally {
            // Set loading status back to false after the operation is done
            setIsLoading(false)
        }
    }

    // Render the button
    // Display the enrollment text along with the formatted price
    return (
        <Button onClick={onClick} size="sm" className="w-full md:w-auto" disabled={isLoading}>
            Enroll for {PriceFormat(price)}
        </Button>
    )
}
