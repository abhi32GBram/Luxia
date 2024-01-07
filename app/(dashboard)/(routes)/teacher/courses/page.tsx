// Importing the Link component from Next.js for client-side transitions between routes
import Link from 'next/link'

// Importing the DataTable component from a local file
import { DataTable } from './_components/data-table'
// Importing the columns configuration from a local file
import { columns } from './_components/columns'

// Importing the redirect function from Next.js for server-side redirection
import { redirect } from 'next/navigation'

// Importing the auth object from Clerk for authentication
import { auth } from '@clerk/nextjs'
// Importing the db object from a local file for database operations
import { db } from '@/lib/db'

// Defining an asynchronous function component named Courses
const Courses = async () => {

  // Getting the current authenticated user's ID
  const { userId } = auth()
  // If there is no authenticated user, redirect to the home page
  if (!userId) {
    return redirect("/")
  }

  // Fetching all courses associated with the current user from the database
  const courses = await db.course.findMany({
    where: {
      userId
    },
    // Ordering the fetched courses in descending order based on their creation time
    orderBy: {
      createdAt: "desc"
    }
  })

  // Rendering the Courses component
  return (
    // Adding padding around the component
    <div className='p-6'>

      <DataTable columns={columns} data={courses} />
    </div>
  )
}

// Exporting the Courses component as the default export of this module
export default Courses
