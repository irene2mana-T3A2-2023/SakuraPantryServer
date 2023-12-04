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

Runs ESLint to check for code issues in the `src` directory.\
It helps in maintaining code quality and consistency.

### `npm run lint:fix`

Automatically fixes fixable issues and suppresses output for warnings.

### `npm run format`

Uses [Prettier](https://www.npmjs.com/package/prettier) to format the JavaScript files in the src directory, ensuring a consistent code style across the project.

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

## Server Dependencies

### `cors`  

Acts as middleware for Express, enabling Cross-Origin Resource Sharing (CORS).\
CORS is crucial for web application security, as it regulates how a web application can make requests to different domains, ensuring controlled and secure interaction with external resources.

### `dotenv`

Facilitates the management of environment variables. By separating configuration from code, it enhances security and flexibility, especially crucial for handling sensitive data like API keys and database credentials.

### `express`

A fast, unopinionated, minimalist web framework for Node.js, perfectly suited for efficiently building web applications and APIs without unnecessary complexity.
