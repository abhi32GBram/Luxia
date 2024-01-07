// Importing necessary modules and components
import { db } from '@/lib/db'; // Importing database connection
import { auth } from '@clerk/nextjs'; // Importing authentication module

import { Categories } from './_components/categories'; // Importing Categories component

import { SearchInput } from '@/components/search-input'; // Importing SearchInput component

import { GetCourses } from '@/actions/get-courses'; // Importing GetCourses action
import { redirect } from 'next/navigation'; // Importing redirect function
import { CoursesList } from '@/components/courses-list'; // Importing CoursesList component

// Defining the props interface for the SearchPage component
interface SearchPageProps {
  searchParams: {
    title: string; // The title to search for
    categoryId: string; // The ID of the category to filter by
  }
}

// Defining the SearchPage functional component
const SearchPage = async ({ searchParams }: SearchPageProps) => {

  // Getting the authenticated user's ID
  const { userId } = auth();

  // If there is no authenticated user, redirect to the home page
  if (!userId) {
    return redirect("/");
  }

  // Fetching all categories from the database, ordered by name
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  });

  // Fetching courses based on the search parameters and the authenticated user's ID
  const courses = await GetCourses({
    userId,
    ...searchParams
  });

  // Returning JSX to render the search page
  // Rendering a SearchInput component on smaller screens
  // Rendering a div containing a Categories component and a CoursesList component
  return (
    <>
      <div className='px-6 pt-6 md:hidden md:mb-0 block'>
        <SearchInput />
      </div>
      <div className='p-6 space-y-4'>
        <Categories items={categories} />
        <CoursesList items={courses} />
      </div>
    </>
  );
}

// Exporting the SearchPage component as the default export
export default SearchPage;
