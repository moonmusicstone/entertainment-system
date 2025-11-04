const express = require('express');
const Movie = require('../models/Movie');
const { auth, optionalAuth, adminOnly, moderatorOrAdmin } = require('../middleware/auth');
const { validateMovie, validatePagination, validateSearch, validateObjectId } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
router.get('/', validatePagination, validateSearch, asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    q,
    type,
    genres,
    year,
    yearFrom,
    yearTo,
    rating,
    ratingFrom,
    ratingTo,
    country,
    language,
    status,
    sort = 'createdAt',
    order = 'desc'
  } = req.query;

  const skip = (page - 1) * limit;
  let query = { isActive: true };
  let sortObj = {};

  // Build search query
  if (q) {
    query.$text = { $search: q };
  }

  if (type) query.type = type;
  if (genres) {
    const genreArray = Array.isArray(genres) ? genres : [genres];
    query.genres = { $in: genreArray };
  }
  if (country) query.country = country;
  if (language) query.languages = language;
  if (status) query.status = status;

  // Year filtering
  if (year) {
    query.year = year;
  } else if (yearFrom || yearTo) {
    query.year = {};
    if (yearFrom) query.year.$gte = parseInt(yearFrom);
    if (yearTo) query.year.$lte = parseInt(yearTo);
  }

  // Rating filtering
  if (rating) {
    query['rating.average'] = { $gte: parseFloat(rating) };
  } else if (ratingFrom || ratingTo) {
    query['rating.average'] = {};
    if (ratingFrom) query['rating.average'].$gte = parseFloat(ratingFrom);
    if (ratingTo) query['rating.average'].$lte = parseFloat(ratingTo);
  }

  // Build sort object
  const sortOrder = order === 'desc' ? -1 : 1;
  if (sort === 'rating') {
    sortObj['rating.average'] = sortOrder;
  } else if (sort === 'year') {
    sortObj.year = sortOrder;
  } else if (sort === 'views') {
    sortObj.viewCount = sortOrder;
  } else if (sort === 'title') {
    sortObj.title = sortOrder;
  } else {
    sortObj.createdAt = sortOrder;
  }

  const movies = await Movie.find(query)
    .populate('genres', 'name slug')
    .populate('addedBy', 'username')
    .sort(sortObj)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Movie.countDocuments(query);

  res.json({
    success: true,
    data: {
      movies,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    }
  });
}));

// @desc    Get featured movies
// @route   GET /api/movies/featured
// @access  Public
router.get('/featured', asyncHandler(async (req, res) => {
  const { limit = 10, type } = req.query;
  
  let query = { isFeatured: true, isActive: true };
  if (type) query.type = type;

  const movies = await Movie.find(query)
    .populate('genres', 'name slug')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: { movies }
  });
}));

// @desc    Get trending movies
// @route   GET /api/movies/trending
// @access  Public
router.get('/trending', asyncHandler(async (req, res) => {
  const { limit = 20, type, period = 'week' } = req.query;
  
  let query = { isActive: true };
  if (type) query.type = type;

  // Calculate date range for trending
  const now = new Date();
  const periodDays = period === 'day' ? 1 : period === 'week' ? 7 : 30;
  const startDate = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000));
  
  query.createdAt = { $gte: startDate };

  const movies = await Movie.find(query)
    .populate('genres', 'name slug')
    .sort({ viewCount: -1, 'rating.average': -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: { movies }
  });
}));

// @desc    Get top rated movies
// @route   GET /api/movies/top-rated
// @access  Public
router.get('/top-rated', asyncHandler(async (req, res) => {
  const { limit = 20, type } = req.query;
  
  let query = { 
    isActive: true,
    'rating.count': { $gte: 10 } // Minimum 10 ratings
  };
  if (type) query.type = type;

  const movies = await Movie.find(query)
    .populate('genres', 'name slug')
    .sort({ 'rating.average': -1, 'rating.count': -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: { movies }
  });
}));

