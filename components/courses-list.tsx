// Importing necessary types and components
import { Category, Course } from "@prisma/client"; // Importing Category and Course types from Prisma client
import { CourseCard } from "@/components/course-card"; // Importing CourseCard component

// Defining a new type that extends the Course type with additional properties
type CourseWithProgressWithCategory = Course & {
    category: Category | null; // The category associated with the course, can be null
    chapters: { id: string }[]; // An array of chapter objects, each with an id property
    progress: number | null; // The progress of the course, can be null
}

// Defining the props interface for the CoursesList component
interface CoursesListProps {
    items: CourseWithProgressWithCategory[]; // An array of CourseWithProgressWithCategory objects
}

// Exporting the CoursesList functional component
export const CoursesList = ({ items }: CoursesListProps) => {
    // Returning JSX to render the courses list
    return (
        // Creating a grid layout for the course cards
        // Mapping over the items array to create a CourseCard for each item
        <div>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                {items.map((item) => (
                    <CourseCard
                        key={item.id} // Unique key for each CourseCard
                        id={item.id} // Id of the course
                        title={item.title} // Title of the course
                        imageUrl={item.imageUrl!} // Image URL of the course
                        chaptersLength={item.chapters.length} // Number of chapters in the course
                        price={item.price!} // Price of the course
                        progress={item.progress} // Progress of the course
                        category={item?.category?.name!} // Name of the category associated with the course
                    />
                ))}
            </div>

            {items.length === 0 && (
                <div className=" text-center text-2xl font-semibold text-muted-foreground mt-10">
                    No Courses Found...
                </div>
            )}
        </div>
    )
}
