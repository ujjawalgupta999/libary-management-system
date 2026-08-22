# Smart Library Management System

Developed as a full-stack engineering portfolio piece at Zakir Husain College of Engineering & Technology (AMU), this application modernizes academic workflows. It bridges the gap between physical and digital inventory management, offering real-time tracking, automated alerts, and a seamless patron experience.

## Core Features

*   **Role-Based Access:** Distinct interfaces for students to track history and librarians to process physical returns and approve loans.
*   **Automated Notifications:** Scheduled email alerts for overdue items and instant approval updates using SMTP.
*   **Penalty Enforcement:** Built-in account freezing when patron items become overdue.
*   **Digital Integration:** Instant generation of QR codes and direct links for academic PDFs.
*   **Live Search Engine:** Real-time catalog filtering by title and author.

## Technical Stack

*   **Frontend:** React.js, React Router, Vite.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB Atlas, Mongoose.
*   **Utilities:** Nodemailer (SMTP), Node-Cron (Task Scheduling), Axios.

## Installation & Setup

*   Clone the repository and run `npm install` in both the `frontend` and `backend` directories to install dependencies.
*   Configure the `.env` file in the backend with your `MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, and `EMAIL_PASS` (Google App Password).
*   Execute `npm run dev` in the frontend and `node server.js` in the backend to launch the application locally.