# ![typio - typing battles & practice](./public/assets/typ-io.ico) typio - typing battles & practice

## About

#### This is a typing game where you can practice your typing skills and compete with other players. This is built with socket.io, EJS, Express, Node.js.

- 1.0 : The game is now live! You can play it [here](https://typio.herokuapp.com/). It features a typing battle mode where you can compete with other players. You can also practice your typing skills in the practice mode. The game is still in development and more features will be added in the future.
- 2.0 : Users, their scores, their games and their typing speed are stored in a database, which is used to rank the players.

## Authors

#### Developers

- [@jassuwu](https://www.github.com/jassuwu)
- [@en3rypt](https://www.github.com/en3rypt)

#### 2.0 Contributors

- [@shriram-17](https://www.github.com/shriram-17)

## Features

- Typing battles
- Typing practice
- Leaderboard
- User profiles

This repo is functionality complete — PRs and issues welcome!

# Getting started

To get the Node server running locally:

- Clone this repo
- `npm install` to install all required dependencies
- This app uses FaunaDB as a database. You will need to create a free account and create a database. You can find the instructions [here](https://docs.fauna.com/fauna/current/start/cloud).
- Create a `.env` file in the root directory and add the following:
  - `TYPIO_SECRET=YOUR_FAUNADB_SECRET`
  - `TYPIO_QUOTES_SECRET=YOUR_QUOTE_API_SECRET`
  - `TYPIO_USERS_SECRET=YOUR_USERS_API_SECRET`
  - `SESSION_SECRET=YOUR_SESSION_SECRET`
  - `JWT_SECRET=YOUR_JWT_SECRET`

Alternately, to quickly try out this repo in the cloud, you can click on => [![typio - typing battles & practice](./public/assets/typ-io.ico)](https://typ-io.herokuapp.com/)

# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [express-jwt](https://github.com/auth0/express-jwt) - Middleware for validating JWTs for authentication
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [faunadb](https://github.com/fauna/faunadb-js) - For driving the faunadb client with javascript

## Application Structure

- `index.js` - The entry point to our application. This file defines our express server. It also requires the routes and sockets we'll be using in the application.
- `db.js` - This file contains the functions for interacting with the database.
- `public/` - This folder contains all the frontend assets, scripts, etc..
- `src/routes/` - This folder contains the route definitions for our API.
- `src/middleware` - This folder contains the middleware used in the app.
- `src/utils` - This folder contains the utility/helper function definitions for our API.
- `views/` - This folder contains the view templates that are rendered by our routes.
