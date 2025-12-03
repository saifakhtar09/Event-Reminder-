cd "C:\Event Reminder App\project"
## Features

- JWT-based authentication
- RESTful API for event management
- Automated reminder system using node-cron
- Web push notifications
- MongoDB database with Mongoose ODM
- Secure password hashing with bcrypt
- Auto-updating event statuses

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- node-cron
- web-push
- CORS

## Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:

4. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-reminder
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```



## Running the Application

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```


### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-token` - Verify JWT token

### Events (Protected)

- `GET /api/events` - Get all user events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get single event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event




### MongoDB Atlas Setup

1. Create account at mongodb.com/cloud/atlas
2. Create new cluster
3. Add database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string
6. Update MONGODB_URI in .env

