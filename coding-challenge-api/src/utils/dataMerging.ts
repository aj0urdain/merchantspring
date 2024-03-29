import { calculateDaysOverdue } from "./dateUtils";

/**
 * Merges additional store details into the orders data.
 *
 * @param orders An array of orders, each order being an object with order details.
 * @param stores A Map object where the key is the store ID and the value is an object of store details.
 * @returns An array of orders where each order is an object containing both order details and merged store details.
 */
export function mergeStoreDetails(
  orders: any[],
  stores: Map<number, any>
): any[] {
  return orders.map((order) => {
    // Retrieve store details using the store ID from the order.
    const storeDetails = stores.get(parseInt(order.storeId, 10));

    // If store details are found, merge them into the order, else log an error.
    if (storeDetails) {
      // Spread syntax (...) is used to create a new object with properties from both order and storeDetails.
      return { ...order, ...storeDetails };
    } else {
      // If no details are found for the storeId, log an error and return the original order object.
      console.error(`Store details not found for storeId: ${order.storeId}`);
      return order;
    }
  });
}
