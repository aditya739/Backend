import React from "react";
import { Link } from "react-router-dom";
import api from "../services/api.jsx";
import { useAuth } from "../services/auth.jsx";

export default function Collections() {
  const { user } = useAuth();
  const [collections, setCollections] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/collections");
        setCollections(res?.data ?? res ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const removeFromCollection = async (collectionId, videoId) => {
    if (!confirm("Remove video from collection?")) return;
    try {
      await api.del(`/collections/${collectionId}/videos/${videoId}`);
      setCollections(prev => prev.map(c => 
        (c._id || c.id) === collectionId 
          ? { ...c, videos: c.videos.filter(v => (v._id || v.id) !== videoId) }
          : c
      ));
    } catch (e) {
      alert(e?.message || "Failed to remove video");
    }
  };

  if (!user) return (
    <div className="text-center py-16">
      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-4 rounded-lg inline-block">
        Please login to view collections.
      </div>
    </div>
  );

  if (loading) return <div>Loading collections...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Collections</h1>
      
      {collections.length === 0 ? (
        <p className="text-gray-600">No collections yet. Save some videos to get started!</p>
      ) : (
        <div className="space-y-8">
          {collections.map(collection => (
            <div key={collection._id || collection.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{collection.name}</h2>
              {collection.description && (
                <p className="text-gray-600 mb-4">{collection.description}</p>
              )}
              
              {!collection.videos || collection.videos.length === 0 ? (
                <p className="text-gray-500">No videos in this collection</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {collection.videos.map(video => (
                    <div key={video._id || video.id} className="relative group">
                      <Link to={`/videos/${video._id || video.id}`} className="block">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-32 object-cover rounded"
                        />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 truncate">{video.title}</h3>
                      </Link>
                      <button
                        onClick={() => removeFromCollection(collection._id || collection.id, video._id || video.id)}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}