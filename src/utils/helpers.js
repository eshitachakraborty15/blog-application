
export const MAX_WORDS = 1000;

// Count words in blog content
export function countWords(text) {
  const trimmed = text.trim();

  if (!trimmed) return 0;

  return trimmed.split(/\s+/).length;
}

// Format blog date
export function formatDate(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

// Convert YouTube URLs into embed URLs
export function getYouTubeEmbedUrl(value) {
  if (!value) return null;

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" &&
        url.protocol !== "http:") {
      return null;
    }

    let videoId = null;

    if (url.hostname === "youtu.be") {
      videoId = url.pathname.slice(1);
    }

    if (
      url.hostname === "www.youtube.com" ||
      url.hostname === "youtube.com" ||
      url.hostname === "m.youtube.com"
    ) {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v");
      } else if (url.pathname.startsWith("/embed/")) {
        videoId = url.pathname.split("/")[2];
      }
    }

    if (!videoId || !/^[\w-]{11}$/.test(videoId)) {
      return null;
    }

    return `https://www.youtube-nocookie.com/embed/${videoId}`;

  } catch {
    return null;
  }
}

// Validate optional media URLs
export function isValidMediaUrl(value) {
  if (!value.trim()) return true;

  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" ||
      url.protocol === "http:"
    );

  } catch {
    return false;
  }
}
