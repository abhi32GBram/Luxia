// Import necessary libraries and components
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { UserButton, auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { getDashboardCourses } from '@/actions/get-dashboard-courses'
import { CoursesList } from '@/components/courses-list'
import { CheckCircle, Clock } from 'lucide-react'
import { InfoCard } from './_components/info-card'

// Export the Dashboard function
export default async function Dashboard() {
  // Get the user ID from the authentication object
  const { userId } = auth()

  // If the user ID is not available, redirect to the home page
  if (!userId) {
    return redirect("/")
  }

  // Fetch the courses that the user has completed and those that are in progress
  const { completedCourses, coursesInProgress } = await getDashboardCourses(userId)

  // Return the JSX to render the dashboard
  return (
       // Display the number of courses in progress
       // Display the number of completed courses
     // Display the list of all courses
    <div className='p-6 space-y-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 '>
        <InfoCard icon={Clock} label="In Progress..." numberOfItems={coursesInProgress.length} />
        <InfoCard icon={CheckCircle} label="Completed" numberOfItems={completedCourses.length} variant="success" />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  )
}