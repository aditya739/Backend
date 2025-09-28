// controllers/dashboard.controller.js

// ======= Replace these with real DB/service implementations =======
const StatsService = {
  async getStatsForChannel(channelId) {
    // Dummy example; replace with your DB aggregation
    return {
      views: 12345,
      likes: 678,
      subscribers: 910,
      videosCount: 12,
    };
  },
};

const VideoService = {
  // Returns { videos: [...], total }
  async getVideosByChannel(channelId, { page = 1, limit = 20 }) {
    // Dummy example: generate fake video objects
    const total = 42;
    const videos = Array.from({ length: Math.min(limit, Math.max(0, total - (page-1)*limit)) }, (_, i) => {
      const id = (page - 1) * limit + i + 1;
      return {
        id: `video-${id}`,
        title: `Demo video ${id}`,
        durationSec: 120 + id,
        createdAt: new Date(Date.now() - id * 1000 * 60 * 60).toISOString(),
        viewCount: 100 * id,
      };
    });
    return { videos, total };
  },
};
// ==================================================================

export const getChannelStats = async (req, res) => {
  // assume verifyJWT attached req.user = { id, channelId, ... }
  const channelId = req.user?.channelId || req.user?.id;
  if (!channelId) {
    return res.status(400).json({ success: false, message: "Missing channelId in user token." });
  }

  const stats = await StatsService.getStatsForChannel(channelId);
  return res.json({ success: true, data: stats });
};

export const getChannelVideos = async (req, res) => {
  const channelId = req.user?.channelId || req.user?.id;
  if (!channelId) {
    return res.status(400).json({ success: false, message: "Missing channelId in user token." });
  }

  // Simple pagination + basic validation
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  if (!Number.isFinite(page) || page < 1) {
    return res.status(400).json({ success: false, message: "Invalid page parameter." });
  }
  if (!Number.isFinite(limit) || limit < 1 || limit > 200) {
    return res.status(400).json({ success: false, message: "Invalid limit parameter (1-200)." });
  }

  const { videos, total } = await VideoService.getVideosByChannel(channelId, { page, limit });

  return res.json({
    success: true,
    data: {
      videos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
};
