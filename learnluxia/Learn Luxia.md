> # Routes and APIs

- New routes and APIs have been added to enable the following functionalities:
- Delete a chapter
- Publish the chapter
- Unpublish the chapter

## Chapter Status Banners

- Banners have been added to the chapters section to display the status of each chapter.
- These banners indicate whether a chapter is published, being a free/preview chapter, or its current status.

## Chapter Reordering

- Functionality has been added to allow users to reorder chapters.
- This feature provides flexibility in organizing the content of a course.

## Custom Modal for Chapter Deletion

- A custom modal has been added for when a user decides to delete a chapter.
- This modal provides a confirmation prompt before deletion, preventing accidental removals.

---

> # Publishing the Course

## Confetti Effect

- Upon completion of a course, confetti is displayed using the react-confetti package.
- This adds a fun and engaging element to the user experience.

## Routes and Verification

- Routes are set up for each course, and verification is implemented to control the publishing and unpublishing of courses.
- This ensures that only authorized users can perform these actions.

## Auto Unpublish

- If a chapter of a course is unpublished after the course has been published, the entire course is automatically unpublished.
- This prevents incomplete or inconsistent course content from being accessible to users.

## Course Deletion

- Users have the ability to delete an entire course.
- This is useful for removing outdated or irrelevant content.

## Publishing Conditions

- A course can only be published if all mandatory fields are filled.
- This ensures that no incomplete courses are made available to users.

## Zustand Custom Hook

- The zustand package is used to create a custom hook for toggling the confetti effect upon publishing a course.
- This allows for precise control over when the confetti effect is triggered.

## Warning Banner

- A warning banner is displayed to inform the user about the current state of the course - whether it is published or unpublished.
- This helps users understand the status of the course and take appropriate actions.

## Mux Data Deletion

- After deleting a course, all associated Mux data is also deleted from the Mux repository.
- This helps save storage space and keep the repository clean.

---

> # Course Data Format Table

## Data Table in Instructor Dashboard

- A data table has been added in the instructor dashboard under the courses section.
- This table displays all the courses created by the currently logged-in user.

## Sorting Feature

- The ability to sort data values based on alphabets and numbers has been added.
- Users can toggle between ascending and descending order to view the data in their preferred manner.

## Course Status Column

- A status column has been added to the courses data table.
- This column shows whether a course is published or still in draft mode.

## Price Column

- A price column has been added to the data table.
- Users can click on this column to sort the courses based on their prices in either ascending or descending order.

## Actions Column

- An actions column has been added to the data table.
- This allows users to edit the course by clicking on it, which redirects them to the course page for making any necessary changes.

## New Course Button

- A button has been added above the data table to create new courses.
- Clicking this button will take the user to a new page where they can input the details of the new course.

## Search Box

- A search box has been added to the data table.
- Users can enter keywords to look up specific courses. The search functionality supports both alphabetic and numeric characters.

---

> # Category-wise User Recommendation and Filtering

### Using the query-string package (npm i query-string)

### Query Strings Package

The `query-string` package is a robust library that offers functionalities for parsing and stringifying URL query strings. It provides several key features and use cases that make it a versatile tool for developers.

#### Key Features

- **Parse and Stringify**: The package provides methods for converting query strings into JavaScript objects and vice versa. This simplifies the process of working with URL parameters.
- **Array Formatting**: The package supports both indexed and bracketed array representations. This capability enables it to handle complex query strings that include arrays.
- **URL Parsing**: The package can parse a full URL and separate the base URL from the query string. This is beneficial when you need to manipulate individual components of a URL.

#### Common Use Cases

- **Web Development**: In web development, passing data between pages via URL parameters is a common requirement. The `query-string` package can parse these parameters into a JavaScript object, making them easier to work with.
- **API Integration**: When integrating with APIs, you often need to construct URLs with various parameters. The `query-string` package can assist you in building these URLs accurately.
- **Form Submission**: When submitting forms, especially those involving file uploads, the `query-string` package can help you serialize form data into a query string.

## Category Buttons

Different category buttons have been added to the URL to filter the master course categories. These buttons allow users to easily navigate through various course categories based on their preferences.

## Search Bar

A search bar has been added to the interface. This feature allows users to search for a course using its title. It provides a quick and efficient way to find specific courses without having to browse through numerous options.

## Debounce Time Period

The search bar now includes a debounce time period of 2 seconds. This means it waits for the user to finish typing before updating the URL with the title search string. This feature enhances the user experience by reducing unnecessary updates and improving performance.

