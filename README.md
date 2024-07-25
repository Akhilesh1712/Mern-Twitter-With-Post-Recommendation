# Mern-Twitter-With-Post-Recommendation
FullStack Twitter(X) Clone with User Post Recommendation System


This is a full-stack Twitter clone application with user post recommendations. The project is built using modern web technologies and includes both a backend server and a frontend client.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)

## Features

- User Authentication (Signup, Login, Logout)
- Post Creation, Deletion, and Viewing
- Post Recommendations
- Responsive UI using Tailwind CSS and DaisyUI
- Real-time data fetching with React Query

## Technologies Used

### Backend

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT (JSON Web Tokens) for authentication
- Bcryptjs for password hashing
- Cloudinary for image storage
- Cors for handling Cross-Origin Resource Sharing
- Dotenv for environment variables

### Frontend

- React
- React Router for routing
- React Query for data fetching
- Tailwind CSS and DaisyUI for styling
- React Icons for icons
- React Hot Toast for notifications
- Vite for build tooling

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm or yarn
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)
- [Cloudinary](https://cloudinary.com/) account (for image storage)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/twitter-clone.git
   cd twitter-clone
2.**Backend Setup**

    
      cd Backend
      npm install
  Create a .env file in the Backend directory and add your environment variables:


          PORT=5000
          MONGODB_URI=your_mongodb_uri
          JWT_SECRET=your_jwt_secret
          CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
          CLOUDINARY_API_KEY=your_cloudinary_api_key
          CLOUDINARY_API_SECRET=your_cloudinary_api_secret

3. ***Frontend Setup***


       cd ../frontend
       npm install



 ### Usage
   
   1.***Running the Backend***


         cd Backend
         npm run dev

  2. ***Running the Frontend***


          cd ../frontend
          npm run dev


     ### NOTE 1 : The frontend development server will start on http://localhost:3000.

     ### NOTE 2 : I have uses the [Cloudinary](https://cloudinary.com/) for images so you also have to create profile there. And for databases uses Mongodb [MongoDB](https://www.mongodb.com/).
