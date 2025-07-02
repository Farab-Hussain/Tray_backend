# Backend API

This is a Node.js backend project using Express, TypeScript, PostgreSQL, JWT authentication, and role-based access control.

## Features
- User authentication (JWT)
- Role-based authorization
- PostgreSQL database integration
- TypeScript support

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm
- PostgreSQL database

### Running the Server
- For development (with auto-reload):
  ```sh
  npm run dev
  ```
- For production build (if you add build scripts):
  ```sh
  npm run build
  npm start
  ```

## API Endpoints
- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Login and receive a JWT
- `GET /api/protected` — Access a protected route (requires JWT)

## Project Structure
```
backend/
├── src/
│   ├── config/
│   ├── middlewares/
│   ├── routes/
│   ├── server.ts
│   └── ...
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## License
MIT 