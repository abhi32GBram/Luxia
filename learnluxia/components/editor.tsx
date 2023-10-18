"use client";

// Import the 'dynamic' function from the 'next/dynamic' module. 'dynamic' is used to import ReactQuill dynamically.
import dynamic from "next/dynamic";
// Import the 'useMemo' hook from 'react'. 'useMemo' is used to memoize the dynamic import to prevent unnecessary re-renders.
import { useMemo } from "react";

// Import the Quill CSS for styling the editor.
import "react-quill/dist/quill.snow.css";

// Define a TypeScript interface 'EditorProps' for the properties expected by the 'Editor' component.
interface EditorProps {
    // 'onChange' is a function that takes a 'value' (string) and has no return value.
    onChange: (value: string) => void;
    // 'value' is a string representing the content of the editor.
    value: string;
}

// Define a functional component 'Editor' that accepts 'onChange' and 'value' as properties.
export const Editor = ({
    onChange,
    value,
}: EditorProps) => {
    // Use the 'useMemo' hook to dynamically import the 'ReactQuill' component while preventing server-side rendering (SSR).
    const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);

    // Return the 'Editor' component as JSX.
    return (
        <div className="bg-white">
            {/* Render the 'ReactQuill' component with specified properties. */}
            <ReactQuill
                theme="snow" // Set the editor theme to "snow".
                value={value} // Bind the 'value' property to the provided value.
                onChange={onChange} // Bind the 'onChange' property to the provided function.
            />
        </div>
    );
};
