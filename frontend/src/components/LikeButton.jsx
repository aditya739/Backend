import React from "react";
import api from "../services/api.jsx";
import { useAuth } from "../services/auth.jsx";

export default function LikeButton({ videoId, initialLikes = 0, initialDislikes = 0, userReaction = null }) {
  const { user } = useAuth();
  const [likes, setLikes] = React.useState(initialLikes);
  const [dislikes, setDislikes] = React.useState(initialDislikes);
  const [reaction, setReaction] = React.useState(userReaction);

  const handleReaction = async (type) => {
    if (!user) return alert("Please login to react");
    
    try {
      const newReaction = reaction === type ? null : type;
      const response = await api.post(`/videos/${videoId}/react`, { type: newReaction });
      
      // Update from server response
      const { likes: newLikes, dislikes: newDislikes, userReaction } = response.data.data;
      setLikes(Math.max(0, newLikes || 0));
      setDislikes(Math.max(0, newDislikes || 0));
      setReaction(userReaction);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to react");
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => handleReaction("like")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          reaction === "like" 
            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        <svg className="w-5 h-5" fill={reaction === "like" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 7v13m-3-4l-2-2m0 0l-2-2m2 2v6" />
        </svg>
        {likes}
      </button>
      <button
        onClick={() => handleReaction("dislike")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          reaction === "dislike" 
            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" 
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        <svg className="w-5 h-5" fill={reaction === "dislike" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L15 17V4m-3 4l2 2m0 0l2 2m-2-2v6" />
        </svg>
        {dislikes}
      </button>
    </div>
  );
}