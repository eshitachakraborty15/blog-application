import { useEffect, useState } from "react";
import {
  Save,
  X,
  Image,
  Video,
  FileText
} from "lucide-react";

import {
  countWords,
  MAX_WORDS,
  isValidMediaUrl
} from "../utils/helpers";

const initialForm = {
  title: "",
  content: "",
  imageUrl: "",
  videoUrl: ""
};

export default function BlogForm({
  editingBlog,
  onSubmit,
  onCancel,
  saving
}) {

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {

    if (editingBlog) {
      setForm({
        title: editingBlog.title || "",
        content: editingBlog.content || "",
        imageUrl: editingBlog.imageUrl || "",
        videoUrl: editingBlog.videoUrl || ""
      });
    } else {
      setForm(initialForm);
    }

    setError("");

  }, [editingBlog]);

  const wordCount = countWords(form.content);

  function handleChange(event) {

    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

    setError("");
  }

  async function handleSubmit(event) {

    event.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter a blog title.");
      return;
    }

    if (!form.content.trim()) {
      setError("Please enter blog content.");
      return;
    }

    if (wordCount > MAX_WORDS) {
      setError("Blog content cannot exceed 1000 words.");
      return;
    }

    if (!isValidMediaUrl(form.imageUrl)) {
      setError("Please enter a valid image URL.");
      return;
    }

    if (!isValidMediaUrl(form.videoUrl)) {
      setError("Please enter a valid video URL.");
      return;
    }

    const success = await onSubmit({
  title: form.title.trim(),
  content: form.content.trim(),
  imageUrl: form.imageUrl.trim(),
  videoUrl: form.videoUrl.trim()
});

if (success && !editingBlog) {
  setForm(initialForm);
}
  }

  return (
    <section className="form-panel" id="blog-form">

      <div className="form-heading">

        <div className="form-title-icon">
          <FileText size={21} />
        </div>

        <div>
          <h2>
            {editingBlog ? "Edit your blog" : "Create a blog"}
          </h2>

          <p>
            {editingBlog
              ? "Update your existing post."
              : "Share your thoughts with the world."}
          </p>
        </div>

        <button
          type="button"
          className="close-button"
          onClick={onCancel}
          aria-label="Close form"
        >
          <X size={19} />
        </button>

      </div>

      <form onSubmit={handleSubmit}>

        <label htmlFor="title">
          Blog title
        </label>

        <input
          id="title"
          name="title"
          type="text"
          placeholder="Enter your blog title"
          value={form.title}
          onChange={handleChange}
          maxLength={120}
          required
        />

        <div className="content-label">

          <label htmlFor="content">
            Blog content
          </label>

          <span
            className={
              wordCount > MAX_WORDS
                ? "word-count exceeded"
                : "word-count"
            }
          >
            {wordCount}/{MAX_WORDS} words
          </span>

        </div>

        <textarea
          id="content"
          name="content"
          placeholder="Write your blog here..."
          value={form.content}
          onChange={handleChange}
          rows={7}
          required
        />

        <div className="media-fields">

          <div>
            <label htmlFor="imageUrl">
              <Image size={15} />
              Image URL (optional)
            </label>

            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="videoUrl">
              <Video size={15} />
              Video URL (optional)
            </label>

            <input
              id="videoUrl"
              name="videoUrl"
              type="url"
              placeholder="YouTube or video URL"
              value={form.videoUrl}
              onChange={handleChange}
            />
          </div>

        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="form-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-button"
            disabled={saving || wordCount > MAX_WORDS}
          >
            <Save size={17} />

            {saving
              ? "Saving..."
              : editingBlog
                ? "Update Blog"
                : "Publish Blog"}
          </button>

        </div>

      </form>

    </section>
  );
}
