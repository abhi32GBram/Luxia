// Importing the usePathname, useRouter, and useSearchParams hooks from Next.js for navigation and routing
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Importing the query-string package for parsing and stringifying URL query strings
import qs from "query-string";

// Importing the IconType type from react-icons for defining the type of icons
import { IconType } from "react-icons";

// Importing the cn function from a local utility file for class name generation
import { cn } from "@/lib/utils";

// Defining the props interface for the CategoryItem component
interface CategoryItemProps {
    label: string; // The label of the category item
    value?: string; // The value of the category item
    icon?: IconType; // The icon of the category item
};

// Defining the CategoryItem component
export const CategoryItem = ({ label, value, icon: Icon, }: CategoryItemProps) => {

    // Getting the current pathname using the usePathname hook
    const pathname = usePathname();
    // Getting the router instance using the useRouter hook
    const router = useRouter();
    // Getting the current search parameters using the useSearchParams hook
    const searchParams = useSearchParams();

    // Getting the current category ID and title from the search parameters
    const currentCategoryId = searchParams.get("categoryId");
    const currentTitle = searchParams.get("title");

    // Checking if the current category item is selected
    const isSelected = currentCategoryId === value;

    // Defining the onClick handler for the category item
    const onClick = () => {
        // Creating a new URL with the updated search parameters
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: currentTitle,
                categoryId: isSelected ? null : value,
            }
        }, { skipNull: true, skipEmptyString: true });

        // Navigating to the new URL
        router.push(url);
    };

    // Rendering the CategoryItem component
    return (
        // Creating a button for the category item
        <button
            onClick={onClick}
            className={cn(
                "py-1 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-purple-700 transition",
                isSelected && "border-purple-700 bg-sky-200/20 text-purple-800"
            )}
            type="button">

            {Icon && <Icon size={20} />}
            <div className="truncate">
                {label}
            </div>
        </button>
    )
}
