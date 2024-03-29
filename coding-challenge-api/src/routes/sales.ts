import { Request, Response } from "express";
import { sortedOrders } from "../startup/loadData";

/**
 * The `getSales` function handles the '/sales' route requests by providing a paginated,
 * sorted list of sales data. It utilizes query parameters from the request to determine the
 * page number, limit of items per page, and the direction of sorting based on days overdue.
 *
 * @param {Request} req - The request object from Express, containing query parameters.
 * @param {Response} res - The response object from Express, used to return the data or errors.
 */
export const getSales = (req: Request, res: Response) => {
  // Parse query parameters for pagination and sorting
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;
  const sortDirection: "asc" | "desc" =
    req.query.sortDirection === "asc" ? "asc" : "desc";

  // Check if the sales data has been loaded into memory
  if (!sortedOrders) {
    // Log the absence of data and respond with a server error status code
    console.log(`Sales data is not available.`);
    return res.status(500).send("Server error: Sales data is not available.");
  }

  // Clone the sortedOrders array to avoid mutating the original data during sorting
  const sortedData = [...sortedOrders].sort((a, b) => {
    // Compare function for sorting based on the `sortDirection` parameter
    return sortDirection === "asc"
      ? a.daysOverdue - b.daysOverdue
      : b.daysOverdue - a.daysOverdue;
  });

  // Calculate the indices for slicing the data array to achieve pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  // Slice the sorted data array to obtain the current page's data
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Respond with the paginated data, current page, total number of pages, and a flag for more data
  res.json({
    data: paginatedData,
    currentPage: page,
    totalPages: Math.ceil(sortedData.length / limit),
    more: endIndex < sortedData.length,
  });
};
