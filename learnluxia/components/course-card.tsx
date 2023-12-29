// Import necessary modules and components
import Image from 'next/image'; // Next.js Image component
import Link from 'next/link'; // Next.js Link component
import { IconBadge } from '@/components/icon-badge'; // Custom IconBadge component
import { BookOpen } from 'lucide-react'; // Lucide React icon
import { PriceFormat } from "@/lib/format"; // Function to format prices

// Define type for CourseCard props
interface CourseCardProps {
    id: string; // ID of the course
    title: string; // Title of the course
    imageUrl: string; // URL of the course image
    chaptersLength: number; // Number of chapters in the course
    price: number; // Price of the course
    progress: number | null; // User's progress in the course
    category: string; // Category of the course
}

// Export CourseCard component
export const CourseCard = ({ id, title, imageUrl, chaptersLength, price, progress, category }: CourseCardProps) => {
    return (
        <Link href={`/courses/${id}`}>
            <div className='group hover:shadow-lg transition overflow-hidden border rounded-lg p-3 h-full'>
                <div className='relative w-full aspect-video rounded-md overflow-hidden'>
                    <Image fill className='object-cover' alt={title} src={imageUrl} />
                </div>
                <div className='flex flex-col pt-2'>
                    <div className='text-lg md:text-base font-medium group-hover:text-purple-700 transition line-clamp-2'>
                        {title}
                    </div>
                    <p className='text-sm text-muted-foreground'>
                        {category}
                    </p>
                    <div className='my-3 flex items-center gap-x-2 text-sm md:text-xs'>
                        <div className=' flex items-center gap-x-1 text-slate-500'>
                            <IconBadge size="sm" icon={BookOpen} />
                            <span>
                                {chaptersLength} {chaptersLength === 1 ? " Chapter" : "Chapters "}
                            </span>
                        </div>
                    </div>
                    {progress !== null ? (
                        <div>
                            {/* MAKE A PROGRESS COMPONENT */}
                        </div>
                    ) : (
                        <p className='text-md md:text-sm font-medium text-slate-800'>
                            {PriceFormat(price)}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    )
}
