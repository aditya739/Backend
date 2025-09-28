// src/components/Comments.jsx
import React from "react";
import api from "../services/api.jsx";
import { useAuth } from "../services/auth.jsx";

export default function Comments({ videoId }) {
  const [comments, setComments] = React.useState([]);
  const [text, setText] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [posting, setPosting] = React.useState(false);
  const [error, setError] = React.useState("");
  const { user } = useAuth();

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/comments/${videoId}`);
        const arr = res?.data?.comments ?? res?.comments ?? res ?? [];
        if (mounted) setComments(Array.isArray(arr) ? arr : []);
      } catch (e) {
        console.error(e);
        if (mounted) setError(e?.message || "Unable to fetch comments.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [videoId]);

  const submit = async () => {
    if (!user) return alert("Please login to comment");
    const content = (text || "").trim();
    if (!content) return;

    setPosting(true);
    try {
      const res = await api.post(`/comments/${videoId}`, { text: content });
      const posted = res?.data ?? res;
      setComments(prev => [posted, ...prev]);
      setText("");
    } catch (e) {
      console.error(e);
      alert(e?.message || "Unable to post comment.");
    } finally {
      setPosting(false);
    }
  };

  const deleteComment = async (commentId) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await api.del(`/comments/${commentId}`);
      setComments(prev => prev.filter(c => (c._id || c.id) !== commentId));
    } catch (e) {
      alert(e?.message || "Delete failed");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Comments</h3>
      
      <div className="flex gap-3 mb-6">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={posting}
        />
        <button
          onClick={submit}
          className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          disabled={posting || !text.trim()}
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4 text-gray-500">Loading comments...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="space-y-4">
          {comments.map(c => (
            <div key={c._id ?? c.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-700">{(c.owner?.username ?? "U")?.[0]?.toUpperCase()}</span>
                    </div>
                    <span className="font-medium text-gray-900">{c.owner?.username ?? "Unknown"}</span>
                  </div>
                  <p className="text-gray-700">{c.content}</p>
                </div>
                {user && c.owner?._id === user._id && (
                  <button 
                    onClick={() => deleteComment(c._id || c.id)} 
                    className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
