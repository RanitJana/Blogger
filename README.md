
# Blogger

**Blogger** is a dynamic web application designed for enthusiasts to share their stories, ideas, and insights through engaging blog posts. Built on the MERN stack (without React), Blogger offers a robust platform for content creation, user interaction, and seamless file uploads. Whether you're looking to express your thoughts, interact with other users through comments, or just explore diverse content, Blogger provides a feature-rich environment tailored for an enhanced blogging experience.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Technology Used](#technology-used)
- [Contributing](#contributing)
- [License](#license)

# Features

- **User-Friendly Blogging**: Write, edit, and manage your blog posts effortlessly.
- **Secure User Authentication**: Sign up, log in, and secure your account with modern authentication practices.
- **Dynamic Commenting System**: Engage with your audience through comments on your posts.
- **Seamless File Uploads**: Upload images to enrich your blog posts using Cloudinary.
- **Flash Messages**: Receive instant feedback on your actions within the app.
- **Elegant Templating**: Enjoy a visually appealing interface with server-side rendering powered by EJS.

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4 or higher)

## Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/RanitJana/Blogger.git
    cd blogger
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up environment variables**:

   Create a `.env` file in the project root and add the following variables:

    ```plaintext
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/blogger
    SESSION_SECRET=your_session_secret
    ACCESS_TOKEN_SECRET=your_access_token_secret
    ACCESS_TOKEN_EXPIRY=your_access_token_expiry_time
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    REFRESH_TOKEN_EXPIRY=your_access_token_expiry_time
    CLOUD_NAME=your_cloud_name
    API_KEY=your_api_key
    API_SECRECT=your_api_secret
    ```

## Usage

1. **Start the development server**:

    ```bash
    npm run dev
    ```

   This will start the server with nodemon, which automatically restarts the server on file changes.

2. **Access the application**:

   Open your browser and navigate to `http://localhost:3000`.

## Scripts

- **`npm start`**: Starts the server.
- **`npm run dev`**: Starts the server with nodemon for development.

## Dependencies

- **bcrypt**: For hashing passwords.
- **cloudinary**: For uploading and managing images.
- **connect-flash**: For flash messages.
- **cookie-parser**: For parsing cookies.
- **cors**: For enabling Cross-Origin Resource Sharing.
- **dotenv**: For managing environment variables.
- **ejs**: For server-side rendering.
- **express**: Web framework.
- **express-session**: For managing user sessions.
- **jsonwebtoken**: For JWT authentication.
- **mongoose**: For MongoDB object modeling.
- **multer**: For handling multipart/form-data.
- **prettier**: For code formatting.

## Technology Used

### Backend

- **Node.js**: JavaScript runtime used for building the server-side application.
- **Express.js**: Web framework for Node.js, facilitating routing, middleware, and server-side logic.
- **MongoDB**: NoSQL database used for storing user data, blog posts, and comments.
- **Mongoose**: ODM library for MongoDB, providing schema-based solutions to model your data.
- **JSON Web Tokens (JWT)**: For user authentication and secure token management.

### Middleware

- **Multer**: Middleware for handling `multipart/form-data`, primarily used for uploading files.
- **Cloudinary**: Service for uploading, managing, and transforming images in the cloud.
- **Bcrypt**: Library for hashing passwords to ensure secure user authentication.
- **Connect-Flash**: Middleware for storing and displaying flash messages.

### Templating and Static Files

- **EJS**: Templating engine for generating HTML with embedded JavaScript.
- **CSS/JavaScript**: Static files for styling and adding interactivity to the frontend.

### Environment Management

- **Dotenv**: Module to load environment variables from a `.env` file into `process.env`.

### Development Tools

- **Nodemon**: Utility for automatically restarting the server during development when file changes are detected.
- **Prettier**: Code formatter for maintaining consistent code style.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE.md) file for more details.
