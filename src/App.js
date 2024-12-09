import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

import { FETCH_POSTS, FETCH_USERS, DELETE_POST } from "./utils/queries";
import { fetchPosts, deletePost } from "./redux/reducers/postsSlice";
import { fetchUsers } from "./redux/reducers/usersSlice";
import { selectMergedPosts, selectPostsAreReady } from "./utils/selectors";
import moment from "moment";
import { debounce } from "lodash";

const App = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectMergedPosts);
  const postsAreReady = useSelector(selectPostsAreReady);
  const postsCount = useSelector((state) => state.posts.postsCount);
  const deletedPosts = useSelector((state) => state.posts.deletedPosts);

  const [onLoadData, setOnLoadData] = useState();
  const [page, setPage] = useState(1);
  const [limit, SetLimit] = useState(5);
  const [filter, setFilter] = useState("");
  const [deletingPostId, setDeletingPostId] = useState(null);

  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
  } = useQuery(FETCH_POSTS, {
    variables: { page, limit, filter },
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(FETCH_USERS, {
    variables: { page, limit },
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  const [
    deletingPost,
    { data: deletedData, loading: isDeleting, error: deleteError },
  ] = useMutation(DELETE_POST, {
    onCompleted: () => {
      console.log("onComplete Delete");
    },
    onError: (err) => {
      console.error("Delete post failed:", err);
    },
  });

  useEffect(() => {
    if (onLoadData !== undefined && !onLoadData) {
      handleFetchPosts();
    }
  }, [postsData]);

  useEffect(() => {
    if (deletedData) {
      dispatch(deletePost(deletedData?.deletePost)).then((action) => {
        if (action.type === "posts/deletePost/fulfilled") {
          console.log("posts deleted successfully");
          setDeletingPostId(null);
        }
        if (action.type === "posts/deletePost/rejected") {
          console.log("posts deleted rejected");
          setDeletingPostId(null);
        }
      });
    }
  }, [deletedData]);

  const handleFetchPosts = () => {
    if (postsData) {
      dispatch(fetchPosts(postsData)).then((action) => {
        if (action.type === "posts/fetchPosts/fulfilled") {
          console.log("posts store fulfilled");
          setTimeout(() => {
            handleFetchUsers();
          }, 2000);
        }
      });
    }
  };

  const handleFetchUsers = () => {
    if (usersData) {
      dispatch(fetchUsers(usersData)).then((action) => {
        if (action.type === "users/fetchUsers/fulfilled") {
          console.log("users store fulfilled");
        }
      });
    }
  };

  const handleDeletePost = (id) => {
    setDeletingPostId(id);
    setTimeout(() => {
      deletingPost({ variables: { postId: id } });
    }, 1000);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(1);
  };

  const delayfetchPosts = () => {
    setOnLoadData(true);
    // return new Promise((resolve, reject) => {
    setTimeout(() => {
      handleFetchPosts();
      setOnLoadData(false);
      // resolve(posts);
    }, 500);
    // });
  };

  return (
    <>
      <Stack
        direction="column"
        spacing={4}
        alignItems="center"
        justifyContent="center"
        margin={10}
      >
        {posts.length === 0 && (
          <Button
            variant="outlined"
            size="small"
            color="neutral"
            onClick={delayfetchPosts}
          >
            Click to Load
          </Button>
        )}
        {onLoadData && <CircularProgress />}
        {postsAreReady && posts?.length > 0 && (
          <>
            <Stack
              direction="column"
              spacing={4}
              alignItems="start"
              justifyContent="center"
              margin={2}
            >
              <Typography variant="h4">Posts</Typography>
              <TextField
                label="Filter by Title or Body"
                variant="outlined"
                value={filter}
                onChange={handleFilterChange}
                size="small"
              />
              <>
                <Stack
                  divider={<Divider flexItem />}
                  direction="column"
                  spacing={4}
                >
                  {posts?.map((post) => (
                    <Grid
                      container
                      spacing={2}
                      key={post.id}
                      sx={{
                        color:
                          post.deleted?.id === post.id && post.deleted.isDeleted
                            ? "grey"
                            : "inherit",
                      }}
                    >
                      <Grid size={12}>
                        <Typography variant="h6">{post.title}</Typography>
                        <Typography variant="caption">
                          Time to Read: {post.timeToRead} mins
                        </Typography>
                      </Grid>
                      <Grid size={12}>
                        <Typography variant="body1">{post.body}</Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography variant="body1">
                          Author:{" "}
                          {post.user ? (
                            <Typography variant="h6" component="span">
                              <span>{post.user.name}</span>{" "}
                              <span>{`(${post.user.company.name})`}</span>
                            </Typography>
                          ) : (
                            <span>-</span>
                          )}
                        </Typography>
                        <Typography variant="body1">
                          Date: {moment(post.createdAt).format("YYYY-MM-DD")}
                        </Typography>
                      </Grid>
                      <Grid size={6} sx={{ textAlign: "right" }}>
                        {post.deleted?.id === post.id &&
                          post.deleted.isDeleted &&
                          null}
                        {post.deleted?.id === post.id &&
                          !post.deleted.isDeleted && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                              }}
                            >
                              <WarningRoundedIcon />
                              <Typography variant="body2" sx={{ marginX: 1 }}>
                                Network Error
                              </Typography>
                              <Link
                                component="button"
                                variant="body2"
                                onClick={() => handleDeletePost(post.id)}
                                disabled={
                                  isDeleting && deletingPostId === post.id
                                }
                              >
                                {deletingPostId === post.id
                                  ? "Deleting..."
                                  : "Try again"}
                              </Link>
                            </Box>
                          )}
                        {post.deleted === null && (
                          <Button
                            onClick={() => handleDeletePost(post.id)}
                            disabled={isDeleting && deletingPostId === post.id}
                          >
                            {deletingPostId === post.id
                              ? "Deleting..."
                              : "Mark as Read"}
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  ))}
                </Stack>
              </>
              <Typography variant="h6" sx={{ alignSelf: "flex-end" }}>
                Total: {postsCount - deletedPosts.length} of {postsCount}
              </Typography>
            </Stack>
            <Pagination
              count={Math.round(postsCount / limit)}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </>
        )}
      </Stack>
    </>
  );
};

export default App;
