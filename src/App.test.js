import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";

// import renderWithProviders from "./utils/test-utils";
import { MockedProvider } from "@apollo/client/testing";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";
import { FETCH_POSTS, FETCH_USERS, DELETE_POST } from "./utils/queries";

// const mockStore = configureStore([]);

const mocks = [
  {
    request: {
      query: FETCH_POSTS,
      variables: { page: 1, limit: 5, filter: "" },
    },
    result: {
      data: {
        posts: [
          {
            id: "1",
            title: "Post 1",
            body: "Body of Post 1",
            userId: 1,
            timeToRead: 3,
            createdAt: "2024-12-09",
            user: { name: "User 1", company: { name: "Company 1" } },
            deleted: null,
          },
          {
            id: "2",
            title: "Post 2",
            userId: 2,
            body: "Body of Post 2",
            timeToRead: 5,
            createdAt: "2024-12-09",
            user: { name: "User 2", company: { name: "Company 2" } },
            deleted: null,
          },
        ],
        deletedPosts: [{ id: 2, isDeleted: true }],
        postsCount: 2,
      },
    },
  },
  {
    request: {
      query: FETCH_USERS,
      variables: { page: 1, limit: 5 },
    },
    result: {
      data: {
        users: [{ id: "1", name: "User 1", company: { name: "Company 1" } }],
      },
    },
  },
  {
    request: {
      query: DELETE_POST,
      variables: { postId: "1" },
    },
    result: {
      data: {
        deletePost: { id: "2" },
      },
    },
  },
];

describe("App", () => {
  beforeEach(() => {
    const mockDispatch = jest.fn();
    jest.mock("react-redux", () => ({
      useSelector: jest.fn(),
      useDispatch: () => mockDispatch,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Click to Load button should appear", async () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <App />
        </MockedProvider>
      </Provider>
    );

    expect(screen.getByText("Click to Load")).toBeInTheDocument();
  });

  it("Click to Load button renders posts", async () => {
    await act(async () =>
      render(
        <Provider store={store}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <App />
          </MockedProvider>
        </Provider>
      )
    );

    const button = await screen.findByText("Click to Load");
    expect(button).toBeInTheDocument();

    await waitFor(() => {
      fireEvent.click(button);
    });

    await waitFor(() => screen.getByText("Post 1"));
  });

  it("Click to Mark read button deletes posts", async () => {
    await act(async () =>
      render(
        <Provider store={store}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <App />
          </MockedProvider>
        </Provider>
      )
    );

    const buttons = screen.getAllByText("Mark as Read");
    const beforeDelete = expect(buttons.length).toBeGreaterThan(1);

    await waitFor(() => {
      fireEvent.click(buttons[1]);
    });

    const buttonsAfterDelete = screen.getAllByText("Mark as Read");
    const afterDelete = expect(buttons.length).toBeGreaterThan(1);

    afterDelete === buttonsAfterDelete - 1;
  });

  it("displays updated posts length based on input", async () => {
    await act(async () =>
      render(
        <Provider store={store}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <App />
          </MockedProvider>
        </Provider>
      )
    );

    const inputField = screen.getAllByLabelText("Filter by Title or Body");
    expect(inputField[0]).toHaveAttribute("value", "");
    fireEvent.change(inputField, { target: { value: "Post 1" } });

    await waitFor(() => {
      const displayedPosts = screen.getAllByText(/Post/);
      expect(displayedPosts.length).toBe(1);
      expect(displayedPosts[0]).toHaveTextContent("Post 1");
    });

    fireEvent.change(inputField, { target: { value: "" } });

    await waitFor(() => {
      const displayedPosts = screen.getAllByText(/Post/);
      expect(displayedPosts.length).toBe(2);
    });
  });
});
