## Lets Debate Backend (Express + PostgreSQL)
This is the backend for the Lets Debate app. It provides RESTful APIs for user authentication, session management, category organization, and reservations.

## MIT License
You are free to use, modify, and distribute this project.

## Tech Stack
Node.js + Express
PostgreSQL (pgadmin4)
dotenv, cors

## Getting Started
1. Clone the repository & install dependencies
cd LetsDebate-backend
create server.js if not exist
npm install

2. Configure environment variables
Create a .env
PORT=3001
PORT2=3002
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/letsDebate

3. Start the server
npm start
> letsdebate-backend@1.0.0 start
> node server.js
Listining on PORT 3001
## admin
adminAuth.js to handle admin auth "Hardcoded".
## postgress 
port 5432
here there is the letsdebate.sql file in letsDebate-backend folder
## API Endpoints
Base URL: http://localhost:3001

1. Auth Routes

POST /api/auth/signup
Registers a new user.

{
  "user_id": "U001",
  "fName": "John",
  "lName": "Doe",
  "email": "john@example.com",
  "password": "123456",
  "photo": "photo.jpg",
  "birthdate": "2000-01-01",
  "role": "user",
  "gender": "male",
  "phone": "0791234567"
}


POST /api/auth/login
Logs in a user.
{
  "email": "john@example.com",
  "password": "123456"
}

## User Routes
GET /api/users
Returns all users.

GET /api/users/:id
Returns user by ID.

POST /api/users
Create a new user (same structure as signup).

PUT /api/users/:id
Update user fields: fName, lName, email, password, photo, birthdate.

DELETE /api/users/:id
Deletes user by ID.

## Session Routes
GET /api/sessions
Returns all debate sessions.

GET /api/sessions/:id
Returns session by ID.

POST /api/sessions
Create session. Requires admin role.

PUT /api/sessions/:id
Update a session (admin only).

DELETE /api/sessions/:id
Delete a session (admin only).

## Category Routes
GET /api/categories
Get all categories.

GET /api/categories/:id
Get category by ID.

POST /api/categories
Add a new category.

PUT /api/categories/:id
Update category name.

DELETE /api/categories/:id
Delete category by ID.

## Reservation Routes
GET /api/reservations
Get all reservations.

GET /api/reservations/:user_id/:session_id
Get one reservation by user and session.

POST /api/reservations
Reserve a seat for a user.

DELETE /api/reservations/:user_id/:session_id
Cancel a reservation.

Middleware
adminAuth.js
Used to protect admin-only endpoints.
Checks for x-role: admin in request headers.

Test Endpoints
GET /test  (prints message to console + response)
GET /  (welcome message)

## Authors
Developed by: Mohammad Al Barawi