import React from "react";

export default function YouTubeEmbed({ videoId, title = "YouTube video" }) {
  if (!videoId) return null;
  return (
    <div className="aspect-video w-full overflow-hidden rounded bg-black">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
