import { graphql, HttpResponse } from "msw";
import { posts, users } from "../utils/services";
import { randomDate } from "../utils/collections";

export const handlers = [
  graphql.query("posts", async (req) => {
    const { page, limit, filter } = req.variables;
    const data = await posts(page, limit, filter);
    const postsList = data.paginatedPosts.map((post) => ({
      ...post,
      timeToRead: Math.ceil(post.body.length / 60),
      createdAt: randomDate(
        new Date(2020, 0, 1),
        new Date(),
        0,
        24
      ).toISOString(),
    }));
    return HttpResponse.json({
      data: {
        posts: postsList,
        postsCount: data.postsCount,
      },
    });
  }),

  graphql.query("users", async (req) => {
    const { page = 1, limit = 5 } = req.variables;
    const data = await users(page, limit);
    return HttpResponse.json({
      data: {
        users: data,
      },
    });
  }),

  graphql.mutation("deletePost", (req) => {
    return HttpResponse.json({
      data: {
        deletePost: {
          id: req.variables.postId,
          isDeleted: Math.random() < 0.5,
        },
      },
    });
  }),
];
