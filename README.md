# T3A2 Full Stack App (Server)

## Sakura Pantry - Japanese Online Grocery Store

### Resources

- [Production site](https://www.google.com.au/)
- [Front-end repo](https://github.com/irene2mana-T3A2-2023/SakuraPantryClient)
- [Documentation repo](https://github.com/irene2mana-T3A2-2023/SakuraPantryDocs)
- [Trello board](https://trello.com/b/TE5Q9ZYj/t3a2-%F0%9F%8C%B8sakura-pantry)

### Contributors

- [Mana Misumi](https://github.com/Mana12011207)
- [Irene Nguyen](https://github.com/irenenguyen1017)
- [Ellen Pham](https://github.com/ellenpham)

## Available Scripts

In the project directory, you can run:

### `npm start`

Launches the server in production mode.\
It sets the `NODE_ENV` environment variable to `production` and starts the application using the main index.js file.

### `npm run dev`

Launches the server in development mode.\
It uses nodemon for automatic restarting upon file changes and sets `NODE_ENV` to `development`.

### `npm run lint`

Runs [ESLint](https://eslint.org/) to check for code issues in the `src` directory.\
It helps in maintaining code quality and consistency.

### `npm run lint:fix`

Automatically fixes fixable issues and suppresses output for warnings.

### `npm run format`

Uses [Prettier](https://prettier.io/) to format the JavaScript files in the src directory, ensuring a consistent code style across the project.

## Server Dependencies

### `bcryptjs`

Used for hashing passwords securely. It protects user data by converting plain text passwords into hashed formats before database storage, enhancing security against data breaches.

### `cors`

Acts as middleware for Express, enabling Cross-Origin Resource Sharing (CORS).\
CORS is crucial for web application security, as it regulates how a web application can make requests to different domains, ensuring controlled and secure interaction with external resources.

### `dotenv`

Facilitates the management of environment variables. By separating configuration from code, it enhances security and flexibility, especially crucial for handling sensitive data like API keys and database credentials.

### `express`

A fast, unopinionated, minimalist web framework for Node.js, perfectly suited for efficiently building web applications and APIs without unnecessary complexity.

### `mongoose`

An Object Data Modelling (ODM) library for MongoDB and Node.js. It provides a straightforward, schema-based solution to model your application data and interact with MongoDB databases using JavaScript or TypeScript.

### `joi`

Joi is a comprehensive schema description language and validator for JavaScript. In our project, it is specifically utilized for validating environment variables. This ensures that our application's configuration adheres to expected formats and standards, providing an additional layer of security and reliability by preventing misconfiguration and potential runtime errors.

### `jsonwebtoken`

Implements JSON Web Tokens (JWT) for secure information transmission as JSON objects. Primarily used for user authentication and session management, it issues a JWT upon login, which authenticates further server requests, verifying user identity.

## Server Development Dependencies

Our project uses a variety of development tools to streamline the development process and ensure code quality. Below is a list of the development dependencies specified in our `package.json` file:

### `cross-env`

Enables consistent use of environment variables across different operating systems, essential for scripts to work smoothly on both Windows and Unix-like environments.

### `eslint`

A static code analysis tool that helps identify and fix patterns in JavaScript code, enhancing consistency and preventing bugs.

### `eslint-config-prettier`

Disables all ESLint rules that conflict with Prettier, ensuring seamless integration of ESLint with Prettier for code formatting.

### `nodemon`

A utility that monitors for any changes in your source code and automatically restarts your server, enhancing the development experience.

### `prettier`

An opinionated code formatter that supports multiple languages and integrates with most editors to ensure consistent code style across the project.

## API Endpoints
### Products
| Method | Routes          | Functionalities                         | Access | 
| ------ | --------------- | --------------------------------------- | ------------- | 
| GET    | /api/products      | Get a list of all products              | Public          | 
| GET    | /api/products/:slug | Get details of specific product by slug | Public          | 
| POST   | /api/products      | Create a new product                    | Private         | 
| PATCH  | /api/products/:slug | Update a specific product by slug       | Private          | 
| DELETE | /api/products/:slug | Delete a specific product by slug       | Private          | 

### Categories
| Method | Routes            | Functionalities                    | Access | 
| ------ | ----------------- | ---------------------------------- | ------------- | 
| GET    | /api/categories       | Get a list of all categories       | Public          | 
| POST   | /api/categories       | Create a new categories            | Private          | 
| PATCH  | /api/categories/:slug | Update a specific category by slug | Private          | 
| DELETE | /api/categories/:slug | Delete a specific category by slug | Private          | 

### Orders
| Method | Routes                  | Functionalities                                  | Access              | 
| ------ | ----------------------- | ------------------------------------------------ | -------------------------- | 
| GET    | /api/orders                 | Get a list of all orders                         | Private                       | 
| POST   | /api/orders                 | Create a new order                               | Private          | 
| GET    | /api/orders/:orderId        | Get a specific order by orderId                  | Private  | 
| PATCH  | /api/orders/status/:orderId | Update the status of a specific order by orderId | Private                       | 

### Authentication
| Method | Routes            | Functionalities   | Access  | 
| ------ | ----------------- | ----------------- | ------- | 
| POST   | /api/auth/register | Create an account | Private | 
|        |                   |                   |         | 
|        |                   |                   |         | 
|        |                   |                   |         | 
=======

