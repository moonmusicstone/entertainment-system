const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  artist: {
    type: String,
    required: [true, 'Artist is required'],
    trim: true,
    maxlength: [100, 'Artist name cannot exceed 100 characters']
  },
  album: {
    type: String,
    trim: true,
    maxlength: [200, 'Album name cannot exceed 200 characters']
  },
  type: {
    type: String,
    enum: ['song', 'album', 'playlist'],
    required: [true, 'Type is required'],
    default: 'song'
  },
  cover: {
    type: String,
    required: [true, 'Cover image is required']
  },
  audioFile: {
    type: String, // URL to audio file
    required: function() {
      return this.type === 'song';
    }
  },
  duration: {
    type: Number, // in seconds
    min: [1, 'Duration must be at least 1 second'],
    required: function() {
      return this.type === 'song';
    }
  },
  releaseDate: {
    type: Date,
    required: [true, 'Release date is required']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 1, 'Year cannot be more than 1 year in the future']
  },
  genres: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'At least one genre is required']
  }],
  languages: [{
    type: String,
    required: [true, 'At least one language is required']
  }],
  // Album specific fields
  tracks: [{
    title: {
      type: String,
      required: true
    },
    duration: {
      type: Number, // in seconds
      required: true
    },
    trackNumber: {
      type: Number,
      required: true
    },
    audioFile: String,
    isExplicit: {
      type: Boolean,
      default: false
    }
  }],
  totalTracks: {
    type: Number,
    min: 1
  },
  // Playlist specific fields
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Music'
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  // Artist information
  artistInfo: {
    bio: String,
    avatar: String,
    country: String,
    website: String,
    socialLinks: {
      spotify: String,
      youtube: String,
      instagram: String,
      twitter: String
    }
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
  playCount: {
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
  // External IDs
  externalIds: {
    spotify: String,
    apple: String,
    youtube: String,
    soundcloud: String
  },
  // Content flags
  isExplicit: {
    type: Boolean,
    default: false
  },
  isInstrumental: {
    type: Boolean,
    default: false
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
  lyrics: {
    type: String,
    maxlength: [10000, 'Lyrics cannot exceed 10000 characters']
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
musicSchema.index({ title: 'text', artist: 'text', album: 'text' });
musicSchema.index({ type: 1, year: -1 });
musicSchema.index({ artist: 1, album: 1 });
musicSchema.index({ genres: 1 });
musicSchema.index({ releaseDate: -1 });
musicSchema.index({ 'rating.average': -1 });
musicSchema.index({ playCount: -1 });
musicSchema.index({ isActive: 1, isFeatured: 1 });
musicSchema.index({ slug: 1 });

// Virtual for formatted duration
musicSchema.virtual('formattedDuration').get(function() {
  if (!this.duration) return null;
  const minutes = Math.floor(this.duration / 60);
  const seconds = this.duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Virtual for total album duration
musicSchema.virtual('totalDuration').get(function() {
  if (this.type !== 'album' || !this.tracks || this.tracks.length === 0) return null;
  const total = this.tracks.reduce((sum, track) => sum + track.duration, 0);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Virtual for age category
musicSchema.virtual('ageCategory').get(function() {
  const currentYear = new Date().getFullYear();
  const age = currentYear - this.year;
  
  if (age < 1) return 'new';
  if (age < 3) return 'recent';
  if (age < 10) return 'modern';
  if (age < 20) return 'classic';
  return 'vintage';
});

// Pre-save middleware to generate slug and set totals
musicSchema.pre('save', function(next) {
  // Generate slug
  if (this.isModified('title') || this.isModified('artist') || this.isNew) {
    const slugBase = `${this.artist}-${this.title}`
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim('-'); // Remove leading/trailing hyphens
    
    this.slug = `${slugBase}-${this.year}`;
  }

  // Set total tracks for albums
  if (this.type === 'album' && this.tracks && this.tracks.length > 0) {
    this.totalTracks = this.tracks.length;
    
    // Sort tracks by track number
    this.tracks.sort((a, b) => a.trackNumber - b.trackNumber);
  }

  next();
});

// Instance method to increment play count
musicSchema.methods.incrementPlayCount = function() {
  this.playCount += 1;
  return this.save();
};

// Instance method to update rating
musicSchema.methods.updateRating = function(newRating) {
  const totalRating = this.rating.average * this.rating.count + newRating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  return this.save();
};

// Instance method to add track (for albums)
musicSchema.methods.addTrack = function(trackData) {
  if (this.type !== 'album') {
    throw new Error('Can only add tracks to albums');
  }
  
  this.tracks.push(trackData);
  this.totalTracks = this.tracks.length;
  return this.save();
};

// Instance method to add song to playlist
musicSchema.methods.addSong = function(songId) {
  if (this.type !== 'playlist') {
    throw new Error('Can only add songs to playlists');
  }
  
  if (!this.songs.includes(songId)) {
    this.songs.push(songId);
  }
  return this.save();
};

// Static method to find by type
musicSchema.statics.findByType = function(type) {
  return this.find({ type: type, isActive: true });
};

// Static method to find by artist
musicSchema.statics.findByArtist = function(artist) {
  return this.find({ 
    artist: new RegExp(artist, 'i'), 
    isActive: true 
  }).sort({ releaseDate: -1 });
};

// Static method to find featured content
musicSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ isFeatured: true, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('genres', 'name')
    .populate('addedBy', 'username');
};

// Static method to find by genre
musicSchema.statics.findByGenre = function(genreId) {
  return this.find({ genres: genreId, isActive: true })
    .populate('genres', 'name');
};

// Static method to get top played
musicSchema.statics.getTopPlayed = function(limit = 20, type = null) {
  const query = { isActive: true };
  if (type) query.type = type;
  
  return this.find(query)
    .sort({ playCount: -1 })
    .limit(limit)
    .populate('genres', 'name');
};

// Static method to search
musicSchema.statics.search = function(query, options = {}) {
  const {
    type,
    genres,
    artist,
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
  if (artist) searchQuery.artist = new RegExp(artist, 'i');
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
musicSchema.statics.getRecommendations = function(userId, limit = 10) {
  // This is a simple implementation - in production, you'd use more sophisticated algorithms
  return this.find({ 
    isRecommended: true, 
    isActive: true 
  })
    .sort({ 'rating.average': -1, playCount: -1 })
    .limit(limit)
    .populate('genres', 'name');
};

module.exports = mongoose.model('Music', musicSchema);