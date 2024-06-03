# Brainop Fullstack Assignment

## Table of Contents
- [Introduction](#introduction)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [JWT Implementation](#jwt-implementation)
- [Best Practices](#best-practices)

## Introduction
MelodyVerse is a web application that allows users to sign up, view posts, and interact with the platform in a secure manner. The application is built using a modern technology stack and follows best practices for security, code quality, and user experience.

## Technology Stack
- **Node.js** and **npm**
- **Express.js** for the backend framework
- **MongoDB** for the database
- **jsonwebtoken** library for JWT generation and validation
- **React.js** for the frontend
- **Tailwind CSS** for styling

## Features
- **Signup Screen**
  - Fields for username/email, password (with confirmation), and optional fields like name and profile picture
  - Validation for required fields and email format
  - Terms and conditions checkbox
  - Clear error messages and success messages
  - Simulated sending of a welcome email notification upon successful signup
  - Redirect to the post list screen after successful signup

- **Post List Screen**
  - Infinite scroll implementation for rendering posts using GET API of posts
  - Responsive design using Tailwind CSS
  - Consistent visual theme with "MelodyVerse"

## Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ravish108Coder/brainop-fullstack-assignment
   cd brainop-fullstack-assignment
   ```

2. **Backend Setup:**
   - Install dependencies:
     ```bash
     cd backend
     npm install
     ```
   - Create a `.env` file with the following content:
     ```env
     PORT=8080
     DB_URI=your_mongo_db_uri
     JWT_SECRET=your_jwt_secret
     EMAIL_NAME=your_email
     EMAIL_PASSWORD=your_email_password
     ```
   - Start the server:
     ```bash
     npm start
     ```

3. **Frontend Setup:**
   - Install dependencies:
     ```bash
     cd frontend
     npm install
     ```
   - Start the development server:
     ```bash
     npm start
     ```

## Usage
1. **Signup:**
   - Navigate to the signup screen.
   - Fill in the required fields (username, email, password, confirm password).
   - Optionally, fill in your name and upload a profile picture.
   - Agree to the terms and conditions.
   - Submit the form to register and receive a JWT token.

2. **View Posts:**
   - After signing up, you will be redirected to the post list screen.
   - Scroll to view posts, which will be fetched using the GET /posts API endpoint.

## API Endpoints
### POST /signup
- **Description:** Registers a new user with provided username, email, and password.
- **Request Body:**
  ```json
  {
    "username": "exampleuser",
    "email": "user@example.com",
    "password": "password123",
    "name": "Example User",
    "avatar": "base64-encoded-image"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully",
    "token": "jwt-token"
  }
  ```

### GET /posts
- **Description:** Fetches paginated posts data from the database.
- **Response:**
  ```json
  {
    "posts": [
      {
        "_id": "1",
        "title": "Post Title",
        "body": "Post content"
      },
      ...
    ],
    "pagination": {
      "page": 1,
      "pageSize": 9,
      "totalPages": 11
    }
  }
  ```

## JWT Implementation
- **Generate JWT Tokens:**
  - Tokens are generated upon successful signup.
  - The payload includes user information and an expiration time.
- **Validate JWT Tokens:**
  - Protected routes validate JWT tokens to ensure user authentication.
  - Tokens are required for accessing protected endpoints like GET /posts.

## Best Practices
- **Input Validation and Sanitization:**
  - Use libraries like `zod` to enforce input validation.
- **Prevent Common Attacks:**
  - Implement measures against SQL injection and XSS attacks.
- **Secure Password Storage:**
  - Use bcrypt or Argon2 for hashing passwords.
- **Error Handling:**
  - Provide informative error messages and handle errors gracefully.
- **Environment Variables:**
  - Use environment variables for sensitive information.
- **Session and Token Management:**
  - Implement proper session handling and token expiration mechanisms.

## Conclusion
This app is a secure and user-friendly web application for browsing and interacting with posts. By following modern development practices and using a robust technology stack, the application ensures a smooth and safe user experience.