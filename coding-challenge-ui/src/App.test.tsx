import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

// Wrap the App component with BrowserRouter in your tests
const renderWithRouter = (ui: React.ReactElement, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(ui, { wrapper: BrowserRouter });
};

test("renders app header", () => {
  const { getByText } = renderWithRouter(<App />);
  const headerText = getByText(/Analytics Dashboard/i);
  expect(headerText).toBeInTheDocument();
});

test("renders user name", () => {
  const { getByText } = renderWithRouter(<App />);
  const userNameDisplay = getByText(/Welcome, Guest!/i);
  expect(userNameDisplay).toBeInTheDocument();
});

test("renders overdue orders table", () => {
  const { getByText } = renderWithRouter(<App />);
  const tableHeaders = [
    "ID",
    "Marketplace",
    "Store",
    "Destination",
    "Items",
    "Value",
    "Days Overdue",
  ];
  tableHeaders.forEach((headerText) => {
    expect(getByText(headerText)).toBeInTheDocument();
  });
});
