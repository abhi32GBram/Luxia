> # Luxia 

## Overview

Welcome to the Luxia repository, a cutting-edge platform built with the modern web in mind. Luxia is a dynamic course maker and selling marketplace that bridges the gap between students and teachers. Leveraging the latest technologies, Luxia offers an intuitive environment for creating, managing, and selling online courses with ease.

### Key Features:
- **Course Creation and Management**: Teachers can create and customize their courses, manage content, and track student progress all in one place. 
  - Upload videos
  - Create quizzes
  - Assignments submission
  - Real-time progress tracking

- **Marketplace for Courses**: Students can browse a wide range of courses, preview course content, and enroll with instant access. 
  - Course ratings and reviews
  - Advanced course search
  - Personalized course recommendations

- **Secure Payments**: Integrated Stripe for secure and hassle-free payments. Supports multiple payment methods and currencies.

- **Video Processing**: Utilizes MUX for high-quality video processing, ensuring smooth and efficient video playback across all devices.

- **Responsive Design**: Built with Tailwind CSS, offering a responsive and mobile-friendly user interface that looks great on all devices.

## Technologies Used
- **Frontend**: Next.js 14, Tailwind CSS for styling
- **Backend**: Next.js API Routes
- **Database**: PlanetScale with MySQL
- **ORM**: Prisma
- **Payments**: Stripe
- **Video Processing**: MUX

## Getting Started

### Prerequisites
- Node.js 14.x or later
- A PlanetScale account
- Stripe and MUX accounts for payment and video processing

### Installation
1. **Clone the Repository**:
   ```sh
   git clone https://github.com/abhi32GBram/luxia.git
   ```
2. **Set up Environment Variables**:
   - Create a `.env.local` file in the root directory.
   - Add your PlanetScale, Stripe, and MUX credentials.

3. **Install Dependencies**:
   ```sh
   npm install
   ```
   
4. **Run the Development Server**:
   ```sh
   npm run dev
   ```

## Usage

After setting up the project, navigate to `http://localhost:3000` to view the Luxia platform. As a teacher, you can start creating courses immediately. As a student, browse the marketplace to find courses that interest you.

## Contributing

We welcome contributions to Luxia! Whether it's improving documentation, adding new features, or reporting bugs, your contributions are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/YourFeature`)
3. Commit your Changes (`git commit -m 'Add some YourFeature'`)
4. Push to the Branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
