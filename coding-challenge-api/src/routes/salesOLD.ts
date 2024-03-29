import { Request, Response } from "express";
import { sortedOrders } from "../utils/dataStore";

/**
 * Handles requests to the `/sales` endpoint, providing sorted and paginated sales data.
 * The sort order can be specified in the request, allowing dynamic sorting based on request parameters.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 */
export async function getSales(req: Request, res: Response): Promise<void> {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const sortOrder: "asc" | "desc" =
    req.query.sortDirection === "asc" ? "asc" : "desc";

  // Perform sorting based on the request. Clone sortedOrders to avoid mutating the original array.
  let ordersToServe = [...sortedOrders];
  if (sortOrder === "asc") {
    ordersToServe.sort((a, b) => a.daysOverdue - b.daysOverdue);
  } else {
    ordersToServe.sort((a, b) => b.daysOverdue - a.daysOverdue);
  }

  // Calculate start and end indexes for pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedData = ordersToServe.slice(startIndex, endIndex);

  res.json({
    data: paginatedData,
    currentPage: page,
    totalPages: Math.ceil(ordersToServe.length / limit),
    more: endIndex < ordersToServe.length,
  });
}
