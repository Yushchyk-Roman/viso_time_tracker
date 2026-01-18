# ⏳ Viso Mini Time Tracker

![Project Status](https://img.shields.io/badge/status-completed-success)
![Tech Stack](https://img.shields.io/badge/stack-FullStack-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A comprehensive **Full Stack Time Tracking Application** developed as a test assignment for **Viso Academy**. The solution goes beyond basic requirements by introducing an interactive calendar view, dynamic project management, and detailed statistics.

---

## ✨ Key Features

This application implements all functional requirements and adds several UX enhancements:

### 1. 📅 Interactive Time History (Calendar View)
* **Calendar Navigation:** Navigate through years and months using dropdowns or arrows.
* **Visual Indicators:** Color-coded badges show daily workload (🟢 >8h, 🔵 <8h).
* **Daily Detail:** Click on any date to see specific entries for that day.

### 2. 🚀 Dynamic Project Management
* **Create on the Fly:** Instead of hardcoded values, users can create new projects directly from the dropdown.
* **Auto-Coloring:** New projects are automatically assigned a unique color tag for better visualization.

### 3. ⏱️ Robust Time Logging
* **Validation:** Backend logic prevents logging more than **24 hours** per calendar date.
* **Data Integrity:** Ensures hours are positive and all fields are present.

### 4. 📊 Statistics
* **Daily Totals:** calculated instantly for the selected date.
* **Grand Total:** Global counter of all tracked hours.

---

## 🛠️ Technology Stack

### Backend (NestJS)
* **Framework:** [NestJS](https://nestjs.com/) (Modular Architecture)
* **Database:** PostgreSQL (via Docker)
* **ORM:** [Prisma](https://www.prisma.io/)
* **Validation:** `class-validator` & `class-transformer`
* **API:** RESTful Architecture

### Frontend (React)
* **Core:** React 18 + TypeScript + Vite
* **UI Library:** [Ant Design](https://ant.design/) (Calendar, Forms, Tables)
* **HTTP Client:** Axios
* **Date Management:** Day.js (with Localization)

---

## Architecture & Project Structure

The project follows a **Monorepo** structure for easier review and deployment.

### Database Design
Two main entities: `TimeEntry` and `Project`. The `Project` entity serves as a dynamic dictionary for project names and color tags, while `TimeEntry` stores the logs.

### Folder Structure
```bash
viso-time-tracker/
├── backend/                # NestJS Application
│   ├── src/
│   │   ├── time-entries/   # Controller, Service, DTOs
│   │   ├── projects/       # Dynamic creation logic
│   │   ├── prisma/         # Database connection service
│   │   └── app.module.ts   # Root module
│   └── prisma/             # Prisma Schema & Migrations
│
├── frontend/               # React Application
│   ├── src/
│   │   ├── api/            # Axios instances & API methods
│   │   ├── features/       # Business logic components
│   │   │   ├── TimeEntryForm/  # Logic for adding new records
│   │   │   └── TimeEntryList/  # Calendar & List logic
│   │   └── types/          # Shared TypeScript interfaces
│   └── ...
│
└── docker-compose.yml      # PostgreSQL container configuration 
```

## 🚀 Getting Started

Follow these steps to set up and run the application locally.

### 📋 Prerequisites
Ensure you have the following installed on your machine:
* **Node.js** (v18 or higher)
* **Docker** & **Docker Compose** (required for the PostgreSQL database)

---

### Step 1: Database Setup
Start the PostgreSQL container. Run this command in the **root directory**:

```bash
docker-compose up -d
```

### Step 2: Backend Setup
Open a new terminal window and navigate to the backend folder:

```Bash
cd backend
```

### Install dependencies and setup the database schema:

```Bash
# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. Push schema to the database
npx prisma db push

# 4. Start the server
npm run start:dev
```
✅ Success: The backend API will be available at http://localhost:3000

### Step 3: Frontend Setup
Open another terminal window and navigate to the frontend folder:

```Bash

cd frontend
```
Install dependencies and start the React application:

```Bash

# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```
🎨 Success: The application will be accessible at http://localhost:5173

 # Evaluation Criteria Checklist
A breakdown of how this solution meets the technical requirements:

| Focus Area | Implementation Status |
| :--- | :--- |
| **Separation of Concerns** | ✅ Clear separation between Frontend (React), Backend (NestJS), and Database. |
| **Architecture** | ✅ Modular NestJS structure; Feature-based React folder structure. |
| **Code Quality** | ✅ Strict TypeScript usage (no `any`), conventional commits, clean code principles. |
| **UX/UI** | ✅ **Ant Design** components, responsive layout, intuitive error handling & toast notifications. |
| **Validation** | ✅ Server-side validation implemented (max 24h/day check in `TimeEntriesService`). |
| **Database** | ✅ Relational data model using **PostgreSQL** and **Prisma ORM**. |


# API Endpoints
The application exposes the following RESTful endpoints:

## Time Entries
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | **/time-entries** | Retrieve all time records |
| `POST` | **/time-entries** | Create a new time log |
| `PATCH` | **/time-entries/:id** | Update an existing record |
| `DELETE` | **/time-entries/:id** | Remove a record |

## Projects
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | **/projects** | Get the list of all projects |
| `POST` | **/projects** | Create a new dynamic project |
