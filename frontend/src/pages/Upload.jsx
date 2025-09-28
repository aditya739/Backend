// frontend/src/pages/Upload.jsx
import React from "react";
import api from "../services/api.jsx";
import { useAuth } from "../services/auth.jsx";
import { useNavigate } from "react-router-dom";

export default function Upload(){
  const { user } = useAuth();
  const nav = useNavigate();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [videoFile, setVideoFile] = React.useState(null);
  const [thumbnail, setThumbnail] = React.useState(null);
  const [thumbPreview, setThumbPreview] = React.useState(null);
  const [videoPreview, setVideoPreview] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(()=> {
    if (thumbnail) {
      const url = URL.createObjectURL(thumbnail);
      setThumbPreview(url);
      return ()=> URL.revokeObjectURL(url);
    } else setThumbPreview(null);
  }, [thumbnail]);

  React.useEffect(()=> {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoPreview(url);
      return ()=> URL.revokeObjectURL(url);
    } else setVideoPreview(null);
  }, [videoFile]);

  if (!user) return (
    <div className="text-center py-16">
      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-4 rounded-lg inline-block">
        Please login to upload videos.
      </div>
    </div>
  );

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) return setError("Title required");
    if (!duration.trim()) return setError("Duration required");
    if (!videoFile) return setError("Video file required");
    if (!thumbnail) return setError("Thumbnail required");

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("description", description.trim());
    fd.append("duration", duration.trim());
    fd.append("videoFile", videoFile);
    fd.append("thumbnail", thumbnail);

    setLoading(true);
    try {
      // If using token header, api.post will attach it automatically from localStorage
      const res = await api.post("/videos", fd);
      const created = res?.data ?? res;
      alert("Uploaded successfully");
      nav(`/videos/${created._id || created.id}`);
    } catch (err) {
      setError(err?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload a video</h1>
        <p className="text-gray-600">Share your content with the world</p>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <form onSubmit={submit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              value={title} 
              onChange={e=>setTitle(e.target.value)} 
              placeholder="Enter video title" 
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" 
              rows={4}
              value={description} 
              onChange={e=>setDescription(e.target.value)} 
              placeholder="Describe your video" 
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Duration (seconds)</label>
            <input 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              value={duration} 
              onChange={e=>setDuration(e.target.value)} 
              placeholder="e.g. 120" 
              disabled={loading}
            />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Video file</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input 
                  type="file" 
                  accept="video/*" 
                  onChange={e=>setVideoFile(e.target.files[0])} 
                  disabled={loading}
                  className="w-full"
                />
              </div>
              {videoPreview && (
                <video src={videoPreview} controls className="mt-4 w-full max-h-60 rounded-lg" />
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Thumbnail</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e=>setThumbnail(e.target.files[0])} 
                  disabled={loading}
                  className="w-full"
                />
              </div>
              {thumbPreview && (
                <img src={thumbPreview} alt="thumb" className="mt-4 w-40 h-24 object-cover rounded-lg" />
              )}
            </div>
          </div>
          
          <button 
            type="submit" 
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              loading 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-gray-900 text-white hover:bg-gray-800"
            }`} 
            disabled={loading}
          >
            {loading ? "Publishing..." : "Publish video"}
          </button>
        </form>
      </div>
    </div>
  );
}
