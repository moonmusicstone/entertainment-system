const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const User = require('../models/User');
const { auth: authenticate, optionalAuth, authorize, adminOnly } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  validateGame,
  validatePagination,
  validateSearch,
  validateObjectId,
  handleValidationErrors
} = require('../middleware/validation');

// 获取所有游戏 - 支持分页、搜索、筛选和排序
router.get('/', validatePagination, validateSearch, handleValidationErrors, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    platform,
    genre,
    gameMode,
    ageRating,
    year,
    priceRange,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    featured,
    free,
    onSale
  } = req.query;

  const query = { isActive: true };

  // 搜索
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { developer: { $regex: search, $options: 'i' } },
      { publisher: { $regex: search, $options: 'i' } }
    ];
  }

  // 筛选
  if (platform) query.platforms = { $in: platform.split(',') };
  if (genre) query.genres = { $in: genre.split(',') };
  if (gameMode) query.gameModes = { $in: gameMode.split(',') };
  if (ageRating) query.ageRating = ageRating;
  if (year) query.year = parseInt(year);
  if (featured !== undefined) query.featured = featured === 'true';
  if (free === 'true') query.price = 0;
  if (onSale === 'true') query.onSale = true;

  // 价格范围筛选
  if (priceRange) {
    const [min, max] = priceRange.split('-').map(Number);
    if (min !== undefined) query.price = { $gte: min };
    if (max !== undefined) query.price = { ...query.price, $lte: max };
  }

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [games, total] = await Promise.all([
    Game.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('categories', 'name slug')
      .lean(),
    Game.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: games,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// 获取特色游戏
router.get('/featured', asyncHandler(async (req, res) => {
  const games = await Game.findFeatured()
    .populate('categories', 'name slug')
    .lean();

  res.json({
    success: true,
    data: games
  });
}));

// 获取热门游戏
router.get('/popular', asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  const games = await Game.find({ isActive: true })
    .sort({ downloadCount: -1, playCount: -1, rating: -1 })
    .limit(parseInt(limit))
    .populate('categories', 'name slug')
    .lean();

  res.json({
    success: true,
    data: games
  });
}));

// 获取高评分游戏
router.get('/top-rated', asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  const games = await Game.getTopRated(parseInt(limit));

  res.json({
    success: true,
    data: games
  });
}));

// 获取免费游戏
router.get('/free', asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  const games = await Game.findFreeGames(parseInt(limit));

  res.json({
    success: true,
    data: games
  });
}));

// 获取促销游戏
router.get('/on-sale', asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  const games = await Game.findOnSaleGames(parseInt(limit));

  res.json({
    success: true,
    data: games
  });
}));

// 获取即将发布的游戏
router.get('/upcoming', asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  const games = await Game.findUpcoming(parseInt(limit));

  res.json({
    success: true,
    data: games
  });
}));

// 按平台获取游戏
router.get('/platform/:platform', asyncHandler(async (req, res) => {
  const { platform } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const games = await Game.findByPlatform(platform, {
    page: parseInt(page),
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: games
  });
}));

// 按流派获取游戏
router.get('/genre/:genre', asyncHandler(async (req, res) => {
  const { genre } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const games = await Game.findByGenre(genre, {
    page: parseInt(page),
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: games
  });
}));

// 获取游戏推荐
router.get('/recommendations', optionalAuth, asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const userId = req.user?.id;

  const recommendations = await Game.getRecommendations(userId, parseInt(limit));

  res.json({
    success: true,
    data: recommendations
  });
}));

// 根据ID或slug获取游戏详情
router.get('/:identifier', optionalAuth, asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  
  const query = identifier.match(/^[0-9a-fA-F]{24}$/) 
    ? { _id: identifier }
    : { slug: identifier };

  const game = await Game.findOne({ ...query, isActive: true })
    .populate('categories', 'name slug')
    .lean();

  if (!game) {
    return res.status(404).json({
      success: false,
      message: '游戏未找到'
    });
  }

  // 增加浏览次数
  await Game.findByIdAndUpdate(game._id, { $inc: { viewCount: 1 } });

  // 如果用户已登录，记录浏览历史
  if (req.user) {
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: {
        'browsingHistory.games': {
          item: game._id,
          viewedAt: new Date()
        }
      }
    });
  }

  res.json({
    success: true,
    data: game
  });
}));

