const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: ['movie', 'music', 'game', 'book', 'general'],
    required: [true, 'Category type is required']
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 0,
    min: 0,
    max: 3 // Maximum 4 levels (0, 1, 2, 3)
  },
  icon: {
    type: String,
    default: null
  },
  color: {
    type: String,
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color'],
    default: '#6B7280'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  // Statistics
  itemCount: {
    type: Number,
    default: 0
  },
  // SEO
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  // Admin fields
  createdBy: {
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
categorySchema.index({ type: 1, parent: 1, order: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1, isFeatured: 1 });
categorySchema.index({ name: 'text', description: 'text' });

// Virtual for full path
categorySchema.virtual('path').get(function() {
  // This will be populated by a separate method
  return this._path || [];
});

// Virtual for children count
categorySchema.virtual('childrenCount', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
  count: true
});

// Pre-save middleware to generate slug and set level
categorySchema.pre('save', async function(next) {
  try {
    // Generate slug if name is modified
    if (this.isModified('name') || this.isNew) {
      this.slug = this.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .trim('-'); // Remove leading/trailing hyphens
    }

    // Set level based on parent
    if (this.parent) {
      const parent = await this.constructor.findById(this.parent);
      if (parent) {
        this.level = parent.level + 1;
        if (this.level > 3) {
          throw new Error('Maximum category depth exceeded');
        }
      }
    } else {
      this.level = 0;
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Pre-remove middleware to handle children
categorySchema.pre('remove', async function(next) {
  try {
    // Check if category has children
    const childrenCount = await this.constructor.countDocuments({ parent: this._id });
    if (childrenCount > 0) {
      throw new Error('Cannot delete category with children. Please delete children first.');
    }

    // Check if category is being used
    const Movie = mongoose.model('Movie');
    const Music = mongoose.model('Music');
    const Game = mongoose.model('Game');
    const Book = mongoose.model('Book');

    const usageCount = await Promise.all([
      Movie.countDocuments({ genres: this._id }),
      Music.countDocuments({ genres: this._id }),
      Game.countDocuments({ genres: this._id }),
      Book.countDocuments({ genres: this._id })
    ]);

    const totalUsage = usageCount.reduce((sum, count) => sum + count, 0);
    if (totalUsage > 0) {
      throw new Error('Cannot delete category that is being used by content items.');
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to get full path
categorySchema.methods.getPath = async function() {
  const path = [];
  let current = this;

  while (current) {
    path.unshift({
      _id: current._id,
      name: current.name,
      slug: current.slug,
      level: current.level
    });

    if (current.parent) {
      current = await this.constructor.findById(current.parent);
    } else {
      current = null;
    }
  }

  return path;
};

// Instance method to get all children (recursive)
categorySchema.methods.getAllChildren = async function() {
  const children = await this.constructor.find({ parent: this._id, isActive: true });
  let allChildren = [...children];

  for (const child of children) {
    const grandChildren = await child.getAllChildren();
    allChildren = allChildren.concat(grandChildren);
  }

  return allChildren;
};

// Instance method to update item count
categorySchema.methods.updateItemCount = async function() {
  const Movie = mongoose.model('Movie');
  const Music = mongoose.model('Music');
  const Game = mongoose.model('Game');
  const Book = mongoose.model('Book');

  const counts = await Promise.all([
    Movie.countDocuments({ genres: this._id, isActive: true }),
    Music.countDocuments({ genres: this._id, isActive: true }),
    Game.countDocuments({ genres: this._id, isActive: true }),
    Book.countDocuments({ genres: this._id, isActive: true })
  ]);

  this.itemCount = counts.reduce((sum, count) => sum + count, 0);
  return this.save();
};

// Static method to get category tree
categorySchema.statics.getTree = async function(type = null, includeInactive = false) {
  const query = { parent: null };
  if (type) query.type = type;
  if (!includeInactive) query.isActive = true;

  const rootCategories = await this.find(query)
    .sort({ order: 1, name: 1 })
    .populate('createdBy', 'username');

  const buildTree = async (categories) => {
    const tree = [];
    for (const category of categories) {
      const childQuery = { parent: category._id };
      if (!includeInactive) childQuery.isActive = true;

      const children = await this.find(childQuery)
        .sort({ order: 1, name: 1 })
        .populate('createdBy', 'username');

      const categoryObj = category.toObject();
      if (children.length > 0) {
        categoryObj.children = await buildTree(children);
      }
      tree.push(categoryObj);
    }
    return tree;
  };

  return buildTree(rootCategories);
};

// Static method to find by type
categorySchema.statics.findByType = function(type, includeInactive = false) {
  const query = { type };
  if (!includeInactive) query.isActive = true;
  
  return this.find(query)
    .sort({ level: 1, order: 1, name: 1 })
    .populate('parent', 'name slug')
    .populate('createdBy', 'username');
};

// Static method to search categories
categorySchema.statics.search = function(query, type = null) {
  const searchQuery = {
    isActive: true,
    $text: { $search: query }
  };
  
  if (type) searchQuery.type = type;
  
  return this.find(searchQuery)
    .sort({ score: { $meta: 'textScore' } })
    .populate('parent', 'name slug')
    .populate('createdBy', 'username');
};

// Static method to get featured categories
categorySchema.statics.getFeatured = function(type = null, limit = 10) {
  const query = { isFeatured: true, isActive: true };
  if (type) query.type = type;
  
  return this.find(query)
    .sort({ order: 1, itemCount: -1 })
    .limit(limit)
    .populate('createdBy', 'username');
};

module.exports = mongoose.model('Category', categorySchema);