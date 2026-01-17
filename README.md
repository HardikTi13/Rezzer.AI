# Rezzer.AI

Rezzer.AI is an AI-powered Nutritionist application that analyzes food images to provide nutritional information and healthy verdicts. It utilizes Google's Gemini API for image analysis and offers a user-friendly interface for tracking meals.

## Features

- **AI Food Analysis:** Upload food images to get instant nutritional breakdowns (calories, protein, carbs, fats) and a health verdict.
- **Meal History:** Track your past meals and their nutritional data.
- **Real-time Capture:** Use your device's camera to capture food images directly.
- **Responsive Design:** Optimized for both desktop and mobile use.

## Tech Stack

### Client
- **React:** Frontend library for building the user interface.
- **Vite:** Build tool for fast development and bundling.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **Axios:** For making HTTP requests to the backend.
- **Lucide React:** For icons.

### Server
- **Node.js & Express:** Backend runtime and web framework.
- **MongoDB & Mongoose:** Database for storing meal history.
- **Google Gemini API:** AI model for analyzing food images.
- **Cloudinary:** Cloud storage for managing image uploads.
- **Multer:** Middleware for handling `multipart/form-data`.

## Prerequisites

Before running the project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (Local or AtlasURI)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/HardikTi13/Rezzer.AI.git
    cd Rezzer.AI
    ```

2.  **Install Client Dependencies:**
    ```bash
    cd client
    npm install
    ```

3.  **Install Server Dependencies:**
    ```bash
    cd ../server
    npm install
    ```

## Configuration

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Usage

1.  **Start the Server:**
    Open a terminal in the `server` directory and run:
    ```bash
    npm start
    ```
    The server will run on `http://localhost:5000`.

2.  **Start the Client:**
    Open a new terminal in the `client` directory and run:
    ```bash
    npm run dev
    ```
    The client will typically run on `http://localhost:5173`.
