import React from "react";
import api from "../services/api.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../services/auth.jsx";
import SaveModal from "../components/SaveModal.jsx";
import SearchBar from "../components/SearchBar.jsx";

function VideoCard({ v }) {
  const { user } = useAuth();
  const [showSaveModal, setShowSaveModal] = React.useState(false);
  const thumb = v.thumbnail || `https://source.unsplash.com/collection/190727/800x600?sig=${v._id}`;
  
  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSaveModal(true);
  };

  return (
    <>
      <div className="relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200 group">
        <Link to={`/videos/${v._id}`} className="block">
          <div className="aspect-video bg-gray-100">
            <img src={thumb} alt={v.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{v.title}</h3>
            <p className="text-sm text-gray-500">{v.owner?.username || "Unknown"}</p>
          </div>
        </Link>
        {user && (
          <button
            onClick={handleSave}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        )}
      </div>
      {showSaveModal && (
        <SaveModal videoId={v._id} onClose={() => setShowSaveModal(false)} />
      )}
    </>
  );
}

export default function Home() {
  const [videos, setVideos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState("newest");

  const fetchVideos = React.useCallback(async (params = {}) => {
    setLoading(true);
    setError("");
    try {
      let url = "/videos?limit=20&page=1";
      if (params.query) url += `&search=${encodeURIComponent(params.query)}`;
      if (params.category) url += `&category=${params.category}`;
      if (params.uploadDate) url += `&uploadDate=${params.uploadDate}`;
      if (params.sortBy) url += `&sort=${params.sortBy}`;
      
      const res = await api.get(url);
      const arr = res?.data?.videos ?? res?.videos ?? res ?? [];
      setVideos(Array.isArray(arr) ? arr : []);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch videos. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleSearch = (params) => {
    setSearchQuery(params.query || "");
    setSortBy(params.sortBy || "newest");
    fetchVideos(params);
  };

  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover amazing videos</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Upload, share, and enjoy content from creators around the world</p>
        <Link to="/upload" className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload a video
        </Link>
      </section>
      
      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="rounded-xl bg-gray-100 animate-pulse h-64" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-4 inline-block">{error}</div>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No videos yet. Be the first to upload!</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(v => <VideoCard key={v._id} v={v} />)}
        </div>
      )}
    </div>
  );
}
