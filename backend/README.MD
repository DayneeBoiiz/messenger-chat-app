# Chat App Backend

This is the backend of the Chat App, a messenger application built with Express.js. It provides user authentication, login and registration endpoints, database connectivity using Prisma, and the ability to upload pictures to the server.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Endpoints](#endpoints)
- [Contributing](#contributing)

## Features

- User registration with secure password hashing using Argon2.
- User authentication with JSON Web Tokens (JWT).
- Database connectivity with Prisma ORM.
- Picture upload functionality using Multer.
- CORS support for cross-origin requests.
- Real-time messaging with Pusher.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine.
- PostgresDB installed and running.
- Basic knowledge of Express.js.

## Getting Started

To get the backend of the Chat App up and running, follow these steps:

1. Clone this repository:

   ```bash
   git clone git@github.com:DayneeBoiiz/messenger-chat-app.git
   ```

## Endpoints

The following endpoints are available:

- `POST /login`: Log in with an existing user.
- `POST /register`: Register a new user.
- `POST /logout`: Logout the user.
- `GET /users/me`: get logged in user information.
- `GET /users/all`: get al users.
- `POST /conversations`: create a new conversation and return the conversation if exist.
- `GET /conversations/getconversation/`: get all the user conversations.
- `GET /conversations/:conversationUuid/otherUser/`: get the other user in the conversation.
- `GET /conversations/:conversationID/`: get the conversation details by conversation uid.
- `GET /conversations/:conversationID/messages/`: get the conversation messages but conversation uid.
- `POST /messages/`: send a message to the channels that users are joined to, and save the message in the db.
- `POST /conversations/:conversationId/seen`: tag the message seen by the user/users.
- `DELETE /conversations/:conversationId/delete`: delete the conversation, with all it's data.
- `POST /avatar/upload/`: upload the avatar to the user.
- `POST /settings/`: change the user settings.

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
