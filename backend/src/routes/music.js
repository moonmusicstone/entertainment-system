const express = require('express');
const router = express.Router();
const Music = require('../models/Music');
const User = require('../models/User');
const { auth: authenticate, optionalAuth, authorize, adminOnly } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  validateMusic,
  validatePagination,
  validateSearch,
  validateObjectId,
  handleValidationErrors
} = require('../middleware/validation');

// 获取所有音乐 - 支持分页、搜索、筛选和排序
router.get('/', validatePagination, validateSearch, handleValidationErrors, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    type,
    artist,
    genre,
    language,
    year,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    featured
  } = req.query;

  const query = { isActive: true };

  // 搜索
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { artist: { $regex: search, $options: 'i' } },
      { album: { $regex: search, $options: 'i' } }
    ];
  }

  // 筛选
  if (type) query.type = type;
  if (artist) query.artist = { $regex: artist, $options: 'i' };
  if (genre) query.genre = { $in: genre.split(',') };
  if (language) query.language = language;
  if (year) query.year = parseInt(year);
  if (featured !== undefined) query.featured = featured === 'true';

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [music, total] = await Promise.all([
    Music.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('categories', 'name slug')
      .lean(),
    Music.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: music,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// 获取特色音乐
router.get('/featured', asyncHandler(async (req, res) => {
  const music = await Music.findFeatured()
    .populate('categories', 'name slug')
    .lean();

  res.json({
    success: true,
    data: music
  });
}));

// 获取热门音乐
router.get('/popular', asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  const music = await Music.find({ isActive: true })
    .sort({ playCount: -1, rating: -1 })
    .limit(parseInt(limit))
    .populate('categories', 'name slug')
    .lean();

  res.json({
    success: true,
    data: music
  });
}));

// 获取评分最高的音乐
router.get('/top-rated', asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  const music = await Music.find({ 
    isActive: true,
    ratingCount: { $gte: 10 } // 至少10个评分
  })
    .sort({ rating: -1, ratingCount: -1 })
    .limit(parseInt(limit))
    .populate('categories', 'name slug')
    .lean();

  res.json({
    success: true,
    data: music
  });
}));

// 按艺术家获取音乐
router.get('/artist/:artist', asyncHandler(async (req, res) => {
  const { artist } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const music = await Music.findByArtist(artist, {
    page: parseInt(page),
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: music
  });
}));

// 按流派获取音乐
router.get('/genre/:genre', asyncHandler(async (req, res) => {
  const { genre } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const music = await Music.findByGenre(genre, {
    page: parseInt(page),
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: music
  });
}));

// 获取音乐推荐
router.get('/recommendations', optionalAuth, asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const userId = req.user?.id;

  const recommendations = await Music.getRecommendations(userId, parseInt(limit));

  res.json({
    success: true,
    data: recommendations
  });
}));

// 根据ID或slug获取音乐详情
router.get('/:identifier', optionalAuth, asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  
  const query = identifier.match(/^[0-9a-fA-F]{24}$/) 
    ? { _id: identifier }
    : { slug: identifier };

  const music = await Music.findOne({ ...query, isActive: true })
    .populate('categories', 'name slug')
    .lean();

  if (!music) {
    return res.status(404).json({
      success: false,
      message: '音乐未找到'
    });
  }

  // 增加播放次数
  await Music.findByIdAndUpdate(music._id, { $inc: { playCount: 1 } });

  // 如果用户已登录，记录播放历史
  if (req.user) {
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: {
        'playHistory.music': {
          item: music._id,
          playedAt: new Date()
        }
      }
    });
  }

  res.json({
    success: true,
    data: music
  });
}));

// 创建音乐 - 仅管理员
router.post('/', authenticate, adminOnly, validateMusic, handleValidationErrors, asyncHandler(async (req, res) => {
  const musicData = {
    ...req.body,
    createdBy: req.user.id,
    updatedBy: req.user.id
  };

  const music = new Music(musicData);
  await music.save();

  await music.populate('categories', 'name slug');

  res.status(201).json({
    success: true,
    data: music,
    message: '音乐创建成功'
  });
}));

// 更新音乐
router.put('/:id', authenticate, adminOnly, ...validateObjectId('id'), validateMusic, asyncHandler(async (req, res) => {
  const music = await Music.findById(req.params.id);

  if (!music) {
    return res.status(404).json({
      success: false,
      message: '音乐未找到'
    });
  }

  Object.assign(music, req.body);
  music.updatedBy = req.user.id;
  await music.save();

  await music.populate('categories', 'name slug');

  res.json({
    success: true,
    data: music,
    message: '音乐更新成功'
  });
}));

// 删除音乐
router.delete('/:id', authenticate, adminOnly, ...validateObjectId('id'), asyncHandler(async (req, res) => {
  const music = await Music.findById(req.params.id);

  if (!music) {
    return res.status(404).json({
      success: false,
      message: '音乐未找到'
    });
  }

  music.isActive = false;
  music.updatedBy = req.user.id;
  await music.save();

  res.json({
    success: true,
    message: '音乐删除成功'
  });
}));

// 音乐评分
router.post('/:id/rate', authenticate, ...validateObjectId('id'), asyncHandler(async (req, res) => {
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 10) {
    return res.status(400).json({
      success: false,
      message: '评分必须在1-10之间'
    });
  }

  const music = await Music.findById(req.params.id);

  if (!music) {
    return res.status(404).json({
      success: false,
      message: '音乐未找到'
    });
  }

  await music.updateRating(req.user.id, rating);

  res.json({
    success: true,
    message: '评分成功',
    data: {
      rating: music.rating,
      ratingCount: music.ratingCount
    }
  });
}));

// 收藏/取消收藏音乐
router.post('/:id/favorite', authenticate, ...validateObjectId('id'), asyncHandler(async (req, res) => {
  const music = await Music.findById(req.params.id);

  if (!music) {
    return res.status(404).json({
      success: false,
      message: '音乐未找到'
    });
  }

  const user = await User.findById(req.user.id);
  const isFavorited = user.favorites.music.includes(req.params.id);

  if (isFavorited) {
    // 取消收藏
    user.favorites.music.pull(req.params.id);
    music.favoriteCount = Math.max(0, music.favoriteCount - 1);
  } else {
    // 添加收藏
    user.favorites.music.push(req.params.id);
    music.favoriteCount += 1;
  }

  await Promise.all([user.save(), music.save()]);

  res.json({
    success: true,
    message: isFavorited ? '取消收藏成功' : '收藏成功',
    data: {
      favorited: !isFavorited,
      favoriteCount: music.favoriteCount
    }
  });
}));

// 搜索音乐
router.get('/search/advanced', validateSearch, handleValidationErrors, asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 20 } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: '搜索关键词不能为空'
    });
  }

  const results = await Music.searchMusic(q, {
    page: parseInt(page),
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: results
  });
}));

module.exports = router;