const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth: authenticate, authorize, adminOnly, moderatorOrAdmin } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  validateUserUpdate,
  validatePagination,
  validateSearch,
  validatePaginationAndSearch,
  validateObjectId,
  handleValidationErrors
} = require('../middleware/validation');

// 获取所有用户 - 仅管理员和版主
router.get('/', authenticate, moderatorOrAdmin, ...validatePaginationAndSearch, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    role,
    isActive,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = {};

  // 搜索
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  // 筛选
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password -refreshTokens')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    User.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// 获取用户统计信息 - 仅管理员
router.get('/stats', authenticate, adminOnly, asyncHandler(async (req, res) => {
  const stats = await Promise.all([
    User.countDocuments({ isActive: true }),
    User.countDocuments({ isActive: false }),
    User.countDocuments({ role: 'admin' }),
    User.countDocuments({ role: 'moderator' }),
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ 
      lastLoginAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }),
    User.countDocuments({ 
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
  ]);

  res.json({
    success: true,
    data: {
      totalUsers: stats[0] + stats[1],
      activeUsers: stats[0],
      inactiveUsers: stats[1],
      adminUsers: stats[2],
      moderatorUsers: stats[3],
      regularUsers: stats[4],
      recentlyActiveUsers: stats[5],
      newUsersThisWeek: stats[6]
    }
  });
}));

// 根据ID获取用户详情
router.get('/:id', authenticate, ...validateObjectId('id'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // 只有管理员、版主或用户本人可以查看详细信息
  if (req.user.role !== 'admin' && req.user.role !== 'moderator' && req.user.id !== id) {
    return res.status(403).json({
      success: false,
      message: '权限不足'
    });
  }

  const user = await User.findById(id)
    .select('-password -refreshTokens')
    .populate('favorites.movies', 'title poster slug')
    .populate('favorites.music', 'title artist coverImage slug')
    .populate('favorites.games', 'title coverImage slug')
    .populate('favorites.books', 'title author coverImage slug')
    .lean();

  if (!user) {
    return res.status(404).json({
      success: false,
      message: '用户未找到'
    });
  }

  res.json({
    success: true,
    data: user
  });
}));

// 获取用户收藏
router.get('/:id/favorites', authenticate, ...validateObjectId('id'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type, page = 1, limit = 20 } = req.query;

  // 只有用户本人可以查看收藏
  if (req.user.id !== id) {
    return res.status(403).json({
      success: false,
      message: '权限不足'
    });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: '用户未找到'
    });
  }

  let favorites = [];
  let total = 0;

  const skip = (page - 1) * limit;

  if (type === 'movies' || !type) {
    await user.populate({
      path: 'favorites.movies',
      select: 'title poster slug rating year',
      options: { skip: type ? skip : 0, limit: type ? parseInt(limit) : 5 }
    });
    if (type === 'movies') {
      favorites = user.favorites.movies;
      total = user.favorites.movies.length;
    }
  }

  if (type === 'music' || !type) {
    await user.populate({
      path: 'favorites.music',
      select: 'title artist coverImage slug rating',
      options: { skip: type ? skip : 0, limit: type ? parseInt(limit) : 5 }
    });
    if (type === 'music') {
      favorites = user.favorites.music;
      total = user.favorites.music.length;
    }
  }

  if (type === 'games' || !type) {
    await user.populate({
      path: 'favorites.games',
      select: 'title coverImage slug rating platforms',
      options: { skip: type ? skip : 0, limit: type ? parseInt(limit) : 5 }
    });
    if (type === 'games') {
      favorites = user.favorites.games;
      total = user.favorites.games.length;
    }
  }

  if (type === 'books' || !type) {
    await user.populate({
      path: 'favorites.books',
      select: 'title author coverImage slug rating',
      options: { skip: type ? skip : 0, limit: type ? parseInt(limit) : 5 }
    });
    if (type === 'books') {
      favorites = user.favorites.books;
      total = user.favorites.books.length;
    }
  }

  if (!type) {
    favorites = {
      movies: user.favorites.movies,
      music: user.favorites.music,
      games: user.favorites.games,
      books: user.favorites.books
    };
  }

  res.json({
    success: true,
    data: favorites,
    pagination: type ? {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    } : undefined
  });
}));

