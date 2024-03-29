import { Request, Response } from "express";

/**
 * Responds with the details of a predefined user.
 *
 * This endpoint is a simplified example for demonstration purposes.
 *
 * @param req The HTTP request object. Not used in this function, but
 *            included to adhere to Express's middleware signature.
 * @param res The HTTP response object used to return the user data.
 */
export function getUser(req: Request, res: Response): void {
  // Predefined user data
  const userData = {
    firstName: "Jane",
    lastName: "Doe",
    email: "janedoe@email.com",
    id: 1,
  };

  // Sends the JSON response containing the user data.
  res.json(userData);
}
