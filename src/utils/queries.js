import { gql } from "@apollo/client";

export const FETCH_POSTS = gql`
  query posts($page: Int!, $limit: Int!, $filter: String!) {
    posts(page: $page, limit: $limit, filter: $filter) {
      id
      title
      body
      timeToRead
      createdAt
      userId
    }
    postsCount
  }
`;

export const FETCH_USERS = gql`
  query users($page: Int!, $limit: Int!) {
    users(page: $page, limit: $limit) {
      id
      name
      company {
        name
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(id: $postId) {
      id
      isDeleted
    }
  }
`;
