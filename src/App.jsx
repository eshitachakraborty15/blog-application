
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  BookOpen,
  Plus,
  Search,
  RefreshCw,
  PenLine
} from "lucide-react";

import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";

import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog
} from "./services/api";

function getErrorMessage(error) {
  if (error.code === "ECONNABORTED") {
    return "The request timed out. Please try again.";
  }

  if (!error.response) {
    return "Cannot connect to the server. Please check JSON Server.";
  }

  return error.response.data?.message ||
    "Something went wrong. Please try again.";
}

export default function App() {

  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingBlog, setEditingBlog] = useState(null);


  // FETCH BLOGS

  const fetchBlogs = useCallback(async () => {

    setLoading(true);
    setError("");

    try {

      const data = await getBlogs();

      if (!Array.isArray(data)) {
        throw new Error("Invalid blog data received.");
      }

      setBlogs(data);

    } catch (err) {

      setError(getErrorMessage(err));

    } finally {

      setLoading(false);

    }

  }, []);


  // FETCH DATA ON INITIAL RENDER

  useEffect(() => {

    fetchBlogs();

  }, [fetchBlogs]);


  // SEARCH BLOGS BY KEYWORD

  const filteredBlogs = useMemo(() => {

    const keyword = search.trim().toLowerCase();

    if (!keyword) return blogs;

    return blogs.filter((blog) => {

      const title = (blog.title || "").toLowerCase();

      const content = (blog.content || "").toLowerCase();

      return (
        title.includes(keyword) ||
        content.includes(keyword)
      );

    });

  }, [blogs, search]);


  // OPEN ADD BLOG FORM

  function openAddForm() {

    setEditingBlog(null);
    setShowForm(true);

    setError("");

  }


  // OPEN EDIT BLOG FORM

  function handleEdit(blog) {

    setEditingBlog(blog);
    setShowForm(true);

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  // CLOSE FORM

  function closeForm() {

    if (saving) return;

    setShowForm(false);
    setEditingBlog(null);

  }


  // CREATE OR UPDATE BLOG

  async function handleSubmit(blogData) {

    setSaving(true);
    setError("");

    try {

      if (editingBlog) {

        const updatedBlog = {

          ...blogData,

          createdAt: editingBlog.createdAt,

          updatedAt: new Date().toISOString()

        };

        const result = await updateBlog(
          editingBlog.id,
          updatedBlog
        );

        setBlogs((previous) =>
          previous.map((blog) =>
            String(blog.id) === String(editingBlog.id)
              ? result
              : blog
          )
        );

      } else {

        const newBlog = {

          ...blogData,

          createdAt: new Date().toISOString(),

          updatedAt: new Date().toISOString()

        };

        const result = await createBlog(newBlog);

        setBlogs((previous) => [
          result,
          ...previous
        ]);

      }

      setShowForm(false);
      setEditingBlog(null);

      return true;

    } catch (err) {

      setError(getErrorMessage(err));

      return false;

    } finally {

      setSaving(false);

    }

  }


  // DELETE BLOG

  async function handleDelete(id) {

    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmed) return;

    setError("");

    try {

      await deleteBlog(id);

      setBlogs((previous) =>
        previous.filter(
          (blog) => String(blog.id) !== String(id)
        )
      );

      if (
        editingBlog &&
        String(editingBlog.id) === String(id)
      ) {
        setShowForm(false);
        setEditingBlog(null);
      }

    } catch (err) {

      setError(getErrorMessage(err));

    }

  }


  return (

    <div className="app">

      {/* HEADER */}

      <header className="navbar">

        <a href="/" className="logo">

          <span className="logo-icon">
            <BookOpen size={22} />
          </span>

          BlogSpace

        </a>

        <span className="navbar-tagline">
          YOUR SPACE. YOUR STORIES.
        </span>

      </header>


      <main className="container">

        {/* HERO SECTION */}

        <section className="hero">

          <div className="hero-text">

            <span className="hero-label">
              <PenLine size={14} />
              SHARE YOUR IDEAS
            </span>

            <h1>
              Stories worth <span>sharing.</span>
            </h1>

            <p>
              Create, manage and explore your blog posts
              in one simple place.
            </p>

          </div>

          <div className="hero-decoration">
            <BookOpen size={90} strokeWidth={1} />
          </div>

        </section>


        {/* ACTION BAR */}

        <section className="toolbar">

          <div className="toolbar-title">

            <h2>Explore Blogs</h2>

            <span>
              {blogs.length} {blogs.length === 1 ? "post" : "posts"}
            </span>

          </div>

          <div className="toolbar-actions">

            <div className="search-box">

              <Search size={17} />

              <input
                type="search"
                placeholder="Search by keyword..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                aria-label="Search blogs by keyword"
              />

            </div>

            <button
              className="new-blog-button"
              type="button"
              onClick={openAddForm}
            >
              <Plus size={18} />
              New Blog
            </button>

          </div>

        </section>


        {/* FORM */}

        {showForm && (

          <BlogForm
            editingBlog={editingBlog}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            saving={saving}
          />

        )}


        {/* ERROR MESSAGE */}

        {error && (

          <div className="error-banner" role="alert">

            <span>{error}</span>

            <button
              type="button"
              onClick={fetchBlogs}
            >
              <RefreshCw size={15} />
              Retry
            </button>

          </div>

        )}


        {/* BLOG LIST */}

        <BlogList
          blogs={filteredBlogs}
          loading={loading}
          search={search}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />


      </main>


      {/* FOOTER */}

      <footer className="footer">

        <BookOpen size={17} />

        <span>
          BlogSpace — Write. Share. Inspire.
        </span>

        <span className="footer-year">
          © {new Date().getFullYear()}
        </span>

      </footer>

    </div>

  );

}
