import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store as setupStore } from "../redux/store";

// export function renderWithProviders(ui, extendedRenderOptions = {}) {
//   const {
//     preloadedState = {
//       // posts: {
//       //   mergedPosts: [
//       //     {
//       //       id: "1",
//       //       title: "Post 1",
//       //       body: "Body of Post 1",
//       //       timeToRead: 3,
//       //       createdAt: "2024-12-09",
//       //       user: { name: "User 1", company: { name: "Company 1" } },
//       //       deleted: null,
//       //     },
//       //   ],
//       //   postsAreReady: true,
//       //   postsCount: 1,
//       // },
//       // users: {
//       //   users: [{ id: "1", name: "User 1", company: { name: "Company 1" } }],
//       // },
//     },
//     store = setupStore,
//     ...renderOptions
//   } = extendedRenderOptions;

//   const Wrapper = ({ children }) => (
//     <Provider store={store}>{children}</Provider>
//   );

//   return {
//     store,
//     ...render(ui, { wrapper: Wrapper, ...renderOptions }),
//   };
// }

export function renderWithProviders(
  ui,
  { preloadedState = {}, store = setupStore, ...renderOptions } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
