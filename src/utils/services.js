export const posts = async (page, limit, filter) => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await res.json();
  const filteredPosts = data?.filter(
    (post) =>
      post.title.toLowerCase().includes(filter.toLowerCase()) ||
      post.body.toLowerCase().includes(filter.toLowerCase())
  );
  // console.log("filteredPosts", filteredPosts);
  const startIndex = (page - 1) * limit;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit);
  return { paginatedPosts, postsCount: filteredPosts.length };
};

export const users = async (page, limit) => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await res.json();
  // console.log("users", data);
  return data;
};
