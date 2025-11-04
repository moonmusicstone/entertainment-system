const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const User = require('../models/User');
const { auth: authenticate, optionalAuth, authorize, adminOnly } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  validateBook,
  validatePagination,
  validateSearch,
  validateObjectId,
  handleValidationErrors
} = require('../middleware/validation');

// 获取所有书籍 - 支持分页、搜索、筛选和排序
router.get('/', validatePagination, validateSearch, handleValidationErrors, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    type,
    author,
    publisher,
    genre,
    language,
    year,
    status,
    ageRating,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    featured,
    series
  } = req.query;

  const query = { isActive: true };

  // 搜索
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } },
      { publisher: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  // 筛选
  if (type) query.type = type;
  if (author) query.author = { $regex: author, $options: 'i' };
  if (publisher) query.publisher = { $regex: publisher, $options: 'i' };
  if (genre) query.genres = { $in: genre.split(',') };
  if (language) query.language = language;
  if (year) query.year = parseInt(year);
  if (status) query.status = status;
  if (ageRating) query.ageRating = ageRating;
  if (featured !== undefined) query.featured = featured === 'true';
  if (series) query['series.name'] = { $regex: series, $options: 'i' };

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [books, total] = await Promise.all([
    Book.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('categories', 'name slug')
      .lean(),
    Book.countDocuments(query)
  ]);

  res.json({
    success: true,
    data: books,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// 获取特色书籍
router.get('/featured', asyncHandler(async (req, res) => {
  const books = await Book.findFeatured()
    .populate('categories', 'name slug')
    .lean();

  res.json({
    success: true,
    data: books
  });
}));

// 获取热门书籍
router.get('/popular', asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  const books = await Book.getMostRead(parseInt(limit));

  res.json({
    success: true,
    data: books
  });
}));

// 获取高评分书籍
router.get('/top-rated', asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  const books = await Book.getTopRated(parseInt(limit));

  res.json({
    success: true,
    data: books
  });
}));

// 获取连载中的书籍
router.get('/ongoing', asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  const books = await Book.findOngoing(parseInt(limit));

  res.json({
    success: true,
    data: books
  });
}));

// 按类型获取书籍
router.get('/type/:type', asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const books = await Book.findByType(type, {
    page: parseInt(page),
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: books
  });
}));

// 按作者获取书籍
router.get('/author/:author', asyncHandler(async (req, res) => {
  const { author } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const books = await Book.findByAuthor(author, {
    page: parseInt(page),
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: books
  });
}));

// 按流派获取书籍
router.get('/genre/:genre', asyncHandler(async (req, res) => {
  const { genre } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const books = await Book.findByGenre(genre, {
    page: parseInt(page),
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: books
  });
}));

// 按系列获取书籍
router.get('/series/:series', asyncHandler(async (req, res) => {
  const { series } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const books = await Book.findBySeries(series, {
    page: parseInt(page),
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: books
  });
}));

// 获取书籍推荐
router.get('/recommendations', optionalAuth, asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const userId = req.user?.id;

  const recommendations = await Book.getRecommendations(userId, parseInt(limit));

  res.json({
    success: true,
    data: recommendations
  });
}));

// 根据ID或slug获取书籍详情
router.get('/:identifier', optionalAuth, asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  
  const query = identifier.match(/^[0-9a-fA-F]{24}$/) 
    ? { _id: identifier }
    : { slug: identifier };

  const book = await Book.findOne({ ...query, isActive: true })
    .populate('categories', 'name slug')
    .lean();

  if (!book) {
    return res.status(404).json({
      success: false,
      message: '书籍未找到'
    });
  }

  // 增加阅读次数
  await Book.findByIdAndUpdate(book._id, { $inc: { readCount: 1 } });

  // 如果用户已登录，记录阅读历史
  if (req.user) {
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: {
        'readingHistory.books': {
          item: book._id,
          readAt: new Date()
        }
      }
    });
  }

  res.json({
    success: true,
    data: book
  });
}));

// 创建书籍 - 仅管理员
router.post('/', authenticate, adminOnly, validateBook, handleValidationErrors, asyncHandler(async (req, res) => {
  const bookData = {
    ...req.body,
    createdBy: req.user.id,
    updatedBy: req.user.id
  };

  const book = new Book(bookData);
  await book.save();

  await book.populate('categories', 'name slug');

  res.status(201).json({
    success: true,
    data: book,
    message: '书籍创建成功'
  });
}));

// 更新书籍
router.put('/:id', authenticate, adminOnly, ...validateObjectId('id'), validateBook, asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: '书籍未找到'
    });
  }

  Object.assign(book, req.body);
  book.updatedBy = req.user.id;
  await book.save();

  await book.populate('categories', 'name slug');

  res.json({
    success: true,
    data: book,
    message: '书籍更新成功'
  });
}));

// 删除书籍
router.delete('/:id', authenticate, adminOnly, ...validateObjectId('id'), asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: '书籍未找到'
    });
  }

  book.isActive = false;
  book.updatedBy = req.user.id;
  await book.save();

  res.json({
    success: true,
    message: '书籍删除成功'
  });
}));

// 书籍评分
router.post('/:id/rate', authenticate, ...validateObjectId('id'), asyncHandler(async (req, res) => {
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 10) {
    return res.status(400).json({
      success: false,
      message: '评分必须在1-10之间'
    });
  }

  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: '书籍未找到'
    });
  }

  await book.updateRating(req.user.id, rating);

  res.json({
    success: true,
    message: '评分成功',
    data: {
      rating: book.rating,
      ratingCount: book.ratingCount
    }
  });
}));

// 收藏/取消收藏书籍
router.post('/:id/favorite', authenticate, ...validateObjectId('id'), asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: '书籍未找到'
    });
  }

  const user = await User.findById(req.user.id);
  const isFavorited = user.favorites.books.includes(req.params.id);

  if (isFavorited) {
    // 取消收藏
    user.favorites.books.pull(req.params.id);
    book.favoriteCount = Math.max(0, book.favoriteCount - 1);
  } else {
    // 添加收藏
    user.favorites.books.push(req.params.id);
    book.favoriteCount += 1;
  }

  await Promise.all([user.save(), book.save()]);

  res.json({
    success: true,
    message: isFavorited ? '取消收藏成功' : '收藏成功',
    data: {
      favorited: !isFavorited,
      favoriteCount: book.favoriteCount
    }
  });
}));

// 下载书籍
router.post('/:id/download', authenticate, ...validateObjectId('id'), asyncHandler(async (req, res) => {
  const { format = 'pdf' } = req.body;
  
  const book = await Book.findById(req.params.id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: '书籍未找到'
    });
  }

  // 检查格式是否可用
  if (!book.formats.some(f => f.type === format)) {
    return res.status(400).json({
      success: false,
      message: `${format} 格式不可用`
    });
  }

  // 增加下载次数
  await book.incrementDownloadCount();

  // 记录用户下载历史
  await User.findByIdAndUpdate(req.user.id, {
    $addToSet: {
      'downloadHistory.books': {
        item: book._id,
        downloadedAt: new Date(),
        format
      }
    }
  });

  const formatInfo = book.formats.find(f => f.type === format);

  res.json({
    success: true,
    message: '下载开始',
    data: {
      downloadUrl: formatInfo.url,
      format,
      size: formatInfo.size,
      downloadCount: book.downloadCount
    }
  });
}));

// 搜索书籍
router.get('/search/advanced', validateSearch, handleValidationErrors, asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 20 } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: '搜索关键词不能为空'
    });
  }

  const results = await Book.searchBooks(q, {
    page: parseInt(page),
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: results
  });
}));

module.exports = router;