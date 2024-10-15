# Projest - Back-End

## Description

This repository contains the back-end of **Projest**, a project management application. It handles authentication, project management, and data manipulation through a REST API. This project is built with **Node.js**, **Express**, and **Sequelize** for database management.

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

- **Node.js** (version 14 or higher recommended): [Download Node.js](https://nodejs.org/)
- **npm** (or yarn, if you prefer): npm comes with Node.js
- **Git** to clone the repository: [Download Git](https://git-scm.com/)
- **PostgreSQL** for the database: [Download PostgreSQL](https://www.postgresql.org/download/)

## Installation

1. Clone this repository to your local machine:  
`git clone https://github.com/Francisco-Florian/Projest-Back.git`

2. Navigate to the project directory:  
`cd Projest-Back`

3. Install the necessary dependencies:  
`npm install`

4. Create a `.env` file at the root of the project to define the following environment variables:  
`DB_HOST=localhost DB_USER=your_postgres_user DB_PASSWORD=your_postgres_password DB_NAME=projest_db JWT_SECRET=your_secret_key`

5. Make sure PostgreSQL is installed and the database is created:  
`createdb projest_db`

6. Run the migrations to set up the database:  
`npx sequelize db:migrate`

## Running the Project

To run the project in development mode, execute the following command:  
`npm start`

This will start the server locally at: `http://localhost:3000`

## Key Features

- **JWT Authentication**: Authentication system using JSON Web Tokens.
- **Project Management**: REST API to create, update, and delete projects.
- **User Management**: User account creation and role management.
- **Task Management**: CRUD operations for tasks associated with projects.

## Technologies Used

- **Node.js**: JavaScript runtime environment for server-side scripting.
- **Express**: Minimalist framework for building APIs.
- **Sequelize**: ORM for managing PostgreSQL databases.
- **PostgreSQL**: Relational database to store project and user information.
- **JWT**: JSON Web Token for secure authentication.

## Deployment

To deploy the application, follow these steps:

1. Set up the environment variables on your production server as described in the `.env` file.

2. Start the application in production mode:  
`npm start`

## Contributing

Contributions are welcome! If you would like to improve the project, please follow these steps:

1. Fork this repository.
2. Create a branch for your feature: `git checkout -b feature/my-new-feature`
3. Make your changes and commit them: `git commit -m 'Add a new feature'`
4. Push the branch: `git push origin feature/my-new-feature`
5. Open a pull request.
