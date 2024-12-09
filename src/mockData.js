export const mockData = {
  posts: [
    {
      id: 1,
      title: "Test Post 1",
      body: "This is a test post body",
      timeToRead: 5,
      createdAt: "2024-01-01T00:00:00Z",
      userId: 1,
    },
    {
      id: 2,
      title: "Test Post 2",
      body: "This is another test post body",
      timeToRead: 3,
      createdAt: "2024-01-02T00:00:00Z",
      userId: 2,
    },
  ],
  postsCount: 2,
  users: [
    { id: 1, name: "User One", company: { name: "Company A" } },
    { id: 2, name: "User Two", company: { name: "Company B" } },
  ],
};
