const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Movie = require('../models/Movie');
const Music = require('../models/Music');
const Game = require('../models/Game');
const Book = require('../models/Book');
const Category = require('../models/Category');
const { auth: authenticate, adminOnly } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// 获取仪表板统计数据
router.get('/dashboard', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const [
    userStats,
    movieStats,
    musicStats,
    gameStats,
    bookStats,
    categoryStats
  ] = await Promise.all([
    // 用户统计
    Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: false }),
      User.countDocuments({ 
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      User.countDocuments({ 
        lastLoginAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    ]),
    // 电影统计
    Promise.all([
      Movie.countDocuments({ isActive: true }),
      Movie.countDocuments({ featured: true }),
      Movie.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, totalViews: { $sum: '$viewCount' } } }
      ])
    ]),
    // 音乐统计
    Promise.all([
      Music.countDocuments({ isActive: true }),
      Music.countDocuments({ featured: true }),
      Music.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, totalPlays: { $sum: '$playCount' } } }
      ])
    ]),
    // 游戏统计
    Promise.all([
      Game.countDocuments({ isActive: true }),
      Game.countDocuments({ featured: true }),
      Game.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, totalDownloads: { $sum: '$downloadCount' } } }
      ])
    ]),
    // 书籍统计
    Promise.all([
      Book.countDocuments({ isActive: true }),
      Book.countDocuments({ featured: true }),
      Book.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, totalReads: { $sum: '$readCount' } } }
      ])
    ]),
    // 分类统计
    Promise.all([
      Category.countDocuments({ isActive: true }),
      Category.countDocuments({ featured: true })
    ])
  ]);

  res.json({
    success: true,
    data: {
      users: {
        total: userStats[0] + userStats[1],
        active: userStats[0],
        inactive: userStats[1],
        newThisMonth: userStats[2],
        activeThisWeek: userStats[3]
      },
      movies: {
        total: movieStats[0],
        featured: movieStats[1],
        totalViews: movieStats[2][0]?.totalViews || 0
      },
      music: {
        total: musicStats[0],
        featured: musicStats[1],
        totalPlays: musicStats[2][0]?.totalPlays || 0
      },
      games: {
        total: gameStats[0],
        featured: gameStats[1],
        totalDownloads: gameStats[2][0]?.totalDownloads || 0
      },
      books: {
        total: bookStats[0],
        featured: bookStats[1],
        totalReads: bookStats[2][0]?.totalReads || 0
      },
      categories: {
        total: categoryStats[0],
        featured: categoryStats[1]
      }
    }
  });
}));

// 获取内容统计趋势
router.get('/analytics/trends', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const { period = '7d' } = req.query;
  
  let startDate;
  switch (period) {
    case '24h':
      startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  }

  const [userTrends, contentTrends] = await Promise.all([
    // 用户注册趋势
    User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    // 内容创建趋势
    Promise.all([
      Movie.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Music.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Game.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Book.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ])
  ]);

  res.json({
    success: true,
    data: {
      userRegistrations: userTrends,
      contentCreation: {
        movies: contentTrends[0],
        music: contentTrends[1],
        games: contentTrends[2],
        books: contentTrends[3]
      }
    }
  });
}));

// 获取热门内容
router.get('/analytics/popular', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const { type = 'all', limit = 10 } = req.query;

  const results = {};

  if (type === 'all' || type === 'movies') {
    results.movies = await Movie.find({ isActive: true })
      .sort({ viewCount: -1 })
      .limit(parseInt(limit))
      .select('title viewCount rating poster slug')
      .lean();
  }

  if (type === 'all' || type === 'music') {
    results.music = await Music.find({ isActive: true })
      .sort({ playCount: -1 })
      .limit(parseInt(limit))
      .select('title artist playCount rating coverImage slug')
      .lean();
  }

  if (type === 'all' || type === 'games') {
    results.games = await Game.find({ isActive: true })
      .sort({ downloadCount: -1 })
      .limit(parseInt(limit))
      .select('title downloadCount rating coverImage slug')
      .lean();
  }

  if (type === 'all' || type === 'books') {
    results.books = await Book.find({ isActive: true })
      .sort({ readCount: -1 })
      .limit(parseInt(limit))
      .select('title author readCount rating coverImage slug')
      .lean();
  }

  res.json({
    success: true,
    data: results
  });
}));

