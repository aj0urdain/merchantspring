import path from "path";
import { loadAndMergeOrders } from "../utils/csvUtils";

/**
 * An in-memory storage to keep the sorted and processed orders.
 */
export let sortedOrders: any[] | null = null;

/**
 * The `loadData` function is responsible for initializing the application's data by reading,
 * processing, and sorting the orders from the CSV files.
 * It utilizes the `loadAndMergeOrders` utility function to accomplish this.
 *
 * @async
 * @function loadData
 * @returns {Promise<void>} A promise that resolves when the data has been loaded and processed successfully.
 */
export async function loadData(): Promise<void> {
  try {
    // Define the path to the CSV files
    const ordersPath = path.join(__dirname, "../../data/orders.csv.gz");
    const storesPath = path.join(__dirname, "../../data/stores.csv");

    // Load and merge the order and store data
    sortedOrders = await loadAndMergeOrders(ordersPath, storesPath);

    // Log a confirmation once the data is loaded and processed
    console.log("Data loaded and processed successfully.");
  } catch (error) {
    // Log and re-throw the error for higher-level error handling
    console.error("Error loading data:", error);
    throw error;
  }
}
