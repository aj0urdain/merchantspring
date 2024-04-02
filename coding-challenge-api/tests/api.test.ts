import request from "supertest";
import { app } from "../src/index";
import { loadData } from "../src/startup/loadData";

/**
 * This test suite focuses on the `/sales` endpoint of the application,
 * ensuring that it behaves as expected under various scenarios, including
 * sorting and pagination.
 */
describe("/sales endpoint", () => {
  /**
   * Before running any tests, ensure the application data is loaded
   * successfully by invoking the `loadData` function.
   */
  beforeAll(async () => {
    await loadData();
  }, 30000); // Set timeout to 10 seconds for data loading

  /**
   * Tests whether the endpoint correctly returns paginated sales data
   * with the appropriate fields and types.
   */
  it("should return a list of paginated sales data with the correct fields and types", async () => {
    // Request sales data with specific pagination and sorting parameters
    const response = await request(app).get(
      "/sales?page=1&limit=10&sortDirection=desc"
    );
    // Verify the HTTP status code and the structure of the response data
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeLessThanOrEqual(10);
    // Further checks to ensure each order object has the expected fields
    response.body.data.forEach((order: any) => {
      expect(order).toMatchObject({
        marketplace: expect.any(String),
        orderId: expect.any(String),
        destination: expect.any(String),
        items: expect.any(Number),
        orderValue: expect.any(Number),
        daysOverdue: expect.any(Number),
        shopName: expect.any(String),
        country: expect.any(String),
      });
    });
  }, 10000); // Timeout for the test

  /**
   * Verifies that the data can be sorted correctly by the `daysOverdue` field
   * in both ascending and descending order based on the `sortDirection` query parameter.
   */
  it("should sort the data correctly when a sort query parameter is specified", async () => {
    // Testing ascending order sorting
    const ascResponse = await request(app).get(
      "/sales?page=1&limit=10&sortDirection=asc"
    );
    expect(ascResponse.statusCode).toBe(200);
    let prevDaysOverdue = -Infinity;
    ascResponse.body.data.forEach((order: any) => {
      expect(order.daysOverdue).toBeGreaterThanOrEqual(prevDaysOverdue);
      prevDaysOverdue = order.daysOverdue;
    });
    // Testing descending order sorting
    const descResponse = await request(app).get(
      "/sales?page=1&limit=10&sortDirection=desc"
    );
    expect(descResponse.statusCode).toBe(200);
    prevDaysOverdue = Infinity;
    descResponse.body.data.forEach((order: any) => {
      expect(order.daysOverdue).toBeLessThanOrEqual(prevDaysOverdue);
      prevDaysOverdue = order.daysOverdue;
    });
  }, 10000); // Timeout for the test

  /**
   * Confirms that the endpoint applies a default sorting behavior (descending, in this case)
   * when the `sortDirection` parameter is omitted from the request.
   */
  it("should apply default sorting when sortDirection is omitted", async () => {
    const response = await request(app).get("/sales?page=1&limit=10");
    expect(response.statusCode).toBe(200);
  }, 10000); // Timeout for the test

  /**
   * Ensures that the endpoint gracefully defaults to a standard sorting behavior
   * when presented with an unrecognized `sortDirection` value.
   */
  it("should apply default sorting when sortDirection is invalid", async () => {
    const response = await request(app).get(
      "/sales?page=1&limit=10&sortDirection=upwards"
    );
    expect(response.statusCode).toBe(200);
  }, 10000); // Timeout for the test
});
