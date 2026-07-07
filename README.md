# Daily Record Web App

Daily Record is a full-stack web application for tracking planned purchases, item prices, and spending records.

The application includes user registration, login, profile management, and item management features. Users can create and manage their own spending records after logging in.

This project was originally developed as a university coursework project and has been cleaned up and improved for portfolio purposes.

## Features

- User registration and login
- JWT-based authentication
- Login validation using username, email, and password
- Protected routes for logged-in users
- User profile management
- Update email or password with required re-login
- Add, view, and delete spending records
- View total spending
- User-specific item records
- Environment variable configuration with `.env.example`

## Tech Stack

### Frontend

- Vue.js 2
- JavaScript
- BootstrapVue
- Axios
- HTML/CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Joi

### Tools

- Git
- GitHub
- Postman
- npm

## Project Structure

```text
daily-record-web-app/
├── client/                 # Vue.js frontend
├── server/                 # Express.js backend
├── docs/                   # Project documentation
├── images/                 # Project images
├── .env.example            # Example environment variables
├── package.json
└── README.md
```

## Environment Variables

Create a `.env` file in the project root based on `.env.example`.

Example:

```env
JWT_KEY=your_jwt_secret
MONGODB_URI=mongodb://localhost:27017/your_database_name
VUE_APP_API_ENDPOINT=http://localhost:5000/api
NODE_ENV=development
BASE_URL=http://localhost:5000/
```

For local development, if port `5000` is already used by macOS, the backend can be started on another port such as `5001`.

In that case, create or update `client/.env`:

```env
VUE_APP_API_ENDPOINT=http://localhost:5001/api
BASE_URL=http://localhost:5001/
```

## How to Run Locally

### Prerequisites

- Node.js 14.x is recommended
- npm 6.x is recommended
- MongoDB should be running locally

This project was built with an older Vue/Webpack setup. If you are using a newer Node.js version, you may need to use the OpenSSL legacy provider command shown below.

### 1. Clone the repository

```bash
git clone git@github.com:Wang-Q-Y/daily-record-web-app.git
cd daily-record-web-app
```

### 2. Install and run the backend

```bash
cd server
npm install
PORT=5001 npm run dev
```

The backend should run at:

```text
http://localhost:5001/api
```

### 3. Install and run the frontend

Open a new terminal window:

```bash
cd client
npm install
NODE_OPTIONS=--openssl-legacy-provider npm run serve
```

The frontend should run at:

```text
http://localhost:8080
```

## Authentication Flow

The application uses JWT authentication.

- Users can register with a username, email, and password.
- Users must log in with the correct username, email, and password.
- After login, the JWT token is stored in local storage.
- Protected pages require a valid token.
- Logged-out users are redirected to the login page when trying to access protected pages.
- Logged-in users are redirected away from login and register pages.
- When a user updates their email or password, they are logged out and asked to log in again.

## Security Improvements

Several improvements were made while preparing the project for portfolio use:

- Removed `.env` from version control
- Added `.env.example`
- Avoided returning password data from login/register responses
- Protected user profile routes
- Restricted users from viewing all user accounts
- Added token-based access to user profile data
- Required re-login after profile updates
- Removed password storage from local storage
- Improved login error messages for username, email, and password validation

## My Contribution

I developed this project as a full-stack web application for tracking planned purchases, item prices, and spending records.

I worked on both the frontend and backend, including Vue.js pages, Express.js API routes, MongoDB data models, user authentication, profile management, and item management features.

While preparing the project for portfolio use, I also improved the authentication flow, protected user-related routes, removed sensitive environment files from version control, added `.env.example`, improved login validation, required re-login after profile updates, and wrote project documentation.
## Future Improvements

- Improve dashboard UI
- Add item search and category filtering
- Add spending summary cards
- Add better empty-state design
- Add screenshots to the README
- Add frontend form validation
- Add automated tests
- Improve responsive design for mobile devices

## License

This project is licensed under the MIT License.