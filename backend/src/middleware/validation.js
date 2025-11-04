const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

// User validation rules
const validateRegister = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

const validateUpdateProfile = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
  
  handleValidationErrors
];

// Movie validation rules
const validateMovie = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('type')
    .isIn(['movie', 'tv', 'variety', 'anime'])
    .withMessage('Type must be one of: movie, tv, variety, anime'),
  
  body('poster')
    .notEmpty()
    .withMessage('Poster is required')
    .isURL()
    .withMessage('Poster must be a valid URL'),
  
  body('releaseDate')
    .isISO8601()
    .withMessage('Release date must be a valid date'),
  
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 2 })
    .withMessage('Year must be between 1900 and 2 years in the future'),
  
  body('genres')
    .isArray({ min: 1 })
    .withMessage('At least one genre is required'),
  
  body('genres.*')
    .isMongoId()
    .withMessage('Each genre must be a valid ID'),
  
  body('director')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Director name cannot exceed 100 characters'),
  
  body('cast')
    .optional()
    .isArray()
    .withMessage('Cast must be an array'),
  
  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive number'),
  
  handleValidationErrors
];

// Music validation rules
const validateMusic = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('artist')
    .notEmpty()
    .withMessage('Artist is required')
    .isLength({ max: 100 })
    .withMessage('Artist name cannot exceed 100 characters'),
  
  body('type')
    .isIn(['song', 'album', 'playlist'])
    .withMessage('Type must be one of: song, album, playlist'),
  
  body('cover')
    .notEmpty()
    .withMessage('Cover is required')
    .isURL()
    .withMessage('Cover must be a valid URL'),
  
  body('releaseDate')
    .isISO8601()
    .withMessage('Release date must be a valid date'),
  
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Year must be between 1900 and 1 year in the future'),
  
  body('genres')
    .isArray({ min: 1 })
    .withMessage('At least one genre is required'),
  
  body('genres.*')
    .isMongoId()
    .withMessage('Each genre must be a valid ID'),
  
  body('duration')
    .if(body('type').equals('song'))
    .isInt({ min: 1 })
    .withMessage('Duration is required for songs and must be a positive number'),
  
  handleValidationErrors
];

// Game validation rules
const validateGame = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('cover')
    .notEmpty()
    .withMessage('Cover is required')
    .isURL()
    .withMessage('Cover must be a valid URL'),
  
  body('developer')
    .notEmpty()
    .withMessage('Developer is required')
    .isLength({ max: 100 })
    .withMessage('Developer name cannot exceed 100 characters'),
  
  body('publisher')
    .notEmpty()
    .withMessage('Publisher is required')
    .isLength({ max: 100 })
    .withMessage('Publisher name cannot exceed 100 characters'),
  
  body('releaseDate')
    .isISO8601()
    .withMessage('Release date must be a valid date'),
  
  body('year')
    .isInt({ min: 1970, max: new Date().getFullYear() + 2 })
    .withMessage('Year must be between 1970 and 2 years in the future'),
  
  body('platforms')
    .isArray({ min: 1 })
    .withMessage('At least one platform is required'),
  
  body('genres')
    .isArray({ min: 1 })
    .withMessage('At least one genre is required'),
  
  body('genres.*')
    .isMongoId()
    .withMessage('Each genre must be a valid ID'),
  
  body('gameMode')
    .isArray({ min: 1 })
    .withMessage('At least one game mode is required'),
  
  body('ageRating')
    .isIn(['E', 'E10+', 'T', 'M', 'AO', 'RP', 'PEGI 3', 'PEGI 7', 'PEGI 12', 'PEGI 16', 'PEGI 18'])
    .withMessage('Invalid age rating'),
  
  handleValidationErrors
];

// Book validation rules
const validateBook = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 300 })
    .withMessage('Title cannot exceed 300 characters'),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters'),
  
  body('type')
    .isIn(['novel', 'comic', 'manga', 'magazine', 'textbook', 'biography', 'poetry', 'essay'])
    .withMessage('Invalid book type'),
  
  body('author')
    .notEmpty()
    .withMessage('Author is required')
    .isLength({ max: 200 })
    .withMessage('Author name cannot exceed 200 characters'),
  
  body('publisher')
    .notEmpty()
    .withMessage('Publisher is required')
    .isLength({ max: 200 })
    .withMessage('Publisher name cannot exceed 200 characters'),
  
  body('cover')
    .notEmpty()
    .withMessage('Cover is required')
    .isURL()
    .withMessage('Cover must be a valid URL'),
  
  body('publishDate')
    .isISO8601()
    .withMessage('Publish date must be a valid date'),
  
  body('year')
    .isInt({ min: 1000, max: new Date().getFullYear() + 1 })
    .withMessage('Year must be between 1000 and 1 year in the future'),
  
  body('language')
    .notEmpty()
    .withMessage('Language is required'),
  
  body('genres')
    .isArray({ min: 1 })
    .withMessage('At least one genre is required'),
  
  body('genres.*')
    .isMongoId()
    .withMessage('Each genre must be a valid ID'),
  
  body('isbn')
    .optional()
    .matches(/^(\d{10}|\d{13})$/)
    .withMessage('ISBN must be 10 or 13 digits'),
  
  handleValidationErrors
];

// Category validation rules
const validateCategory = [
  body('name')
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 100 })
    .withMessage('Category name cannot exceed 100 characters'),
  
  body('type')
    .isIn(['movie', 'music', 'game', 'book'])
    .withMessage('Type must be one of: movie, music, game, book'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('parent')
    .optional()
    .isMongoId()
    .withMessage('Parent must be a valid category ID'),
  
  handleValidationErrors
];

// Query validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

const validateSearch = [
  query('q')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  query('type')
    .optional()
    .isIn(['movie', 'music', 'game', 'book'])
    .withMessage('Type must be one of: movie, music, game, book'),
  
  query('year')
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() + 2 })
    .withMessage('Year must be a valid year'),
  
  query('rating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be between 0 and 10'),
  
  handleValidationErrors
];

// Combined validation for pagination and search
const validatePaginationAndSearch = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('q')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  query('type')
    .optional()
    .isIn(['movie', 'music', 'game', 'book'])
    .withMessage('Type must be one of: movie, music, game, book'),
  
  query('year')
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() + 2 })
    .withMessage('Year must be a valid year'),
  
  query('rating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be between 0 and 10'),

  handleValidationErrors
];

// Validate ObjectId parameter
const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage('Invalid ID format'),

  handleValidationErrors
];

// User update validation
const validateUserUpdate = [
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
  
  body('role')
    .optional()
    .isIn(['user', 'moderator', 'admin'])
    .withMessage('Role must be one of: user, moderator, admin'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateUserUpdate,
  validateMovie,
  validateMusic,
  validateGame,
  validateBook,
  validateCategory,
  validatePagination,
  validateSearch,
  validatePaginationAndSearch,
  validateObjectId
};