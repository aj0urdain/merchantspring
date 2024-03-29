import fs from "fs";
import zlib from "zlib";
import csv from "csv-parser";
import { calculateDaysOverdue } from "./dateUtils";

/**
 * Asynchronously loads store details from a CSV file into a Map for quick access.
 * @param {string} storesFilePath - The file path to the stores CSV file.
 * @returns {Promise<Map<number, any>>} - A promise that resolves to a map with storeId as key and store details as value.
 */
async function loadStores(storesFilePath: string): Promise<Map<number, any>> {
  return new Promise((resolve, reject) => {
    const storesMap = new Map<number, any>();
    fs.createReadStream(storesFilePath)
      .pipe(csv())
      .on("data", (store) => {
        storesMap.set(parseInt(store.storeId, 10), store);
      })
      .on("end", () => resolve(storesMap))
      .on("error", (error) => reject(error));
  });
}

/**
 * Loads and merges order data with store details. It filters out non-pending orders
 * and calculates days overdue for each pending order before merging with store details.
 * @param {string} ordersPath - The file path to the gzipped orders CSV file.
 * @param {string} storesPath - The file path to the stores CSV file.
 * @returns {Promise<any[]>} - A promise that resolves to an array of merged order data.
 */
export async function loadAndMergeOrders(
  ordersPath: string,
  storesPath: string
): Promise<any[]> {
  const storesMap = await loadStores(storesPath);
  return new Promise((resolve, reject) => {
    const orders: any[] = [];

    fs.createReadStream(ordersPath)
      .pipe(zlib.createGunzip())
      .pipe(csv())
      .on("data", (row) => {
        if (row.shipment_status === "Pending") {
          const daysOverdue = calculateDaysOverdue(row.latest_ship_date);
          const storeDetails = storesMap.get(parseInt(row.storeId));
          if (storeDetails) {
            const {
              storeId,
              latest_ship_date,
              shipment_status,
              ...restStoreDetails
            } = storeDetails;
            orders.push({
              marketplace: restStoreDetails.marketplace,
              country: restStoreDetails.country,
              shopName: restStoreDetails.shopName.trim(),
              orderId: row.orderId,
              destination: row.destination,
              items: row.items,
              orderValue: row.orderValue,
              daysOverdue,
            });
          }
        }
      })
      .on("end", () => resolve(orders))
      .on("error", (error) => reject(error));
  });
}
