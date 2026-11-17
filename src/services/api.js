
import axios from "axios";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:3001"
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Fetch all blogs
export const getBlogs = async () => {
  const response = await api.get("/blogs");
  return response.data;
};

// Fetch a single blog
export const getBlogById = async (id) => {
  const response = await api.get(
    `/blogs/${encodeURIComponent(id)}`
  );

  return response.data;
};

// Create a blog
export const createBlog = async (blog) => {
  const response = await api.post("/blogs", blog);
  return response.data;
};

// Update a blog
export const updateBlog = async (id, blog) => {
  const response = await api.put(
    `/blogs/${encodeURIComponent(id)}`,
    blog
  );

  return response.data;
};

// Delete a blog
export const deleteBlog = async (id) => {
  const response = await api.delete(
    `/blogs/${encodeURIComponent(id)}`
  );

  return response.data;
};
