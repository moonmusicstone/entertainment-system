const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  originalTitle: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['movie', 'tv', 'variety', 'anime', 'documentary'],
    required: [true, 'Type is required'],
    default: 'movie'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  poster: {
    type: String,
    required: [true, 'Poster is required']
  },
  backdrop: {
    type: String
  },
  trailer: {
    type: String
  },
  releaseDate: {
    type: Date,
    required: [true, 'Release date is required']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 5, 'Year cannot be more than 5 years in the future']
  },
  duration: {
    type: Number, // in minutes
    min: [1, 'Duration must be at least 1 minute']
  },
  genres: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'At least one genre is required']
  }],
  countries: [{
    type: String,
    required: [true, 'At least one country is required']
  }],
  languages: [{
    type: String,
    required: [true, 'At least one language is required']
  }],
  director: [{
    name: {
      type: String,
      required: true
    },
    avatar: String
  }],
  cast: [{
    name: {
      type: String,
      required: true
    },
    character: String,
    avatar: String,
    order: {
      type: Number,
      default: 0
    }
  }],
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
    },
    imdb: {
      type: Number,
      min: 0,
      max: 10
    },
    tmdb: {
      type: Number,
      min: 0,
      max: 10
    }
  },
  status: {
    type: String,
    enum: ['released', 'upcoming', 'in_production', 'post_production', 'cancelled'],
    default: 'released'
  },
  budget: {
    type: Number,
    min: 0
  },
  revenue: {
    type: Number,
    min: 0
  },
  // TV Series specific fields
  seasons: {
    type: Number,
    min: 1
  },
  episodes: {
    type: Number,
    min: 1
  },
  episodeDuration: {
    type: Number, // average episode duration in minutes
    min: 1
  },
  // External IDs
  externalIds: {
    imdb: String,
    tmdb: Number,
    douban: String
  },
  // SEO and metadata
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  // Statistics
  views: {
    type: Number,
    default: 0
  },
  favorites: {
    type: Number,
    default: 0
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
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ type: 1, year: -1 });
movieSchema.index({ genres: 1 });
movieSchema.index({ countries: 1 });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ 'rating.average': -1 });
movieSchema.index({ views: -1 });
movieSchema.index({ isActive: 1, isFeatured: 1 });
movieSchema.index({ slug: 1 });

// Virtual for formatted duration
movieSchema.virtual('formattedDuration').get(function() {
  if (!this.duration) return null;
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
});

// Virtual for age category
movieSchema.virtual('ageCategory').get(function() {
  const currentYear = new Date().getFullYear();
  const age = currentYear - this.year;
  
  if (age < 1) return 'new';
  if (age < 5) return 'recent';
  if (age < 10) return 'modern';
  if (age < 20) return 'classic';
  return 'vintage';
});

// Pre-save middleware to generate slug
movieSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim('-'); // Remove leading/trailing hyphens
    
    // Add year to make slug unique
    this.slug += `-${this.year}`;
  }
  next();
});

// Instance method to increment views
movieSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to update rating
movieSchema.methods.updateRating = function(newRating) {
  const totalRating = this.rating.average * this.rating.count + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  return this.save();
};

// Static method to find by type
movieSchema.statics.findByType = function(type) {
  return this.find({ type: type, isActive: true });
};

// Static method to find featured content
movieSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ isFeatured: true, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('genres', 'name')
    .populate('addedBy', 'username');
};

// Static method to find by genre
movieSchema.statics.findByGenre = function(genreId) {
  return this.find({ genres: genreId, isActive: true })
    .populate('genres', 'name');
};

// Static method to search
movieSchema.statics.search = function(query, options = {}) {
  const {
    type,
    genres,
    countries,
    yearFrom,
    yearTo,
    ratingFrom,
    ratingTo,
    limit = 20,
    skip = 0,
    sort = { createdAt: -1 }
  } = options;

  let searchQuery = {
    isActive: true,
    $text: { $search: query }
  };

  if (type) searchQuery.type = type;
  if (genres && genres.length > 0) searchQuery.genres = { $in: genres };
  if (countries && countries.length > 0) searchQuery.countries = { $in: countries };
  if (yearFrom || yearTo) {
    searchQuery.year = {};
    if (yearFrom) searchQuery.year.$gte = yearFrom;
    if (yearTo) searchQuery.year.$lte = yearTo;
  }
  if (ratingFrom || ratingTo) {
    searchQuery['rating.average'] = {};
    if (ratingFrom) searchQuery['rating.average'].$gte = ratingFrom;
    if (ratingTo) searchQuery['rating.average'].$lte = ratingTo;
  }

  return this.find(searchQuery)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('genres', 'name')
    .populate('addedBy', 'username');
};

module.exports = mongoose.model('Movie', movieSchema);