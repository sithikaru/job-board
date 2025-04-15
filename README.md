
# Job Board Project

_A Full Stack Developer Internship Project_

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture & Implementation](#architecture--implementation)
  - [Backend / API](#backend--api)
  - [Frontend](#frontend)
- [Security](#security)
- [Design & UI](#design--ui)
- [Installation & Setup](#installation--setup)
- [Testing & Deployment](#testing--deployment)
- [Reflection & Skills Demonstrated](#reflection--skills-demonstrated)
- [Future Enhancements](#future-enhancements)

---

## Project Overview

This project is a complete job board application developed during my Full Stack Developer Internship. It is a mini job board where:

- **Public Users** can view job listings.
- **Administrators** can manage job postings by creating and deleting jobs.
- Users can **register, log in, and securely access the admin dashboard**.

The project was built using Next.js with the latest App Router, TypeScript, and Tailwind CSS. It uses PostgreSQL with raw SQL queries for data storage and JWT-based authentication to secure sensitive endpoints.

---

## Key Features

- **User Registration & Authentication**: Secure signup and login with JWT.
- **Public Job Listings**: A responsive page displaying job posts with filtering options.
- **Admin Dashboard**: Protected routes for adding and deleting job posts.
- **Searchable Dropdown Filters**: Filter jobs dynamically by job type and location using Tailwind CSS-based searchable dropdowns.
- **Responsive Design**: Clean and modern UI with custom fonts and consistent styling.

---

## Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Next.js API Routes
- **Database**: PostgreSQL (accessed via raw SQL with the `pg` package)
- **Authentication**: JWT (using `jsonwebtoken`), password hashing with `bcryptjs`
- **Deployment Tools**: (Recommended) Vercel for hosting the Next.js application

---

## Architecture & Implementation

### Backend / API

- **Authentication Routes**:  
  - `/api/auth/register`: Handles user signup, validates input, hashes passwords, and stores users in PostgreSQL.
  - `/api/auth/login`: Validates credentials, compares hashed passwords, and returns a signed JWT for authenticated sessions.

- **Job Management Routes**:  
  - `/api/jobs`: A public GET endpoint that retrieves all job posts.
  - `/api/jobs/admin`: A protected POST endpoint for creating new job posts (requires a valid JWT in the Authorization header).
  - `/api/jobs/admin/[jobId]`: A protected DELETE endpoint for deleting job posts based on their ID.

- **Database Integration**:  
  A single `lib/db.ts` module handles the PostgreSQL connection pooling using the `pg` package, ensuring efficient query management.

### Frontend

- **Public Job Listings Page**:  
  - Located at `/` (the root).  
  - A server component fetches job data at runtime (using `cache: 'no-store'`) and renders job cards in a responsive grid.

- **Job Filtering Component**:  
  - A client-side component (`components/JobListWithFilter.tsx`) provides searchable dropdowns for job type and location.
  - The options are dynamically generated from the fetched job listings, with a clear filters button.

- **User Authentication UI**:  
  - **Login Page (`/login`)**: Provides a form to authenticate users and store the JWT in localStorage.
  - **Registration Page (`/register`)**: Allows new users to create an account with form validation and redirects upon successful registration.
  - **Dashboard (`/dashboard`)**: A protected client-side page for administrators with forms to add new job posts and delete existing ones.

- **Global Layout & Navigation**:  
  - A shared layout (`app/layout.tsx`) includes a custom Navbar (in `components/Navbar.tsx`) that displays appropriate navigation links (Home, Login, Register, Dashboard) based on the user's authentication status.

---

## Security

- **JWT Authentication**:  
  Secure token-based authentication is implemented. Tokens are generated on login, stored securely (e.g., in localStorage for the demo) and sent in the Authorization header for protected API routes.

- **Password Security**:  
  User passwords are hashed using `bcryptjs` before being stored in PostgreSQL, ensuring that raw passwords are never saved.

- **Permission Management**:  
  The API is designed to verify JWTs for any sensitive operations, ensuring that only authenticated users can access administrative endpoints.

---

## Design & UI

- **Tailwind CSS**:  
  Used extensively throughout the project to create a modern, responsive, and clean UI.
  
- **Custom Fonts & Styling**:  
  Inter font imported and applied globally through the Next.js layout to ensure design consistency.

- **Responsive Components**:  
  All pages and components adjust to different screen sizes. Dropdown filters include a subtle hover effect and match the overall white/gray aesthetic as designed.

---

## Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/job-board.git
   cd job-board
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file at the root and set:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/job_board"
   JWT_SECRET="your_secure_jwt_secret"
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```
   Adjust values as needed.

4. **Setup PostgreSQL Database**:
   - Ensure PostgreSQL is running.
   - Create the `job_board` database and run the provided schema SQL script to create the `users` and `jobs` tables.

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to see the job board in action.

---

## Testing & Deployment

- **Testing**:  
  The project was thoroughly tested using Postman for API routes and manual testing for UI/UX on the browser.

- **Deployment**:  
  I recommend deploying this project on Vercel for streamlined Next.js hosting. Remember to set all required environment variables in the Vercel dashboard.

---

## Reflection & Skills Demonstrated

This project demonstrates my abilities in:

- **Full-Stack Development**:  
  Designing and implementing a complete application with front-end and back-end components.

- **Modern Web Technologies**:  
  Proficient use of Next.js (with App Router), TypeScript, and Tailwind CSS.

- **Database Management**:  
  Integrating PostgreSQL using raw SQL and managing connection pooling with the `pg` library.

- **Authentication & Security**:  
  Implementing JWT-based authentication and secure password handling with bcrypt.

- **UI/UX Design**:  
  Creating a responsive and clean user interface with dynamic filtering components that enhance user experience.

- **Problem Solving & Adaptability**:  
  From establishing routes to managing state, dropdown filters, and handling errors—this project shows my capability to deliver robust and user-friendly applications.

---

## Future Enhancements

- **Pagination or Infinite Scrolling**:  
  For a smoother user experience when the job listing grows large.
  
- **Role-Based Access Control (RBAC)**:  
  Enhance security by adding multiple roles (e.g., admin, user).

- **Enhanced Error Handling & Logging**:  
  Implement robust logging and error tracking for production readiness.

- **Unit and Integration Testing**:  
  Incorporate automated tests using Jest and React Testing Library.

- **Progressive Web App (PWA)**:  
  Make the application installable and work offline.

---

## Conclusion

This job board project is a showcase of my full-stack development skills—from designing a clean UI with Tailwind CSS to building secure and efficient backend APIs with Next.js and PostgreSQL. The project is engineered for scalability, usability, and ease of deployment. I look forward to discussing this project and my role in it further.