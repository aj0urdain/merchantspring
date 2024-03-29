/**
 * Calculates the number of days overdue based on the latest shipping date.
 * @param latestShipDate - The latest date by which the order should have been shipped, in DD/MM/YYYY format.
 * @returns The number of days the order is overdue. A positive number indicates the number of days overdue,
 * while a negative number indicates the number of days until the order is due.
 */
export function calculateDaysOverdue(latestShipDate: string): number {
  // Split the date by "/" to extract day, month, and year components.
  const parts = latestShipDate.split("/");

  // Reformat the date to YYYY-MM-DD format which is accepted by Date constructor in JavaScript.
  const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

  // Create a new Date object for the latest shipping date.
  const latestDate = new Date(formattedDate);

  // Get the current date for comparison.
  const currentDate = new Date();

  // Calculate the difference in time between the current date and the latest shipping date.
  // Then convert the time from milliseconds to days and round up to the nearest whole number.
  return Math.ceil(
    (currentDate.getTime() - latestDate.getTime()) / (1000 * 3600 * 24)
  );
}
