
import {
  CalendarDays,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Video
} from "lucide-react";

import {
  formatDate,
  getYouTubeEmbedUrl
} from "../utils/helpers";

export default function BlogCard({
  blog,
  onEdit,
  onDelete
}) {

  const videoEmbed = getYouTubeEmbedUrl(blog.videoUrl);

  const isDirectVideo =
    blog.videoUrl &&
    /\.(mp4|webm|ogg)(\?.*)?$/i.test(blog.videoUrl);

  return (
    <article className="blog-card">

      {blog.imageUrl && (
        <div className="blog-image">

          <img
            src={blog.imageUrl}
            alt={blog.title}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

        </div>
      )}

      <div className="blog-card-body">

        <div className="blog-meta">

          <span className="blog-category">
            <ImageIcon size={13} />
            BLOG POST
          </span>

          <span className="blog-date">
            <CalendarDays size={13} />
            {formatDate(blog.createdAt)}
          </span>

        </div>

        <h3>{blog.title}</h3>

        <p className="blog-content">
          {blog.content}
        </p>

        {videoEmbed && (
          <div className="blog-video">

            <iframe
              src={videoEmbed}
              title={`Video for ${blog.title}`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />

          </div>
        )}

        {isDirectVideo && (
          <div className="blog-video">

            <video
              src={blog.videoUrl}
              controls
              preload="metadata"
            />

          </div>
        )}

        {blog.videoUrl && !videoEmbed && !isDirectVideo && (
          <a
            className="media-link"
            href={blog.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Video size={15} />
            Open video
          </a>
        )}

        <div className="blog-card-footer">

          <button
            className="edit-button"
            type="button"
            onClick={() => onEdit(blog)}
          >
            <Pencil size={15} />
            Edit
          </button>

          <button
            className="delete-button"
            type="button"
            onClick={() => onDelete(blog.id)}
          >
            <Trash2 size={15} />
            Delete
          </button>

        </div>

      </div>

    </article>
  );
}
