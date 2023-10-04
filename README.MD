# Messenger Application

This is a full-stack messenger application built using Next.js 13 for the frontend and Express for the backend. It provides real-time messaging capabilities and is designed to be a simple yet functional messenger platform.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contributing](#contributing)

## Features

- User authentication and registration.
- Real-time messaging using WebSocket.
- Chat groups and private messaging.
- Message history and chat notifications.
- Responsive and user-friendly interface.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine.
- PostgresDB installed and running.
- Basic knowledge of Next.js and Express.

## Getting Started

To get this project up and running, follow these steps:

1. Clone this repository:

   ```bash
   git clone git@github.com:DayneeBoiiz/messenger-chat-app.git
   cd messenger-chat-app
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

## Configuration

- Create a .env file in the backend directory with the following content:

        - DATABASE_URL="postgresql://       jhondoe:randompassword@localhost:5433/db_name?schema=public"
        - JWT_SECRET="your_jwt_secret"
        - app_id="your_pusher_app_id"
        - key="your_pusher_key"
        - secret="your_pusher_secret"
        - cluster="your_pusher_cluster"

- Create a .env file in the frontend directory with the following content:

            - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary_cloud_name"
            - NEXT_PUBLIC_BACKEND_HOST="your-backend_host"
            - NEXT_PUBLIC_PUSHER_KEY="your_pusher_key"

## Usage

- Start the backend server:

  ```bash
  cd backend
  npm start
  ```

- Start the frontend development server:

  ```bash
    cd frontend
    npm run build && npm run start
  ```

- Access the messenger application in your browser at http://localhost:3000.

- Register an account, log in, and start messaging!

## Contributing

- Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

  1. Fork the repository.
  2. Create a new branch for your feature or bug fix:
     ```bash
        git checkout -b feature/your-feature-name
     ```
  3. Commit your changes and push them to your fork:
     ```bash
     git commit -m 'Add some feature'
     git push origin feature/your-feature-name
     ```
  4. Create a pull request on the original repository.
