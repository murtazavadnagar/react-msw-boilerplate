import { createSelector } from "reselect";

const selectPosts = (state) => state.posts.posts;
const selectPostsLoading = (state) => state.posts.isLoading;
// const selectPostsError = (state) => state.posts.isError;

const selectUsers = (state) => state.users.users;
const selectUsersLoading = (state) => state.users.isLoading;
// const selectUsersError = (state) => state.users.isError;

const selectDeletedPosts = (state) => state.posts.deletedPosts;

export const selectMergedPosts = createSelector(
  [selectPosts, selectUsers, selectDeletedPosts],
  (posts, users, deletedPosts) => {
    const data = posts.map((post) => ({
      ...post,
      user: users.find((user) => user.id === post.userId) || null,
      deleted:
        deletedPosts.filter((deletedPost) => deletedPost.id === post.id)[0] ||
        null,
    }));
    return data;
  }
);

export const selectPostsAreReady = createSelector(
  [selectPostsLoading],
  (postsLoading) => !postsLoading
);

export const selectUsersAreReady = createSelector(
  [selectUsersLoading],
  (usersLoading) => !usersLoading
);
