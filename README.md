# NextJS Pusher Realtime Example

## Description
This project is a simple example of how to use Next.js and Pusher to achieve real-time WebSocket-like communication. It consists of a standard Next.js frontend and a simple backend that can be started with `npx ts-node index.ts`.

## Prerequisites
Before you begin, ensure you have met the following requirements:
- You have installed [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/).
- You have a basic understanding of JavaScript and TypeScript.

## Installation
To install nextjs-pusher-realtime-example, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/nextjs-pusher-realtime-example.git
   ```
2. Navigate to the project directory:
   ```bash
   cd nextjs-pusher-realtime-example
   ```
3. Install dependencies for both frontend and backend:
   ```bash
   npm install
   ```

## Setting Up Environment Variables
1. Create an account on [Pusher](https://pusher.com/) and obtain your credentials.
2. Set up your environment variables by creating a `.env` file in both the frontend and backend directories with your Pusher credentials.

## Running the Application
1. Start the backend server:
   ```bash
   npx ts-node index.ts
   ```
2. In a separate terminal, start the Next.js frontend:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:3000`.

## Usage
After starting the application, you can test the real-time functionality:
1. Go to `http://localhost:3000`.
2. Press the button on the page to see real-time communication in action.

## Contributing
Contributions to the nextjs-pusher-realtime-example are welcome. If you have a suggestion that would improve this project, please fork the repo and create a pull request.

## License
This project is licensed under the [MIT License](LICENSE).
