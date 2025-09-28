import React from "react";
import api from "../services/api.jsx";

export default function SaveModal({ videoId, onClose }) {
  const [collections, setCollections] = React.useState([]);
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [creating, setCreating] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/collections");
        setCollections(res?.data ?? res ?? []);
      } catch (e) {
        // Silently handle error
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const createCollection = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      const res = await api.post("/collections", { name: name.trim(), description: description.trim() });
      const created = res?.data ?? res;
      setCollections(prev => [created, ...prev]);
      setName("");
      setDescription("");
      setShowCreateForm(false);
    } catch (e) {
      alert(e?.message || "Failed to create collection");
    } finally {
      setCreating(false);
    }
  };

  const saveToCollection = async (collectionId) => {
    try {
      await api.post(`/collections/${collectionId}/videos`, { videoId });
      alert("Video saved to collection");
      onClose();
    } catch (e) {
      alert(e?.message || "Failed to save video");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Save to Collection</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {showCreateForm ? (
          <form onSubmit={createCollection} className="space-y-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Collection name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter collection name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={creating}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Optional description"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                disabled={creating}
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={creating} className="flex-1 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300">
                {creating ? "Creating..." : "Create"}
              </button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors font-medium"
          >
            + Create New Collection
          </button>
        )}

        {loading ? (
          <div className="text-center py-4 text-gray-500">Loading collections...</div>
        ) : collections.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No collections yet</div>
        ) : (
          <div className="space-y-2">
            {collections.map(c => (
              <button
                key={c._id || c.id}
                onClick={() => saveToCollection(c._id || c.id)}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <div className="font-medium text-gray-900">{c.name}</div>
                {c.description && <div className="text-sm text-gray-600 mt-1">{c.description}</div>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}