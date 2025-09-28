import React from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [uploadDate, setUploadDate] = React.useState("");
  const [sortBy, setSortBy] = React.useState("newest");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, category, uploadDate, sortBy });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Search
          </button>
        </div>
        <div className="flex gap-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">All Categories</option>
            <option value="education">Education</option>
            <option value="entertainment">Entertainment</option>
            <option value="gaming">Gaming</option>
            <option value="music">Music</option>
            <option value="sports">Sports</option>
            <option value="technology">Technology</option>
          </select>
          <select
            value={uploadDate}
            onChange={(e) => setUploadDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Any Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="views">Most Viewed</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>
      </form>
    </div>
  );
}