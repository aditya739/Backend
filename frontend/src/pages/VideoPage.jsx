import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api.jsx";
import { useAuth } from "../services/auth.jsx";
import Comments from "../components/Comments.jsx";
import SaveModal from "../components/SaveModal.jsx";
import LikeButton from "../components/LikeButton.jsx";
import ReportModal from "../components/ReportModal.jsx";
import { Link } from "react-router-dom";

export default function VideoPage(){
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [video, setVideo] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);
  const [showSaveModal, setShowSaveModal] = React.useState(false);
  const [showReportModal, setShowReportModal] = React.useState(false);
  const [recommendations, setRecommendations] = React.useState([]);

  React.useEffect(()=>{
    let mounted = true;
    (async () => {
      try {
        const res = await api.get(`/videos/${id}`);
        const obj = res?.data ?? res;
        if (mounted) setVideo(obj);
      } catch (err) {
        if (mounted) setError("Unable to load video. Is the backend running?");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return ()=> mounted = false;
  }, [id]);

  const deleteVideo = async () => {
    if (!confirm("Delete this video?")) return;
    setDeleting(true);
    try {
      await api.del(`/videos/${id}`);
      alert("Video deleted");
      nav("/");
    } catch (err) {
      alert(err?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="text-gray-500">Loading video...</div>
    </div>
  );
  if (error) return (
    <div className="text-center py-16">
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg inline-block">{error}</div>
    </div>
  );
  if (!video) return (
    <div className="text-center py-16">
      <div className="text-gray-500">Video not found</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-black rounded-xl overflow-hidden">
            <video 
              controls 
              src={video.videoFile} 
              className="w-full max-h-[600px]"
              onTimeUpdate={(e) => {
                const watchTime = Math.floor(e.target.currentTime);
                const completed = e.target.currentTime >= e.target.duration * 0.9;
                if (watchTime % 10 === 0) {
                  api.post(`/watch-history/${id}`, { watchTime, completed }).catch(() => {});
                }
              }}
            />
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{video.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{video.owner?.username}</span>
                  <span>•</span>
                  <span>{video.views} views</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <LikeButton 
                  videoId={video._id || id} 
                  initialLikes={video.likes || 0} 
                  initialDislikes={video.dislikes || 0} 
                  userReaction={video.userReaction}
                />
                {user && (
                  <button 
                    onClick={() => setShowSaveModal(true)} 
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Save
                  </button>
                )}
                {user && video.owner?._id !== user._id && (
                  <button 
                    onClick={() => setShowReportModal(true)} 
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Report
                  </button>
                )}
                {user && video.owner?._id === user._id && (
                  <button 
                    onClick={deleteVideo} 
                    disabled={deleting} 
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:bg-red-100 disabled:text-red-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            </div>
            
            {video.description && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">{video.description}</p>
              </div>
            )}
          </div>
          
          <Comments videoId={video._id || id} />
        </div>

        <aside className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Video Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Views</span>
                <span className="font-medium text-gray-900">{video.views}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Creator</span>
                <span className="font-medium text-gray-900">{video.owner?.username}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
      
      {showSaveModal && (
        <SaveModal videoId={video._id || id} onClose={() => setShowSaveModal(false)} />
      )}
      {showReportModal && (
        <ReportModal videoId={video._id || id} onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
}
