import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./reducers/postsSlice";
import usersReducer from "./reducers/usersSlice";

const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
  },
});

export default store;