// 创建游戏 - 仅管理员
router.post('/', authenticate, adminOnly, validateGame, handleValidationErrors, asyncHandler(async (req, res) => {
  const gameData = {
    ...req.body,
    createdBy: req.user.id,
    updatedBy: req.user.id
  };

  const game = new Game(gameData);
  await game.save();

  await game.populate('categories', 'name slug');

  res.status(201).json({
    success: true,
    data: game,
    message: '游戏创建成功'
  });
}));

// 更新游戏
router.put('/:id', authenticate, adminOnly, ...validateObjectId('id'), validateGame, asyncHandler(async (req, res) => {
  const game = await Game.findById(req.params.id);

  if (!game) {
    return res.status(404).json({
      success: false,
      message: '游戏未找到'
    });
  }

  Object.assign(game, req.body);
  game.updatedBy = req.user.id;
  await game.save();

  await game.populate('categories', 'name slug');

  res.json({
    success: true,
    data: game,
    message: '游戏更新成功'
  });
}));

// 删除游戏
router.delete('/:id', authenticate, adminOnly, ...validateObjectId('id'), asyncHandler(async (req, res) => {
  const game = await Game.findById(req.params.id);

  if (!game) {
    return res.status(404).json({
      success: false,
      message: '游戏未找到'
    });
  }

  game.isActive = false;
  game.updatedBy = req.user.id;
  await game.save();

  res.json({
    success: true,
    message: '游戏删除成功'
  });
}));

// 游戏评分
router.post('/:id/rate', authenticate, ...validateObjectId('id'), asyncHandler(async (req, res) => {
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 10) {
    return res.status(400).json({
      success: false,
      message: '评分必须在1-10之间'
    });
  }

  const game = await Game.findById(req.params.id);

  if (!game) {
    return res.status(404).json({
      success: false,
      message: '游戏未找到'
    });
  }

  await game.updateRating(req.user.id, rating);

  res.json({
    success: true,
    message: '评分成功',
    data: {
      rating: game.rating,
      ratingCount: game.ratingCount
    }
  });
}));

// 收藏/取消收藏游戏
router.post('/:id/favorite', authenticate, ...validateObjectId('id'), asyncHandler(async (req, res) => {
  const game = await Game.findById(req.params.id);

  if (!game) {
    return res.status(404).json({
      success: false,
      message: '游戏未找到'
    });
  }

  const user = await User.findById(req.user.id);
  const isFavorited = user.favorites.games.includes(req.params.id);

  if (isFavorited) {
    // 取消收藏
    user.favorites.games.pull(req.params.id);
    game.favoriteCount = Math.max(0, game.favoriteCount - 1);
  } else {
    // 添加收藏
    user.favorites.games.push(req.params.id);
    game.favoriteCount += 1;
  }

  await Promise.all([user.save(), game.save()]);

  res.json({
    success: true,
    message: isFavorited ? '取消收藏成功' : '收藏成功',
    data: {
      favorited: !isFavorited,
      favoriteCount: game.favoriteCount
    }
  });
}));

// 下载游戏
router.post('/:id/download', authenticate, ...validateObjectId('id'), asyncHandler(async (req, res) => {
  const game = await Game.findById(req.params.id);

  if (!game) {
    return res.status(404).json({
      success: false,
      message: '游戏未找到'
    });
  }

  // 增加下载次数
  await game.incrementDownloadCount();

  // 记录用户下载历史
  await User.findByIdAndUpdate(req.user.id, {
    $addToSet: {
      'downloadHistory.games': {
        item: game._id,
        downloadedAt: new Date()
      }
    }
  });

  res.json({
    success: true,
    message: '下载开始',
    data: {
      downloadUrl: game.downloadUrl,
      downloadCount: game.downloadCount
    }
  });
}));

// 搜索游戏
router.get('/search/advanced', validateSearch, handleValidationErrors, asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 20 } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: '搜索关键词不能为空'
    });
  }

  const results = await Game.searchGames(q, {
    page: parseInt(page),
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: results
  });
}));

module.exports = router;