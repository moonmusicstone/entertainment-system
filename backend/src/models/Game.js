const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  cover: {
    type: String,
    required: [true, 'Cover image is required']
  },
  screenshots: [{
    type: String
  }],
  trailer: {
    type: String // URL to trailer video
  },
  developer: {
    type: String,
    required: [true, 'Developer is required'],
    trim: true,
    maxlength: [100, 'Developer name cannot exceed 100 characters']
  },
  publisher: {
    type: String,
    required: [true, 'Publisher is required'],
    trim: true,
    maxlength: [100, 'Publisher name cannot exceed 100 characters']
  },
  releaseDate: {
    type: Date,
    required: [true, 'Release date is required']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1970, 'Year must be after 1970'],
    max: [new Date().getFullYear() + 2, 'Year cannot be more than 2 years in the future']
  },
  platforms: [{
    type: String,
    enum: [
      'PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X/S', 'Xbox One',
      'Nintendo Switch', 'iOS', 'Android', 'Mac', 'Linux', 'VR',
      'PlayStation 3', 'Xbox 360', 'Nintendo 3DS', 'PlayStation Vita'
    ],
    required: [true, 'At least one platform is required']
  }],
  genres: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'At least one genre is required']
  }],
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  // Game details
  gameMode: [{
    type: String,
    enum: ['Single-player', 'Multiplayer', 'Co-op', 'Online', 'Local'],
    required: [true, 'At least one game mode is required']
  }],
  ageRating: {
    type: String,
    enum: ['E', 'E10+', 'T', 'M', 'AO', 'RP', 'PEGI 3', 'PEGI 7', 'PEGI 12', 'PEGI 16', 'PEGI 18'],
    required: [true, 'Age rating is required']
  },
  languages: [{
    type: String,
    required: [true, 'At least one language is required']
  }],
  // System requirements (for PC games)
  systemRequirements: {
    minimum: {
      os: String,
      processor: String,
      memory: String,
      graphics: String,
      storage: String,
      additional: String
    },
    recommended: {
      os: String,
      processor: String,
      memory: String,
      graphics: String,
      storage: String,
      additional: String
    }
  },
  // Pricing
  price: {
    current: {
      type: Number,
      min: 0,
      default: 0
    },
    original: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    isFree: {
      type: Boolean,
      default: false
    },
    isOnSale: {
      type: Boolean,
      default: false
    },
    saleEndDate: Date
  },
  // Ratings and statistics
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    },
    count: {
      type: Number,
      default: 0
    }
  },
  metacriticScore: {
    type: Number,
    min: 0,
    max: 100
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  playCount: {
    type: Number,
    default: 0
  },
  favorites: {
    type: Number,
    default: 0
  },
  // External links and IDs
  externalIds: {
    steam: String,
    epic: String,
    gog: String,
    origin: String,
    uplay: String,
    battlenet: String,
    appstore: String,
    googleplay: String
  },
  officialWebsite: String,
  // Content flags
  isEarlyAccess: {
    type: Boolean,
    default: false
  },
  isDLC: {
    type: Boolean,
    default: false
  },
  parentGame: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  },
  dlcList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }],
  // SEO and metadata
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  // Content management
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isRecommended: {
    type: Boolean,
    default: false
  },
  isComingSoon: {
    type: Boolean,
    default: false
  },
  // Admin fields
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
gameSchema.index({ title: 'text', description: 'text', developer: 'text', publisher: 'text' });
gameSchema.index({ year: -1 });
gameSchema.index({ platforms: 1 });
gameSchema.index({ genres: 1 });
gameSchema.index({ releaseDate: -1 });
gameSchema.index({ 'rating.average': -1 });
gameSchema.index({ downloadCount: -1 });
gameSchema.index({ isActive: 1, isFeatured: 1 });
gameSchema.index({ slug: 1 });
gameSchema.index({ 'price.current': 1 });
gameSchema.index({ isComingSoon: 1 });

// Virtual for discount percentage
gameSchema.virtual('discountPercentage').get(function() {
  if (!this.price.original || !this.price.isOnSale) return 0;
  return Math.round(((this.price.original - this.price.current) / this.price.original) * 100);
});

// Virtual for release status
gameSchema.virtual('releaseStatus').get(function() {
  const now = new Date();
  if (this.releaseDate > now) return 'coming-soon';
  if (this.isEarlyAccess) return 'early-access';
  return 'released';
});

// Virtual for age category
gameSchema.virtual('ageCategory').get(function() {
  const currentYear = new Date().getFullYear();
  const age = currentYear - this.year;
  
  if (age < 1) return 'new';
  if (age < 3) return 'recent';
  if (age < 10) return 'modern';
  if (age < 20) return 'retro';
  return 'classic';
});

// Virtual for formatted price
gameSchema.virtual('formattedPrice').get(function() {
  if (this.price.isFree) return 'Free';
  if (this.price.current === 0) return 'Free';
  
  const symbol = this.price.currency === 'USD' ? '$' : 
                 this.price.currency === 'EUR' ? '€' : 
                 this.price.currency === 'GBP' ? '£' : 
                 this.price.currency;
  
  return `${symbol}${this.price.current.toFixed(2)}`;
});

