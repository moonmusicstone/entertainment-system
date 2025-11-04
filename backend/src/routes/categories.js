const express = require('express');
const Category = require('../models/Category');
const { auth, adminOnly, moderatorOrAdmin } = require('../middleware/auth');
const { validateCategory, validateObjectId } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const { type, parent, featured, active = true } = req.query;
  
  let query = {};
  
  if (type) query.type = type;
  if (parent) query.parent = parent;
  if (featured !== undefined) query.isFeatured = featured === 'true';
  if (active !== undefined) query.isActive = active === 'true';

  const categories = await Category.find(query)
    .populate('parent', 'name slug')
    .populate('createdBy', 'username')
    .sort({ order: 1, name: 1 });

  res.json({
    success: true,
    data: { categories }
  });
}));

// @desc    Get category tree
// @route   GET /api/categories/tree
// @access  Public
router.get('/tree', asyncHandler(async (req, res) => {
  const { type } = req.query;
  
  const tree = await Category.getCategoryTree(type);

  res.json({
    success: true,
    data: { tree }
  });
}));

// @desc    Get featured categories
// @route   GET /api/categories/featured
// @access  Public
router.get('/featured', asyncHandler(async (req, res) => {
  const { type, limit = 10 } = req.query;
  
  const categories = await Category.getFeatured(type, parseInt(limit));

  res.json({
    success: true,
    data: { categories }
  });
}));

// @desc    Get category by ID or slug
// @route   GET /api/categories/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Try to find by ID first, then by slug
  let category = await Category.findById(id).catch(() => null);
  if (!category) {
    category = await Category.findOne({ slug: id, isActive: true });
  }

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  // Populate related data
  await category.populate('parent', 'name slug');
  await category.populate('createdBy', 'username');

  // Get subcategories
  const subcategories = await category.getAllSubcategories();

  res.json({
    success: true,
    data: { 
      category,
      subcategories
    }
  });
}));

// @desc    Create category
// @route   POST /api/categories
// @access  Private (Admin/Moderator)
router.post('/', auth, moderatorOrAdmin, validateCategory, asyncHandler(async (req, res) => {
  const categoryData = {
    ...req.body,
    createdBy: req.user._id
  };

  // Validate parent category if provided
  if (categoryData.parent) {
    const parentCategory = await Category.findById(categoryData.parent);
    if (!parentCategory) {
      return res.status(400).json({
        success: false,
        message: 'Parent category not found'
      });
    }

    // Check if parent is of the same type
    if (parentCategory.type !== categoryData.type) {
      return res.status(400).json({
        success: false,
        message: 'Parent category must be of the same type'
      });
    }

    // Prevent deep nesting (max 3 levels)
    if (parentCategory.level >= 2) {
      return res.status(400).json({
        success: false,
        message: 'Maximum category depth exceeded'
      });
    }
  }

  const category = await Category.create(categoryData);
  await category.populate('parent', 'name slug');
  await category.populate('createdBy', 'username');

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: { category }
  });
}));

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin/Moderator)
router.put('/:id', auth, moderatorOrAdmin, validateObjectId, validateCategory, asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  // Validate parent category if being changed
  if (req.body.parent && req.body.parent !== category.parent?.toString()) {
    const parentCategory = await Category.findById(req.body.parent);
    if (!parentCategory) {
      return res.status(400).json({
        success: false,
        message: 'Parent category not found'
      });
    }

    // Check if parent is of the same type
    if (parentCategory.type !== (req.body.type || category.type)) {
      return res.status(400).json({
        success: false,
        message: 'Parent category must be of the same type'
      });
    }

    // Prevent circular reference
    if (parentCategory._id.toString() === category._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Category cannot be its own parent'
      });
    }

    // Check if the new parent is not a descendant of this category
    const subcategories = await category.getAllSubcategories();
    const subcategoryIds = subcategories.map(sub => sub._id.toString());
    if (subcategoryIds.includes(parentCategory._id.toString())) {
      return res.status(400).json({
        success: false,
        message: 'Cannot set a subcategory as parent'
      });
    }
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      lastModifiedBy: req.user._id
    },
    { new: true, runValidators: true }
  );

  await updatedCategory.populate('parent', 'name slug');
  await updatedCategory.populate('createdBy', 'username');

  res.json({
    success: true,
    message: 'Category updated successfully',
    data: { category: updatedCategory }
  });
}));

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
router.delete('/:id', auth, adminOnly, validateObjectId, asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  try {
    await category.remove();
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    if (error.message.includes('subcategories')) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories. Please delete subcategories first.'
      });
    }
    
    if (error.message.includes('content items')) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category that is being used by content items.'
      });
    }
    
    throw error;
  }
}));

// @desc    Update category order
// @route   PUT /api/categories/:id/order
// @access  Private (Admin/Moderator)
router.put('/:id/order', auth, moderatorOrAdmin, validateObjectId, asyncHandler(async (req, res) => {
  const { order } = req.body;

  if (typeof order !== 'number') {
    return res.status(400).json({
      success: false,
      message: 'Order must be a number'
    });
  }

  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  category.order = order;
  category.lastModifiedBy = req.user._id;
  await category.save();

  res.json({
    success: true,
    message: 'Category order updated successfully',
    data: { category }
  });
}));

// @desc    Toggle category featured status
// @route   PUT /api/categories/:id/featured
// @access  Private (Admin/Moderator)
router.put('/:id/featured', auth, moderatorOrAdmin, validateObjectId, asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  category.isFeatured = !category.isFeatured;
  category.lastModifiedBy = req.user._id;
  await category.save();

  res.json({
    success: true,
    message: `Category ${category.isFeatured ? 'featured' : 'unfeatured'} successfully`,
    data: { category }
  });
}));

// @desc    Toggle category active status
// @route   PUT /api/categories/:id/active
// @access  Private (Admin)
router.put('/:id/active', auth, adminOnly, validateObjectId, asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  category.isActive = !category.isActive;
  category.lastModifiedBy = req.user._id;
  await category.save();

  res.json({
    success: true,
    message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
    data: { category }
  });
}));

// @desc    Search categories
// @route   GET /api/categories/search
// @access  Public
router.get('/search', asyncHandler(async (req, res) => {
  const { q, type, limit = 20 } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const categories = await Category.search(q, type, parseInt(limit));

  res.json({
    success: true,
    data: { categories }
  });
}));

// @desc    Get category statistics
// @route   GET /api/categories/:id/stats
// @access  Public
router.get('/:id/stats', validateObjectId, asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found'
    });
  }

  // Get subcategories count
  const subcategories = await Category.countDocuments({ 
    parent: category._id, 
    isActive: true 
  });

  // Get content count based on category type
  let contentCount = 0;
  const modelMap = {
    movie: 'Movie',
    music: 'Music',
    game: 'Game',
    book: 'Book'
  };

  if (modelMap[category.type]) {
    const Model = require(`../models/${modelMap[category.type]}`);
    contentCount = await Model.countDocuments({ 
      genres: category._id, 
      isActive: true 
    });
  }

  res.json({
    success: true,
    data: {
      category: {
        id: category._id,
        name: category.name,
        type: category.type
      },
      stats: {
        subcategories,
        contentItems: contentCount,
        level: category.level,
        isActive: category.isActive,
        isFeatured: category.isFeatured
      }
    }
  });
}));

module.exports = router;