## Responsiveness

Mobile and large device responsiveness has been added to handle the homepage. This ensures that the website looks and functions optimally across different devices, providing a seamless user experience regardless of the device used.

---

> # Search Page Results & Course Cards

## Server Action for Course Progress View

A server action has been added to allow users to view the progress of their course. This feature provides users with real-time feedback on their learning journey.

## Course Progress View (Bought Courses Only)

An ability has been added to view the progress of a course, but only if the course has been purchased. This ensures that users can only track their progress on courses they have invested in.

## Search Page Completion

The search page has been fully implemented. Users can now view search results based on their input in the search bar or the category they have selected. This feature enhances the user's ability to find relevant content quickly and efficiently.

## Course Cards View

The ability to view course cards has been added. This allows users to browse through available courses in a visually appealing and organized manner.

## Published Courses View

An ability has been added to view only the published courses by all the owners in the database. This ensures that users can only access and learn from courses that are ready for public consumption.

## Course Details View

The ability to view the course title, category, number of chapters, and price in the card has been added. This provides users with all the necessary information at a glance, enhancing their decision-making process.

## Preview Features Update

The `previewFeatures` array in the Prisma schema file has been updated to include `"fullTextSearch"` and `"fullTextIndex"`. This enables full text search capabilities, allowing users to perform comprehensive searches within the application.

---

> # Course Page & Chapter Sidebar

## useRouter Hook:

- The `useRouter` hook is a powerful tool provided by Next.js for programmatically changing routes within client components.
- It allows developers to manipulate the route history, navigate between pages, and even redirect users based on certain conditions.
- However, it's important to note that the `<Link>` component is generally recommended for navigation purposes due to its simplicity and built-in features like prefetching.
- The `useRouter` hook should be used sparingly and only when there's a specific need that can't be met by the `<Link>` component.

## usePathname Hook:

- The `usePathname` hook is another handy utility provided by Next.js for client components.
- This hook allows you to access the current URL's pathname directly within your component.
- It returns a string representing the pathname of the current URL.
- This can be particularly useful when you need to perform some action based on the current page's pathname, such as conditionally rendering content or applying specific styles.

## View Course Pages from Browse Page:

A new feature has been added that allows users to view individual course pages directly from the browse page. This feature enhances the user experience by providing quick and easy access to detailed course information without having to navigate through multiple pages.

## Course Sidebar with Videos:

A course sidebar has been introduced, which includes links to all the videos associated with a particular course. This feature improves navigation and makes it easier for users to find and access specific course content.

## Video Player Space:

A dedicated space for the video player has been added. This ensures that video content is displayed prominently and provides a seamless viewing experience for users.

## Conditional Styles in Chapters:

