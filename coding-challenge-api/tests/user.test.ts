import { getUser } from "../src/routes/user";

/**
 * Tests the `getUser` function to ensure it correctly returns
 * the expected user details in the response.
 */
test("getUser returns user details", () => {
  // Mock the response object, including the json method which should be called by getUser
  const res = {
    json: jest.fn(),
  };
  // Call getUser with a mocked response object and a null request object (not used in getUser)
  getUser(null as any, res as any);

  // Verify that res.json was called with the correct user details
  expect(res.json).toHaveBeenCalledWith({
    firstName: "Jane",
    lastName: "Doe",
    email: "janedoe@email.com",
    id: 1,
  });
});