// Pre-save middleware to generate slug
gameSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    const slugBase = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim('-'); // Remove leading/trailing hyphens
    
    this.slug = `${slugBase}-${this.year}`;
  }

  // Set sale status based on sale end date
  if (this.price.saleEndDate && this.price.saleEndDate < new Date()) {
    this.price.isOnSale = false;
    this.price.saleEndDate = undefined;
  }

  next();
});

// Instance method to increment download count
gameSchema.methods.incrementDownloadCount = function() {
  this.downloadCount += 1;
  return this.save();
};

// Instance method to increment play count
gameSchema.methods.incrementPlayCount = function() {
  this.playCount += 1;
  return this.save();
};

// Instance method to update rating
gameSchema.methods.updateRating = function(newRating) {
  const totalRating = this.rating.average * this.rating.count + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  return this.save();
};

// Instance method to set sale
gameSchema.methods.setSale = function(salePrice, endDate) {
  this.price.original = this.price.current;
  this.price.current = salePrice;
  this.price.isOnSale = true;
  this.price.saleEndDate = endDate;
  return this.save();
};

// Static method to find by platform
gameSchema.statics.findByPlatform = function(platform) {
  return this.find({ 
    platforms: platform, 
    isActive: true 
  }).sort({ releaseDate: -1 });
};

// Static method to find featured games
gameSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ isFeatured: true, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('genres', 'name')
    .populate('addedBy', 'username');
};

// Static method to find by genre
gameSchema.statics.findByGenre = function(genreId) {
  return this.find({ genres: genreId, isActive: true })
    .populate('genres', 'name');
};

// Static method to find coming soon games
gameSchema.statics.findComingSoon = function(limit = 10) {
  return this.find({ 
    isComingSoon: true, 
    isActive: true,
    releaseDate: { $gt: new Date() }
  })
    .sort({ releaseDate: 1 })
    .limit(limit)
    .populate('genres', 'name');
};

// Static method to find free games
gameSchema.statics.findFreeGames = function(limit = 20) {
  return this.find({ 
    'price.isFree': true, 
    isActive: true 
  })
    .sort({ 'rating.average': -1 })
    .limit(limit)
    .populate('genres', 'name');
};

// Static method to find games on sale
gameSchema.statics.findOnSale = function(limit = 20) {
  return this.find({ 
    'price.isOnSale': true, 
    isActive: true,
    'price.saleEndDate': { $gt: new Date() }
  })
    .sort({ discountPercentage: -1 })
    .limit(limit)
    .populate('genres', 'name');
};

// Static method to get top rated games
gameSchema.statics.getTopRated = function(limit = 20, platform = null) {
  const query = { isActive: true, 'rating.count': { $gte: 10 } };
  if (platform) query.platforms = platform;
  
  return this.find(query)
    .sort({ 'rating.average': -1 })
    .limit(limit)
    .populate('genres', 'name');
};

// Static method to search games
gameSchema.statics.search = function(query, options = {}) {
  const {
    platforms,
    genres,
    developer,
    publisher,
    yearFrom,
    yearTo,
    priceFrom,
    priceTo,
    ratingFrom,
    ratingTo,
    isFree,
    isOnSale,
    isComingSoon,
    limit = 20,
    skip = 0,
    sort = { createdAt: -1 }
  } = options;

  let searchQuery = {
    isActive: true,
    $text: { $search: query }
  };

  if (platforms && platforms.length > 0) searchQuery.platforms = { $in: platforms };
  if (genres && genres.length > 0) searchQuery.genres = { $in: genres };
  if (developer) searchQuery.developer = new RegExp(developer, 'i');
  if (publisher) searchQuery.publisher = new RegExp(publisher, 'i');
  if (yearFrom || yearTo) {
    searchQuery.year = {};
    if (yearFrom) searchQuery.year.$gte = yearFrom;
    if (yearTo) searchQuery.year.$lte = yearTo;
  }
  if (priceFrom !== undefined || priceTo !== undefined) {
    searchQuery['price.current'] = {};
    if (priceFrom !== undefined) searchQuery['price.current'].$gte = priceFrom;
    if (priceTo !== undefined) searchQuery['price.current'].$lte = priceTo;
  }
  if (ratingFrom || ratingTo) {
    searchQuery['rating.average'] = {};
    if (ratingFrom) searchQuery['rating.average'].$gte = ratingFrom;
    if (ratingTo) searchQuery['rating.average'].$lte = ratingTo;
  }
  if (isFree !== undefined) searchQuery['price.isFree'] = isFree;
  if (isOnSale !== undefined) searchQuery['price.isOnSale'] = isOnSale;
  if (isComingSoon !== undefined) searchQuery.isComingSoon = isComingSoon;

  return this.find(searchQuery)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('genres', 'name')
    .populate('addedBy', 'username');
};

// Static method to get recommendations
gameSchema.statics.getRecommendations = function(userId, limit = 10) {
  // This is a simple implementation - in production, you'd use more sophisticated algorithms
  return this.find({ 
    isRecommended: true, 
    isActive: true 
  })
    .sort({ 'rating.average': -1, downloadCount: -1 })
    .limit(limit)
    .populate('genres', 'name');
};

module.exports = mongoose.model('Game', gameSchema);