// 获取用户观看历史
router.get('/:id/history', authenticate, ...validateObjectId('id'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type, page = 1, limit = 20 } = req.query;

  // 只有用户本人可以查看历史
  if (req.user.id !== id) {
    return res.status(403).json({
      success: false,
      message: '权限不足'
    });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: '用户未找到'
    });
  }

  let history = [];
  const skip = (page - 1) * limit;

  if (type === 'movies' || !type) {
    const movieHistory = user.watchHistory.movies
      .sort((a, b) => b.watchedAt - a.watchedAt)
      .slice(skip, skip + parseInt(limit));
    
    await user.populate({
      path: 'watchHistory.movies.item',
      select: 'title poster slug rating year'
    });
    
    if (type === 'movies') {
      history = movieHistory;
    }
  }

  if (type === 'music' || !type) {
    const musicHistory = user.playHistory.music
      .sort((a, b) => b.playedAt - a.playedAt)
      .slice(skip, skip + parseInt(limit));
    
    await user.populate({
      path: 'playHistory.music.item',
      select: 'title artist coverImage slug rating'
    });
    
    if (type === 'music') {
      history = musicHistory;
    }
  }

  if (!type) {
    history = {
      movies: user.watchHistory.movies.slice(0, 10),
      music: user.playHistory.music.slice(0, 10)
    };
  }

  res.json({
    success: true,
    data: history
  });
}));

// 更新用户信息
router.put('/:id', authenticate, ...validateObjectId('id'), ...validateUserUpdate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // 只有管理员或用户本人可以更新信息
  if (req.user.role !== 'admin' && req.user.id !== id) {
    return res.status(403).json({
      success: false,
      message: '权限不足'
    });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: '用户未找到'
    });
  }

  // 普通用户不能修改角色
  if (req.user.role !== 'admin' && req.body.role) {
    delete req.body.role;
  }

  // 更新用户信息
  Object.assign(user, req.body);
  await user.save();

  const updatedUser = await User.findById(id).select('-password -refreshTokens');

  res.json({
    success: true,
    data: updatedUser,
    message: '用户信息更新成功'
  });
}));

// 更改用户角色
router.patch('/:id/role', authenticate, adminOnly, ...validateObjectId('id'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !['user', 'moderator', 'admin'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: '无效的角色'
    });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: '用户未找到'
    });
  }

  user.role = role;
  await user.save();

  res.json({
    success: true,
    message: '用户角色更新成功',
    data: {
      id: user._id,
      username: user.username,
      role: user.role
    }
  });
}));

// 激活/停用用户
router.patch('/:id/status', authenticate, adminOnly, ...validateObjectId('id'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (typeof isActive !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: '无效的状态值'
    });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: '用户未找到'
    });
  }

  user.isActive = isActive;
  await user.save();

  res.json({
    success: true,
    message: `用户${isActive ? '激活' : '停用'}成功`,
    data: {
      id: user._id,
      username: user.username,
      isActive: user.isActive
    }
  });
}));

// 删除用户
router.delete('/:id', authenticate, adminOnly, ...validateObjectId('id'), asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 不能删除自己
  if (req.user.id === id) {
    return res.status(400).json({
      success: false,
      message: '不能删除自己的账户'
    });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: '用户未找到'
    });
  }

  await User.findByIdAndDelete(id);

  res.json({
    success: true,
    message: '用户删除成功'
  });
}));

// 搜索用户 - 仅管理员和版主
router.get('/search/advanced', authenticate, moderatorOrAdmin, ...validateSearch, asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 20 } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: '搜索关键词不能为空'
    });
  }

  const query = {
    $or: [
      { username: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } }
    ]
  };

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password -refreshTokens')
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    User.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

module.exports = router;