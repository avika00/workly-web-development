# Workly Web Development

**Find Work. Find Talent.**

Workly is a web-based job search and recruitment platform designed to connect job seekers with companies through an integrated platform. Users can explore job opportunities, apply for positions, and publish job vacancies using a single account.

This project is developed as part of a Web Programming course by Group 3, SI2025B.

## Project Overview

Workly provides a platform where users can discover career opportunities and share job vacancies. The system is designed to simplify the recruitment process through an intuitive interface and integrated features for job seekers and recruiters.

The platform supports two main activities:

- **Job Seeking:** Explore job vacancies, view job details, save interesting opportunities, and submit applications.
- **Recruitment:** Create and publish job vacancies, manage posted jobs, and review application activities.

A single user account can be used for both activities without requiring separate seeker and recruiter accounts.

## Features

### Authentication
- User registration
- User login
- Email verification using OTP

### Home
- Home page before login
- Personalized home page after login
- Recommended job opportunities
- Activity summary
- Profile completion suggestions

### Explore Jobs
- Browse available job vacancies
- Explore jobs based on categories
- View detailed job information
- Save job opportunities
- Apply for job vacancies

### Job Posting
- Create job vacancy
- Enter company information
- Company verification
- Business email verification
- Enter job details
- Review job posting before publication
- Job posting success confirmation

### Activity
- View submitted job applications
- Monitor application statuses
- View saved jobs
- Manage posted job vacancies

### Notifications
- Receive activity notifications
- View notification history
- Filter notifications

### Profile
- View and manage user profile
- Add skills
- Add portfolio
- Add work experience

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Programming Language | JavaScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Routing | React Router DOM |
| Backend | PHP Native (planned) |
| Database | MySQL |
| Development Environment | Visual Studio Code |
| Local Server | XAMPP |

## Project Structure

```text
workly-web-development/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.php
│
├── database/
│   └── workly_db
│
├── docs/
│
├── frontend/
│   ├── public/
│   │   └── images/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   └── package.json
│
└── README.md
```

*Note: The backend directory structure is prepared for the upcoming PHP Native implementation. Its API functionality is not yet implemented.*

## Database

The project uses a MySQL database named `workly_db`.

The database consists of 14 tables:

| No. | Table Name | Description |
|---:|---|---|
| 1 | users | Stores user account information |
| 2 | profile | Stores user profile information |
| 3 | portofolio | Stores user portfolio data |
| 4 | company | Stores company information |
| 5 | company_verification | Stores company verification data |
| 6 | nib | Stores business identification information |
| 7 | job | Stores job vacancy information |
| 8 | application | Stores job application data |
| 9 | skill | Stores available skills |
| 10 | profile_skill | Connects users with their skills |
| 11 | job_skill | Connects job vacancies with required skills |
| 12 | city | Stores city reference data |
| 13 | province | Stores province reference data |
| 14 | industry | Stores industry categories |

## Installation and Setup

### Prerequisites

Make sure the following software is installed:

- Node.js and npm
- PHP
- XAMPP
- MySQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/zkasabila/workly-web-development.git
```

Navigate to the project directory:

```bash
cd workly-web-development
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Run the Frontend

```bash
npm run dev
```

Open the development server in your browser:

```text
http://localhost:5173
```

### 4. Backend Setup

The backend will use PHP Native to provide RESTful APIs and connect the frontend application to the MySQL database.

Backend implementation and API configuration are currently in progress.

### 5. Database Setup

1. Start Apache and MySQL from XAMPP Control Panel.
2. Open phpMyAdmin at `http://localhost/phpmyadmin`.
3. Create or import the `workly_db` database.
4. Ensure the database tables are available before backend integration.

## Development Workflow

The project development is divided into the following stages:

1. **Frontend Development** – Building the user interface and page navigation.
2. **Database Design** – Preparing the relational database structure.
3. **Backend Development** – Implementing PHP Native REST APIs.
4. **Integration** – Connecting the React frontend with the PHP backend.
5. **Testing** – Testing system functionality, data processing, and user flows.

## Project Status

| Component | Status |
|---|---|
| Frontend Development | Completed |
| Database Design | Completed |
| Backend Development | In Progress |
| Frontend-Backend Integration | Not Started |
| System Testing | Not Started |

## Contributors

**Group 3 – SI2025B**

Developed as part of the Web Programming course.

---

**Workly – Find Work. Find Talent.**# workly-web-development
Workly – Job Search and Recruitment Platform Website
