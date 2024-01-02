"use client"
// Importing the necessary components from the UI library
import { Card } from "@/components/ui/card";

// Importing the necessary components from the recharts library for creating charts
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

// Defining the interface for the props that the Chart component will receive
interface ChartProps {
    // The data prop is an array of objects, where each object has a 'name' property of type string and a 'total' property of type number
    data: {
        name: string;
        total: number;
    }[];
}

// Exporting the Chart component which receives the data prop
export const Chart = ({ data }: ChartProps) => {
    // Returning the JSX for the chart
    return (
        // The Card component wraps around everything
        <Card >
            <ResponsiveContainer width="100%" height={350}>

                <BarChart data={data}>

                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                    <Bar dataKey="total" fill="#360d54" radius={[4, 4, 0, 0]} />

                </BarChart>

            </ResponsiveContainer>
        </Card>
    );
};
