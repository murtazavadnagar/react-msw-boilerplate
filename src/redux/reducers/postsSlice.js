import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (data, { rejectWithValue }) => {
    try {
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (data, { rejectWithValue }) => {
    try {
      console.log("deletePost slice", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    deletedPosts: [],
    postsCount: 0,
    isLoading: false,
    isError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("fulfilled", action);
        state.posts = action.payload.posts;
        state.postsCount = action.payload.postsCount;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("fulfilled deletePost", action);
        const updateDeletedPosts = state.deletedPosts.filter(
          (post) => post.id !== action.payload.id
        );
        state.deletedPosts = [...updateDeletedPosts, action.payload];
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });
  },
});

export default postsSlice.reducer;
