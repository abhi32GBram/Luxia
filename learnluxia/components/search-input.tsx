// Import necessary components and hooks
import { Search } from "lucide-react" // Icon component
import { Input } from "@/components/ui/input" // Input field component
import { useEffect, useState } from "react" // React hooks for managing state and side effects
import { useDebounce } from "@/hooks/use-debounce" // Custom hook for debouncing input
import { useSearchParams, useRouter, usePathname } from "next/navigation" // Next.js navigation hooks
import qs from "query-string" // Library for parsing and stringifying URL queries

// Define the SearchInput component
export const SearchInput = () => {

    // Initialize state for the input value
    const [value, setValue] = useState("")

    // Debounce the input value to limit the rate at which it updates
    const debouncedValue = useDebounce(value)

    // Get the current search parameters, router, and pathname
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    // Get the current category ID from the search parameters
    const currentCategoryID = searchParams.get("categoryId")

    // Use an effect to update the URL whenever the debounced value or category ID changes
    useEffect(() => {
        // Stringify the updated URL with the new query parameters
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                categoryId: currentCategoryID,
                title: debouncedValue
            }
        }, { skipEmptyString: true, skipNull: true })

        // Push the new URL to the router
        router.push(url)
    }, [debouncedValue, currentCategoryID, pathname, router])

    // Render the search input field
    return (
        <div className="relative ">
            <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
            <Input value={value} onChange={(e) => setValue(e.target.value)} // Update the input value on change
                className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200" placeholder="Search for a Course" /> // Style the input field
        </div>
    )
}
