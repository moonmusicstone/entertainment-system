const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    language: {
      type: String,
      default: 'zh-CN'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },
  favorites: {
    movies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie'
    }],
    music: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Music'
    }],
    games: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game'
    }],
    books: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    }]
  },
  watchHistory: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'watchHistory.itemType'
    },
    itemType: {
      type: String,
      enum: ['Movie', 'Music', 'Game', 'Book']
    },
    watchedAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  }],
  lastLogin: {
    type: Date,
    default: Date.now
  },
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Virtual for user's full profile
userSchema.virtual('profile').get(function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    avatar: this.avatar,
    role: this.role,
    preferences: this.preferences,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin
  };
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to add to favorites
userSchema.methods.addToFavorites = function(itemId, itemType) {
  const favoriteType = itemType.toLowerCase() + 's';
  if (this.favorites[favoriteType] && !this.favorites[favoriteType].includes(itemId)) {
    this.favorites[favoriteType].push(itemId);
  }
  return this.save();
};

// Instance method to remove from favorites
userSchema.methods.removeFromFavorites = function(itemId, itemType) {
  const favoriteType = itemType.toLowerCase() + 's';
  if (this.favorites[favoriteType]) {
    this.favorites[favoriteType] = this.favorites[favoriteType].filter(
      id => id.toString() !== itemId.toString()
    );
  }
  return this.save();
};

// Instance method to add to watch history
userSchema.methods.addToWatchHistory = function(itemId, itemType, progress = 0) {
  // Remove existing entry if it exists
  this.watchHistory = this.watchHistory.filter(
    entry => !(entry.item.toString() === itemId.toString() && entry.itemType === itemType)
  );
  
  // Add new entry
  this.watchHistory.unshift({
    item: itemId,
    itemType: itemType,
    progress: progress,
    watchedAt: new Date()
  });
  
  // Keep only last 100 entries
  if (this.watchHistory.length > 100) {
    this.watchHistory = this.watchHistory.slice(0, 100);
  }
  
  return this.save();
};

// Static method to find active users
userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true });
};

// Static method to find users by role
userSchema.statics.findByRole = function(role) {
  return this.find({ role: role, isActive: true });
};

module.exports = mongoose.model('User', userSchema);