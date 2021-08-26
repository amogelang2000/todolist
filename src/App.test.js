import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import mockData from "./mockData";

/**
 * calls the beforeEach function and passing in a callback function.
 * imports mockData object from the mockData.js file.
 * imports the App component from the App.js file.
 */
beforeEach(() => {
  fetchMock.once([JSON.stringify(mockData)]);
});

/**
 * await to see if loading is removed from screen and then checks if "My Todo List" appears on screen
 */
test("renders app", async () => {
  render(<App />);

  await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
  expect(screen.getByText(/My Todo List/i)).toBeInTheDocument();
});

/**
 * mocks the fetch call to the API.
 *to  check if the added todo item is appearing on the list.
 */
test("should add a TODO item", async () => {
  fetchMock.once(
    JSON.stringify({
      userId: 3,
      id: Math.floor(Math.random() * 100) + 1,
      title: "Do math homework",
      completed: false,
    })
  );

  render(<App />);
  await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

  userEvent.type(screen.getByRole("textbox"), "Do math homework");
  userEvent.click(screen.getByText(/Add new todo/i));
  await waitForElementToBeRemoved(() => screen.getByText(/saving/i));
  expect(screen.getByText(/Do math homework/i)).toBeInTheDocument();
});

/**
 * waits for the loading message to disappear.
 * when user clicks the checkbox for the first todo item.
 * It expect first item to be crossed out
 */
test("item to be crossed out after completing", async () => {
  render(<App />);

  await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
  userEvent.click(screen.getByTestId("checkbox-1"));
  expect(screen.getByText(/eat breakfast/i)).toHaveClass("completed");
});

/**
 *   waits for the todo item to be removed from the DOM after user clicks on delete.
 *  confirms that the todo item is no longer in the DOM.
 */
test("item to be removed after deleting", async () => {
  render(<App />);

  await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
  userEvent.click(screen.getByTestId("close-btn-3"));
  expect(screen.queryByText(/Take out the trash/i)).not.toBeInTheDocument();
});
