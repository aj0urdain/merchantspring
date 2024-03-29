import express, { Application } from "express";
import cors from "cors";
import { loadData } from "./startup/loadData"; // Load and merge orders data
import { getUser } from "./routes/user"; // User route handler
import { getSales } from "./routes/sales"; // Sales route handler

/**
 * Initializes the Express application and loads necessary data for the API.
 * This setup includes middleware configurations and route definitions. The
 * application's data is preloaded and processed asynchronously before the
 * server starts listening for requests.
 */
const app: Application = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

// Middleware to enable CORS for all routes, allowing cross-origin requests.
app.use(cors());

/**
 * Asynchronously initializes the application by loading and processing data.
 * On successful data loading, the server starts and is ready to accept requests.
 * If data loading fails, the process exits with an error.
 */
async function initializeApp(): Promise<void> {
  try {
    await loadData(); // Load and process data asynchronously
    console.log(
      "Data processing complete, server is ready to handle requests."
    );
  } catch (error) {
    console.error("Failed to initialize data:", error);
    process.exit(1); // Exit the process on initialization failure
  }
}

// Define route handlers for the application
app.get("/user", getUser); // Route for user-related requests
app.get("/sales", getSales); // Route for sales-related requests

// Initialize the application and start listening on the specified port
initializeApp().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});

// Export the Express application for testing purposes
export { app };
