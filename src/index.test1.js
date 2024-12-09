import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import { ApolloProvider, InMemoryCache } from "@apollo/client";
import { worker } from "./mocks/browser";

beforeAll(() => worker.start());
afterAll(() => worker.stop());

test("renders posts and handles button click", async () => {
  render(
    <ApolloProvider client={{ cache: new InMemoryCache() }}>
      <App />
    </ApolloProvider>
  );

  fireEvent.click(screen.getByText(/Click to Load/));

  await waitFor(() => screen.getByText(/Time to Read/));

  expect(screen.getByText(/Time to Read/)).toBeInTheDocument();
});
