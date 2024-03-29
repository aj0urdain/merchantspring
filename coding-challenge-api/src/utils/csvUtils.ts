import fs from "fs";
import zlib from "zlib";
import csv from "csv-parser";
import { calculateDaysOverdue } from "./dateUtils";

/**
 * Interface representing the details of a store.
 */
interface StoreDetails {
  marketplace: string;
  country: string;
  shopName: string;
}

/**
 * Interface representing an order with its store details merged.
 */
interface Order {
  marketplace: string;
  country: string;
  shopName: string;
  orderId: string;
  destination: string;
  items: number;
  orderValue: number;
  daysOverdue: number;
}

/**
 * Asynchronously loads store details from a CSV file and stores them in a map for quick lookup.
 *
 * @param storesFilePath - The path to the CSV file containing store details.
 * @returns A promise that resolves to a map with the storeId as the key and store details as the value.
 */
async function loadStores(
  storesFilePath: string
): Promise<Map<number, StoreDetails>> {
  return new Promise((resolve, reject) => {
    const storesMap = new Map<number, StoreDetails>();
    fs.createReadStream(storesFilePath)
      .pipe(csv())
      .on("data", (store) => {
        const { storeId, marketplace, country, shopName } = store;
        storesMap.set(parseInt(storeId, 10), {
          marketplace,
          country,
          shopName: shopName.trim(),
        });
      })
      .on("end", () => resolve(storesMap))
      .on("error", (error) => reject(error));
  });
}

/**
 * Loads and processes orders from a gzipped CSV file. This function filters orders by 'Pending' status,
 * calculates days overdue for each order, and merges them with store details from the provided stores map.
 *
 * @param ordersPath - The path to the gzipped CSV file containing orders data.
 * @param storesPath - The path to the CSV file containing store details.
 * @returns A promise that resolves to an array of Order objects with store details merged.
 */
export async function loadAndMergeOrders(
  ordersPath: string,
  storesPath: string
): Promise<Order[]> {
  const storesMap = await loadStores(storesPath);
  return new Promise((resolve, reject) => {
    const orders: Order[] = [];

    fs.createReadStream(ordersPath)
      .pipe(zlib.createGunzip())
      .pipe(csv())
      .on("data", (row) => {
        if (row.shipment_status !== "Pending") {
          // Skip non-Pending orders
          return;
        }

        const daysOverdue = calculateDaysOverdue(row.latest_ship_date);
        const storeDetails = storesMap.get(parseInt(row.storeId));
        if (!storeDetails) {
          // Skip if no corresponding store details are found
          return;
        }

        // Push processed order into the orders array
        orders.push({
          marketplace: storeDetails.marketplace,
          country: storeDetails.country,
          shopName: storeDetails.shopName,
          orderId: row.orderId,
          destination: row.destination,
          items: parseInt(row.items, 10),
          orderValue: parseFloat(row.orderValue),
          daysOverdue: daysOverdue,
        });
      })
      .on("end", () => resolve(orders)) // Resolve the promise with the processed orders array
      .on("error", (error) => reject(error)); // Reject the promise if an error occurs
  });
}
