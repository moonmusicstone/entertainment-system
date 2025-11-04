const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [300, 'Title cannot exceed 300 characters']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [300, 'Subtitle cannot exceed 300 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  cover: {
    type: String,
    required: [true, 'Cover image is required']
  },
  type: {
    type: String,
    enum: ['novel', 'comic', 'manga', 'magazine', 'textbook', 'biography', 'poetry', 'essay'],
    required: [true, 'Type is required'],
    default: 'novel'
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    maxlength: [200, 'Author name cannot exceed 200 characters']
  },
  translator: {
    type: String,
    trim: true,
    maxlength: [200, 'Translator name cannot exceed 200 characters']
  },
  publisher: {
    type: String,
    required: [true, 'Publisher is required'],
    trim: true,
    maxlength: [200, 'Publisher name cannot exceed 200 characters']
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty ISBN
        // Basic ISBN-10 or ISBN-13 validation
        const isbn = v.replace(/[-\s]/g, '');
        return /^(\d{10}|\d{13})$/.test(isbn);
      },
      message: 'Invalid ISBN format'
    }
  },
  publishDate: {
    type: Date,
    required: [true, 'Publish date is required']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1000, 'Year must be after 1000'],
    max: [new Date().getFullYear() + 1, 'Year cannot be more than 1 year in the future']
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    default: 'Chinese'
  },
  originalLanguage: {
    type: String
  },
  // Book details
  pages: {
    type: Number,
    min: [1, 'Pages must be at least 1']
  },
  wordCount: {
    type: Number,
    min: [1, 'Word count must be at least 1']
  },
  chapters: {
    type: Number,
    min: [1, 'Chapters must be at least 1']
  },
  // Series information
  series: {
    name: String,
    volume: Number,
    totalVolumes: Number
  },
  // Categories and tags
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
  // Content status (for ongoing series like web novels)
  status: {
    type: String,
    enum: ['completed', 'ongoing', 'hiatus', 'cancelled'],
    default: 'completed'
  },
  // Age rating
  ageRating: {
    type: String,
    enum: ['all', '12+', '16+', '18+'],
    default: 'all'
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
  readCount: {
    type: Number,
    default: 0
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  favorites: {
    type: Number,
    default: 0
  },
  // File information
  formats: [{
    type: {
      type: String,
      enum: ['pdf', 'epub', 'mobi', 'txt', 'doc', 'docx'],
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number, // in bytes
      required: true
    }
  }],
  // External IDs and links
  externalIds: {
    goodreads: String,
    douban: String,
    amazon: String,
    googleBooks: String
  },
  // Content flags
  isFree: {
    type: Boolean,
    default: true
  },
  isOriginal: {
    type: Boolean,
    default: true // true for original works, false for translations
  },
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
  isPopular: {
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
bookSchema.index({ title: 'text', author: 'text', description: 'text' });
bookSchema.index({ type: 1, year: -1 });
bookSchema.index({ author: 1 });
bookSchema.index({ publisher: 1 });
bookSchema.index({ genres: 1 });
bookSchema.index({ publishDate: -1 });
bookSchema.index({ 'rating.average': -1 });
bookSchema.index({ readCount: -1 });
bookSchema.index({ isActive: 1, isFeatured: 1 });
bookSchema.index({ slug: 1 });
bookSchema.index({ isbn: 1 });
bookSchema.index({ status: 1 });
bookSchema.index({ language: 1 });

// Virtual for formatted page count
bookSchema.virtual('formattedPages').get(function() {
  if (!this.pages) return null;
  return `${this.pages.toLocaleString()} pages`;
});

// Virtual for formatted word count
bookSchema.virtual('formattedWordCount').get(function() {
  if (!this.wordCount) return null;
  if (this.wordCount < 1000) return `${this.wordCount} words`;
  if (this.wordCount < 1000000) return `${Math.round(this.wordCount / 1000)}K words`;
  return `${Math.round(this.wordCount / 1000000)}M words`;
});

// Virtual for reading time estimate (assuming 250 words per minute)
bookSchema.virtual('estimatedReadingTime').get(function() {
  if (!this.wordCount) return null;
  const minutes = Math.round(this.wordCount / 250);
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hours`;
  const days = Math.round(hours / 24);
  return `${days} days`;
});

// Virtual for age category
bookSchema.virtual('ageCategory').get(function() {
  const currentYear = new Date().getFullYear();
  const age = currentYear - this.year;
  
  if (age < 1) return 'new';
  if (age < 5) return 'recent';
  if (age < 20) return 'modern';
  if (age < 50) return 'classic';
  return 'vintage';
});

// Virtual for series info
bookSchema.virtual('seriesInfo').get(function() {
  if (!this.series || !this.series.name) return null;
  
  let info = this.series.name;
  if (this.series.volume) {
    info += ` (Vol. ${this.series.volume}`;
    if (this.series.totalVolumes) {
      info += ` of ${this.series.totalVolumes}`;
    }
    info += ')';
  }
  return info;
});

// Virtual for available formats
bookSchema.virtual('availableFormats').get(function() {
  return this.formats.map(format => format.type.toUpperCase()).join(', ');
});

// Pre-save middleware to generate slug
bookSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isModified('author') || this.isNew) {
    const slugBase = `${this.title}-${this.author}`
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim('-'); // Remove leading/trailing hyphens
    
    this.slug = `${slugBase}-${this.year}`;
  }

  // Set original language if not specified
  if (!this.originalLanguage) {
    this.originalLanguage = this.language;
  }

  next();
});

// Instance method to increment read count
bookSchema.methods.incrementReadCount = function() {
  this.readCount += 1;
  return this.save();
};

// Instance method to increment download count
bookSchema.methods.incrementDownloadCount = function() {
  this.downloadCount += 1;
  return this.save();
};

// Instance method to update rating
bookSchema.methods.updateRating = function(newRating) {
  const totalRating = this.rating.average * this.rating.count + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  return this.save();
};

// Instance method to add format
bookSchema.methods.addFormat = function(formatData) {
  // Check if format already exists
  const existingFormat = this.formats.find(f => f.type === formatData.type);
  if (existingFormat) {
    // Update existing format
    existingFormat.fileUrl = formatData.fileUrl;
    existingFormat.fileSize = formatData.fileSize;
  } else {
    // Add new format
    this.formats.push(formatData);
  }
  return this.save();
};

// Static method to find by type
bookSchema.statics.findByType = function(type) {
  return this.find({ type: type, isActive: true });
};

// Static method to find by author
bookSchema.statics.findByAuthor = function(author) {
  return this.find({ 
    author: new RegExp(author, 'i'), 
    isActive: true 
  }).sort({ publishDate: -1 });
};

// Static method to find featured books
bookSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ isFeatured: true, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('genres', 'name')
    .populate('addedBy', 'username');
};

// Static method to find by genre
bookSchema.statics.findByGenre = function(genreId) {
  return this.find({ genres: genreId, isActive: true })
    .populate('genres', 'name');
};

// Static method to find by series
bookSchema.statics.findBySeries = function(seriesName) {
  return this.find({ 
    'series.name': new RegExp(seriesName, 'i'), 
    isActive: true 
  }).sort({ 'series.volume': 1 });
};

// Static method to find ongoing series
bookSchema.statics.findOngoing = function(limit = 20) {
  return this.find({ 
    status: 'ongoing', 
    isActive: true 
  })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .populate('genres', 'name');
};

// Static method to get top rated books
bookSchema.statics.getTopRated = function(limit = 20, type = null) {
  const query = { isActive: true, 'rating.count': { $gte: 5 } };
  if (type) query.type = type;
  
  return this.find(query)
    .sort({ 'rating.average': -1 })
    .limit(limit)
    .populate('genres', 'name');
};

// Static method to get most read books
bookSchema.statics.getMostRead = function(limit = 20, type = null) {
  const query = { isActive: true };
  if (type) query.type = type;
  
  return this.find(query)
    .sort({ readCount: -1 })
    .limit(limit)
    .populate('genres', 'name');
};

// Static method to search books
bookSchema.statics.search = function(query, options = {}) {
  const {
    type,
    genres,
    author,
    publisher,
    language,
    yearFrom,
    yearTo,
    ratingFrom,
    ratingTo,
    status,
    ageRating,
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
  if (author) searchQuery.author = new RegExp(author, 'i');
  if (publisher) searchQuery.publisher = new RegExp(publisher, 'i');
  if (language) searchQuery.language = language;
  if (status) searchQuery.status = status;
  if (ageRating) searchQuery.ageRating = ageRating;
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

// Static method to get recommendations
bookSchema.statics.getRecommendations = function(userId, limit = 10) {
  // This is a simple implementation - in production, you'd use more sophisticated algorithms
  return this.find({ 
    isRecommended: true, 
    isActive: true 
  })
    .sort({ 'rating.average': -1, readCount: -1 })
    .limit(limit)
    .populate('genres', 'name');
};

module.exports = mongoose.model('Book', bookSchema);