Conditional styling has been implemented in the chapters section. Depending on whether a course has been purchased, whether the current chapter is being viewed, whether the chapter is locked (if the course hasn't been purchased), and whether the course has been completed, different styles will be applied. This helps guide users through the learning process and provides visual feedback on their progress.

## Responsiveness for Mobile Devices:

The application has been made responsive for mobile devices. This means that the layout and design adapt to fit different screen sizes, ensuring a consistent and enjoyable user experience across all devices. The sheet component from Shadcn UI has been used to achieve this responsiveness.

---

> # Video Player & Course Sidebar

## Conditional Rendering in Video Player:

- We have added conditional rendering to the video player from Mux. This means that the video player will behave differently depending on whether the course has been purchased, if there is a free preview available, or if the video is still loading.
- The conditional rendering logic checks the status of the course purchase and the availability of a free preview. Depending on these factors, the video player will either load the video, display a placeholder image, or show a loading spinner.
- This feature enhances the user experience by providing immediate feedback and ensuring that the correct content is displayed at all times.

## Loader for Video Player Component:

- To improve the user experience, we have added a loader for the video player component. This means that while the video is being fetched from the server, a loading animation will be displayed to the user.
- The loader provides visual feedback and lets the user know that the video is being loaded. Once the video is ready, the loader will disappear, and the video will start playing.
- This feature helps to prevent confusion and frustration that could arise from a sudden change in content or lack of feedback during the video loading process.

## Course Sidebar:

- We have completed the course sidebar, which now includes conditional icons and background color for the chapters. The appearance of each chapter depends on whether it is selected, if it is for preview, or if the course has been purchased.
- If a chapter is selected, it will have a play icon. If the course is not purchased, the chapter will be locked and a lock icon will be displayed. If the chapter is completed, it will have emerald/green text and background.
- This feature improves the user interface by making it easier to understand the status of each chapter and navigate through the course.

## Banner on Locked Chapters:

- We have added a banner on the locked chapters to inform users that they need to purchase the course to access the videos. This banner appears when a user tries to access a chapter that is locked due to the course not being purchased.
- The banner provides clear instructions and encourages users to take the necessary action to unlock the chapters. This feature helps to increase course sales and engagement.

---

> # Integration of Stripe

- Stripe is a powerful payment gateway that allows businesses to accept online payments.
- It provides a suite of APIs that can be integrated into your application to handle various aspects of online transactions.

## Added Stripe as the Payment Middleware

- Stripe acts as the payment middleware in our application.
- It handles all the complexities of processing payments, including security measures like encryption and fraud detection.

## Redirect to the Stripe Checkout for Secure Payments

- When a user decides to make a payment, they are redirected to the Stripe Checkout page.
- This is a secure environment provided by Stripe where users can enter their payment details without worrying about the security of their data.

## Client and Server Failsafes and Error Management

- The application includes robust error handling mechanisms to deal with any issues that may arise during the payment process.
- These include both client-side and server-side checks to ensure smooth operation.

## Unlocking Chapters Upon Successful Transaction

- Once a user successfully completes a payment, the corresponding course chapters are unlocked for them.
- This enhances the user experience by providing immediate access to the content they've paid for.

## Displaying Optional Files to the User Only Upon Purchase

- The application ensures that optional files related to a course are only displayed to the user once they've completed the purchase.
- This adds value to the user's purchase and encourages repeat business.

## Updating the Course Sidebar

- After a successful purchase, the course sidebar is updated to reflect the changes.
- This includes unlocking the relevant chapters and showing the play button, indicating that the course is now available for the user.

## Allowing Purchase of Only One Course

- The application has a mechanism in place to prevent users from purchasing more than one course at a time.
- This is to ensure fair usage and prevent potential misuse of the system.

## Viewing All Transactions in the Stripe CLI

- The Stripe Command Line Interface (CLI) provides a convenient way to view all transactions.
- This is particularly useful for debugging and auditing purposes.

## Listening to the Webhook Request on Localhost Port Number - 3000

- The application listens for incoming webhook events from Stripe on a specified port (in this case, port 3000).
- These events provide real-time updates on the status of transactions.

## Updating Database Information After Transaction

- After a transaction is completed, the application updates its database to reflect the new state.
- This includes recording the details of the transaction and updating the user's purchase history.

### Current Limitations (Stripe) :

- Due to the Stripe policies in India for performing transactions during checkout :
  - Payment currency in the backend has been set to USD for now as even after changing the country to anything else it throws the payment-unacceptance error
  - Courses will be listed in INR (dillema) and will be charged in USD in the checkout page

---

> # Course Completion & Progress Bar

# Course Page Completion

## Chapter Progress Bar

- We have integrated a progress bar into our UI design using Shadcn UI.
- This progress bar calculates the user's progress based on the number of videos they have watched within a course.
- The progress bar displays the percentage of completion, providing users with a visual representation of their learning progress.

## Course Card Progress Bar

- In the browsing section, we replaced the price label on the course card with a progress bar.
- This allows users to see at a glance how much of the course they have completed after purchasing the course

## Mark as Complete Button

- We've introduced a 'Mark as Complete' button that functions in two ways.
- Firstly, it allows users to manually mark a chapter as complete. Secondly, once a user has watched all the videos in a chapter, the system automatically marks the chapter as complete.

## Completion Confetti

- Upon completing all the chapters in a course, users are rewarded with a fun confetti animation
- This adds an element of excitement and celebration to the learning process.

## Completed Chapter Indicators

- Once a chapter is marked as complete, its icon and title turn green/emerald, and a circle check icon appears.
- This provides a clear visual indication of which chapters the user has already completed.

## State Solidification

- To ensure that users don't lose their progress, we update the state of all completed chapters.
- This means that if a user leaves a course and then returns to it later, they will find their progress preserved.

## Automatic Chapter Transition

- After watching all the videos in a chapter, users are automatically moved to the next chapter.
- This streamlines the learning experience and reduces the need for manual navigation.

## Current Chapter Banner

- For returning viewers, we display a banner on the current chapter to indicate that it has been completed.
- This helps users quickly identify where they left off and continue their learning journey.

---
