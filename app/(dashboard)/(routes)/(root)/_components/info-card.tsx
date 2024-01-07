// Import necessary components and types
import { IconBadge } from "@/components/icon-badge";
import { LucideIcon } from "lucide-react";

// Define the properties for the InfoCard component
interface InfoCardProps {
    numberOfItems: number; // Number of items to display
    variant?: "default" | "success"; // Optional variant property for styling
    label: string; // Label to display
    icon: LucideIcon; // Icon to display
}

// Define the InfoCard component
export const InfoCard = ({ numberOfItems, variant, label, icon: Icon }: InfoCardProps) => {
    // Return the JSX for the InfoCard component
    return (
        <div className="border-[3px] rounded-lg flex items-center gap-x-2 p-3 ">
            {/* Display the IconBadge component with the specified variant and icon */}
            <IconBadge variant={variant} icon={Icon} />
            <div>
                {/* Display the label in a paragraph with medium font weight */}
                <p className="font-medium">
                    {label}
                </p>
                {/* Display the number of items in a paragraph with gray color and small size */}
                <p className="text-gray-500 text-sm">
                    {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
                </p>
            </div>
        </div>
    );
};