// 获取用户活动统计
router.get('/analytics/user-activity', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const { period = '7d' } = req.query;
  
  let startDate;
  switch (period) {
    case '24h':
      startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  }

  const [loginActivity, contentActivity] = await Promise.all([
    // 登录活动
    User.aggregate([
      {
        $match: {
          lastLoginAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$lastLoginAt'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    // 内容互动活动（简化版，实际应该从用户行为日志中获取）
    Promise.all([
      Movie.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, totalViews: { $sum: '$viewCount' } } }
      ]),
      Music.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, totalPlays: { $sum: '$playCount' } } }
      ]),
      Game.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, totalDownloads: { $sum: '$downloadCount' } } }
      ]),
      Book.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, totalReads: { $sum: '$readCount' } } }
      ])
    ])
  ]);

  res.json({
    success: true,
    data: {
      loginActivity,
      contentInteractions: {
        movieViews: contentActivity[0][0]?.totalViews || 0,
        musicPlays: contentActivity[1][0]?.totalPlays || 0,
        gameDownloads: contentActivity[2][0]?.totalDownloads || 0,
        bookReads: contentActivity[3][0]?.totalReads || 0
      }
    }
  });
}));

// 系统健康检查
router.get('/system/health', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const startTime = Date.now();
  
  try {
    // 检查数据库连接
    await User.findOne().limit(1);
    const dbResponseTime = Date.now() - startTime;

    // 获取系统信息
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    };

    res.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: {
          status: 'connected',
          responseTime: dbResponseTime
        },
        system: systemInfo
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: {
          status: 'disconnected',
          error: error.message
        }
      }
    });
  }
}));

// 批量操作 - 批量更新内容状态
router.patch('/bulk/content-status', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const { type, ids, action } = req.body;

  if (!type || !ids || !Array.isArray(ids) || !action) {
    return res.status(400).json({
      success: false,
      message: '参数不完整'
    });
  }

  let Model;
  switch (type) {
    case 'movies':
      Model = Movie;
      break;
    case 'music':
      Model = Music;
      break;
    case 'games':
      Model = Game;
      break;
    case 'books':
      Model = Book;
      break;
    default:
      return res.status(400).json({
        success: false,
        message: '无效的内容类型'
      });
  }

  let updateData = {};
  switch (action) {
    case 'activate':
      updateData = { isActive: true };
      break;
    case 'deactivate':
      updateData = { isActive: false };
      break;
    case 'feature':
      updateData = { featured: true };
      break;
    case 'unfeature':
      updateData = { featured: false };
      break;
    default:
      return res.status(400).json({
        success: false,
        message: '无效的操作'
      });
  }

  const result = await Model.updateMany(
    { _id: { $in: ids } },
    { ...updateData, updatedBy: req.user.id }
  );

  res.json({
    success: true,
    message: `批量操作成功，影响 ${result.modifiedCount} 个项目`,
    data: {
      modifiedCount: result.modifiedCount
    }
  });
}));

// 清理无效数据
router.post('/maintenance/cleanup', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const { type } = req.body;

  const results = {};

  if (type === 'all' || type === 'users') {
    // 清理长时间未激活的用户（示例：30天前创建但从未登录）
    const inactiveUsers = await User.deleteMany({
      isActive: false,
      lastLoginAt: null,
      createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    results.inactiveUsers = inactiveUsers.deletedCount;
  }

  if (type === 'all' || type === 'content') {
    // 清理被标记为删除的内容（软删除后30天）
    const [deletedMovies, deletedMusic, deletedGames, deletedBooks] = await Promise.all([
      Movie.deleteMany({
        isActive: false,
        updatedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      Music.deleteMany({
        isActive: false,
        updatedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      Game.deleteMany({
        isActive: false,
        updatedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      Book.deleteMany({
        isActive: false,
        updatedAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      })
    ]);

    results.deletedContent = {
      movies: deletedMovies.deletedCount,
      music: deletedMusic.deletedCount,
      games: deletedGames.deletedCount,
      books: deletedBooks.deletedCount
    };
  }

  res.json({
    success: true,
    message: '清理操作完成',
    data: results
  });
}));

module.exports = router;