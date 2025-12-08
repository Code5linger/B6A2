# Vehicle Rental Management System

**Live URL:** https://b6a21.vercel.app/

---

## Features

- User Authentication & Role-based Access (Admin / Customer)
- Vehicle Management (CRUD)
- Booking Management
  - Create bookings with automatic price calculation
  - Update booking status (cancelled / returned)
  - Automatic vehicle availability updates
- Role-based access:
  - Admin: manage users, vehicles, bookings
  - Customer: create bookings, update own profile, cancel bookings
- Secure JWT authentication

---

## Technology Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Token)
- **ORM / Query:** pg (node-postgres)
- **Other Tools:** Postman for testing, dotenv for environment variables

---

## Setup Instructions

### Prerequisites

- Node.js >= 18
- PostgreSQL
- npm or yarn

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/vehicle-rental-system.git
cd vehicle-rental-system

# Install dependencies

npm install
# or
yarn install


# Create .env file

PORT=8000
DATABASE_URL=postgres://user:password@localhost:5432/yourdb
JWT_SECRET=your_jwt_secret

Run database migrations
Make sure your PostgreSQL database is set up and run any SQL scripts to create tables.

# Start the server

npm run dev
# or
yarn dev

# Access API
Use Postman or any API client to access endpoints like:

POST /api/v1/auth/signin

POST /api/v1/vehicles

GET /api/v1/bookings

PUT /api/v1/bookings/:id