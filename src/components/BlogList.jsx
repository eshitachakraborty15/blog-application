
import BlogCard from "./BlogCard";

export default function BlogList({
  blogs,
  loading,
  search,
  onEdit,
  onDelete
}) {

  if (loading) {

    return (
      <div className="state-message">

        <div className="loader"></div>

        <h3>Loading blogs...</h3>

        <p>Please wait while we fetch your posts.</p>

      </div>
    );

  }

  if (blogs.length === 0) {

    return (
      <div className="state-message">

        <div className="empty-icon">✍️</div>

        <h3>
          {search
            ? "No matching blogs found"
            : "No blogs available"}
        </h3>

        <p>
          {search
            ? "Try searching with another keyword."
            : "Be the first to publish a blog post!"}
        </p>

      </div>
    );

  }

  return (
    <div className="blog-grid">

      {blogs.map((blog) => (

        <BlogCard
          key={blog.id}
          blog={blog}
          onEdit={onEdit}
          onDelete={onDelete}
        />

      ))}

    </div>
  );
}
