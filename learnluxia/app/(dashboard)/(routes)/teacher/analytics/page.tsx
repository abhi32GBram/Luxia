// Import necessary modules and components
import { getAnalytics } from "@/actions/get-analytics";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";

// Define the AnalyticsPage function
const AnalyticsPage = async () => {
  // Get the authenticated user's ID
  const { userId } = auth();

  // If the user is not authenticated, redirect to the home page
  if (!userId) {
    return redirect("/");
  }

  // Call the getAnalytics function with the user's ID to get analytics data
  const { data, totalRevenue, totalSales } = await getAnalytics(userId);

  // Render the analytics page with the fetched data
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Display the total sales */}
        <DataCard label="Total Sales " value={totalSales} />
        {/* Display the total revenue */}
        <DataCard label="Total Revenue " value={totalRevenue} shouldFormat />
      </div>
      {/* Display the chart with the fetched data */}
      <Chart data={data} />
    </div>
  );
};

// Export the AnalyticsPage function as the default export
export default AnalyticsPage;