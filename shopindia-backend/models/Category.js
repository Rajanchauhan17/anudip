const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters'],
    index: 'text'
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
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
    max: 3
  },
  image: {
    url: String,
    alt: String
  },
  icon: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    default: '#FF6B35'
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  seo: {
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 60
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160
    },
    keywords: [String]
  },
  productCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
categorySchema.index({ parent: 1, isActive: 1 });
categorySchema.index({ level: 1, sortOrder: 1 });
categorySchema.index({ isFeatured: 1, isActive: 1 });
categorySchema.index({ name: 'text' });

// Virtual for children categories
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual for products in this category
categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category'
});

// Virtual for full path
categorySchema.virtual('fullPath').get(function() {
  // This will be populated by a method since we need to traverse up the tree
  return this._fullPath || this.name;
});

// Pre-save middleware to generate slug
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Pre-save middleware to set level based on parent
categorySchema.pre('save', async function(next) {
  if (this.isModified('parent')) {
    if (this.parent) {
      try {
        const parentCategory = await this.constructor.findById(this.parent);
        if (parentCategory) {
          this.level = parentCategory.level + 1;
          
          // Prevent circular references and too deep nesting
          if (this.level > 3) {
            const error = new Error('Category nesting cannot exceed 3 levels');
            return next(error);
          }
          
          // Check for circular reference
          let currentParent = parentCategory;
          while (currentParent.parent) {
            if (currentParent.parent.toString() === this._id.toString()) {
              const error = new Error('Circular reference detected in category hierarchy');
              return next(error);
            }
            currentParent = await this.constructor.findById(currentParent.parent);
            if (!currentParent) break;
          }
        }
      } catch (error) {
        return next(error);
      }
    } else {
      this.level = 0;
    }
  }
  next();
});

// Method to get full category path
categorySchema.methods.getFullPath = async function() {
  const path = [this.name];
  let current = this;
  
  while (current.parent) {
    current = await this.constructor.findById(current.parent);
    if (current) {
      path.unshift(current.name);
    } else {
      break;
    }
  }
  
  this._fullPath = path.join(' > ');
  return this._fullPath;
};

// Method to get all descendants
categorySchema.methods.getDescendants = async function() {
  const descendants = [];
  
  const findChildren = async (categoryId) => {
    const children = await this.constructor.find({ parent: categoryId, isActive: true });
    for (const child of children) {
      descendants.push(child);
      await findChildren(child._id);
    }
  };
  
  await findChildren(this._id);
  return descendants;
};

// Method to get all ancestors
categorySchema.methods.getAncestors = async function() {
  const ancestors = [];
  let current = this;
  
  while (current.parent) {
    current = await this.constructor.findById(current.parent);
    if (current) {
      ancestors.unshift(current);
    } else {
      break;
    }
  }
  
  return ancestors;
};

// Method to update product count
categorySchema.methods.updateProductCount = async function() {
  const Product = mongoose.model('Product');
  const count = await Product.countDocuments({ 
    category: this._id, 
    status: 'active' 
  });
  
  this.productCount = count;
  await this.save();
  
  // Update parent categories recursively
  if (this.parent) {
    const parent = await this.constructor.findById(this.parent);
    if (parent) {
      await parent.updateProductCount();
    }
  }
};

// Static method to get category tree
categorySchema.statics.getCategoryTree = async function(parentId = null) {
  const categories = await this.find({ 
    parent: parentId, 
    isActive: true 
  }).sort({ sortOrder: 1, name: 1 });
  
  for (const category of categories) {
    category.children = await this.getCategoryTree(category._id);
  }
  
  return categories;
};

// Static method to get featured categories
categorySchema.statics.getFeatured = function(limit = 10) {
  return this.find({ isFeatured: true, isActive: true })
    .sort({ sortOrder: 1, name: 1 })
    .limit(limit);
};

// Static method to get root categories
categorySchema.statics.getRootCategories = function() {
  return this.find({ parent: null, isActive: true })
    .sort({ sortOrder: 1, name: 1 });
};

// Static method to search categories
categorySchema.statics.searchCategories = function(query) {
  return this.find({
    $text: { $search: query },
    isActive: true
  }).sort({ score: { $meta: 'textScore' } });
};

// Static method to get breadcrumb for a category
categorySchema.statics.getBreadcrumb = async function(categoryId) {
  const category = await this.findById(categoryId);
  if (!category) return [];
  
  const breadcrumb = [];
  let current = category;
  
  while (current) {
    breadcrumb.unshift({
      _id: current._id,
      name: current.name,
      slug: current.slug
    });
    
    if (current.parent) {
      current = await this.findById(current.parent);
    } else {
      current = null;
    }
  }
  
  return breadcrumb;
};

module.exports = mongoose.model('Category', categorySchema);