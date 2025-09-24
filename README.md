# Campus Event Volunteer Portal

## CEVP

Click on the given link to explore :  [CEVP- Campus Event Volunteer Portal](https://cevp-a-campus-event-volunteer-porta.vercel.app/).

## Overview

This is a full-stack web application designed to manage on-campus event volunteers. The portal allows event organizers to create and manage events, while volunteers can browse, sign up for, and provide feedback on these events. The system is built with a modern technology stack featuring a React frontend and a Supabase backend.

---

## Core Features

### Organizer Features
- **Authentication:** Secure login for organizers.
- **Event Management (CRUD):** Organizers can create, view, edit, and delete events they own.
- **Dashboard:** A dedicated dashboard to view all created events and the list of volunteers signed up for each.
- **Certificate Generation:** Organizers can generate a unique, shareable certificate page for each volunteer who participated in an event.

### Volunteer Features
- **Authentication:** Secure sign-up and login with email or GitHub.
- **Event Browsing:** View a list of all upcoming campus events.
- **Event Details Page:** View detailed information about a specific event.
- **Event Signup:** Securely sign up for an event, with real-time capacity checks to prevent overbooking.
- **My Signups Page:** View a list of all events the user has personally signed up for.
- **Feedback System:** Submit feedback for an event after participating.

### Security
- **Row Level Security (RLS):** Database policies are in place to ensure users can only access and manage their own data.
- **Role-Based UI:** The user interface dynamically changes based on the user's role (e.g., 'volunteer' or 'organizer'), hiding administrative links from regular users.

---

## Tech Stack

- **Frontend:** React, React Router
- **Backend:** Supabase (PostgreSQL, Authentication, Storage)
- **Styling:** Global CSS
- **User Feedback:** React Toastify for notifications

---

## Setup and Installation

To run this project locally, follow these steps:

1.  **Prerequisites:** Ensure you have Node.js, Docker Desktop, and the Supabase CLI installed.
2.  **Clone the Repository:** `git clone <your-repo-url>`
3.  **Setup Supabase Project:**
    * Create a new project on [supabase.com](https://supabase.com).
    * In the `client` folder, create a `.env.local` file and add your Supabase URL and Anon Key.
    * Run all the SQL scripts from the project to create the tables, functions, and security policies.
4.  **Install Dependencies:** Navigate to the `client` directory and run `npm install`.
5.  **Run the App:** In the `client` directory, run `npm start`.