// @desc    Get movie by ID or slug
// @route   GET /api/movies/:id
// @access  Public
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Try to find by ID first, then by slug
  let movie = await Movie.findById(id).catch(() => null);
  if (!movie) {
    movie = await Movie.findOne({ slug: id, isActive: true });
  }

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: 'Movie not found'
    });
  }

  // Populate related data
  await movie.populate('genres', 'name slug');
  await movie.populate('addedBy', 'username');

  // Increment view count
  movie.viewCount += 1;
  await movie.save();

  // Add to user's watch history if authenticated
  if (req.user) {
    await req.user.addToWatchHistory(movie._id, 'movie');
  }

  res.json({
    success: true,
    data: { movie }
  });
}));

// @desc    Create movie
// @route   POST /api/movies
// @access  Private (Admin/Moderator)
router.post('/', auth, moderatorOrAdmin, validateMovie, asyncHandler(async (req, res) => {
  const movieData = {
    ...req.body,
    addedBy: req.user._id
  };

  const movie = await Movie.create(movieData);
  await movie.populate('genres', 'name slug');
  await movie.populate('addedBy', 'username');

  res.status(201).json({
    success: true,
    message: 'Movie created successfully',
    data: { movie }
  });
}));

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private (Admin/Moderator)
router.put('/:id', auth, moderatorOrAdmin, validateObjectId, validateMovie, asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: 'Movie not found'
    });
  }

  const updatedMovie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      lastModifiedBy: req.user._id
    },
    { new: true, runValidators: true }
  );

  await updatedMovie.populate('genres', 'name slug');
  await updatedMovie.populate('addedBy', 'username');

  res.json({
    success: true,
    message: 'Movie updated successfully',
    data: { movie: updatedMovie }
  });
}));

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private (Admin)
router.delete('/:id', auth, adminOnly, validateObjectId, asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: 'Movie not found'
    });
  }

  // Soft delete
  movie.isActive = false;
  movie.lastModifiedBy = req.user._id;
  await movie.save();

  res.json({
    success: true,
    message: 'Movie deleted successfully'
  });
}));

// @desc    Rate movie
// @route   POST /api/movies/:id/rate
// @access  Private
router.post('/:id/rate', auth, validateObjectId, asyncHandler(async (req, res) => {
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 10) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 10'
    });
  }

  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: 'Movie not found'
    });
  }

  await movie.updateRating(rating);

  res.json({
    success: true,
    message: 'Rating submitted successfully',
    data: {
      rating: {
        average: movie.rating.average,
        count: movie.rating.count
      }
    }
  });
}));

// @desc    Toggle favorite
// @route   POST /api/movies/:id/favorite
// @access  Private
router.post('/:id/favorite', auth, validateObjectId, asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: 'Movie not found'
    });
  }

  const isFavorited = await req.user.toggleFavorite(movie._id, 'movies');

  res.json({
    success: true,
    message: isFavorited ? 'Added to favorites' : 'Removed from favorites',
    data: { isFavorited }
  });
}));

// @desc    Get movie recommendations
// @route   GET /api/movies/:id/recommendations
// @access  Public
router.get('/:id/recommendations', validateObjectId, asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: 'Movie not found'
    });
  }

  // Find similar movies based on genres and type
  const recommendations = await Movie.find({
    _id: { $ne: movie._id },
    type: movie.type,
    genres: { $in: movie.genres },
    isActive: true
  })
    .populate('genres', 'name slug')
    .sort({ 'rating.average': -1, viewCount: -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: { recommendations }
  });
}));

// @desc    Search movies
// @route   GET /api/movies/search
// @access  Public
router.get('/search', validateSearch, asyncHandler(async (req, res) => {
  const {
    q,
    type,
    genres,
    yearFrom,
    yearTo,
    ratingFrom,
    ratingTo,
    country,
    language,
    limit = 20,
    skip = 0
  } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const options = {
    type,
    genres: genres ? (Array.isArray(genres) ? genres : [genres]) : undefined,
    yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
    yearTo: yearTo ? parseInt(yearTo) : undefined,
    ratingFrom: ratingFrom ? parseFloat(ratingFrom) : undefined,
    ratingTo: ratingTo ? parseFloat(ratingTo) : undefined,
    country,
    language,
    limit: parseInt(limit),
    skip: parseInt(skip)
  };

  const movies = await Movie.search(q, options);

  res.json({
    success: true,
    data: { movies }
  });
}));

module.exports = router;