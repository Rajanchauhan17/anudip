const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  images: [String]
}, {
  timestamps: true
});

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  comparePrice: {
    type: Number,
    min: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  images: [String],
  isActive: {
    type: Boolean,
    default: true
  }
});

const specificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters'],
    index: 'text'
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
    index: 'text'
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
    index: true
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  brand: {
    type: String,
    trim: true,
    index: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  sku: {
    type: String,
    unique: true,
    required: [true, 'SKU is required'],
    trim: true,
    uppercase: true
  },
  barcode: {
    type: String,
    trim: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      trim: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  variants: [variantSchema],
  specifications: [specificationSchema],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  inventory: {
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    trackQuantity: {
      type: Boolean,
      default: true
    },
    allowBackorder: {
      type: Boolean,
      default: false
    },
    reservedStock: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  shipping: {
    weight: {
      type: Number,
      min: 0
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ['cm', 'inch'],
        default: 'cm'
      }
    },
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingClass: {
      type: String,
      enum: ['standard', 'express', 'overnight'],
      default: 'standard'
    }
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
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    },
    distribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },
  reviews: [reviewSchema],
  sales: {
    totalSold: {
      type: Number,
      default: 0,
      min: 0
    },
    revenue: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'archived'],
    default: 'draft',
    index: true
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  trending: {
    type: Boolean,
    default: false,
    index: true
  },
  newArrival: {
    type: Boolean,
    default: false,
    index: true
  },
  onSale: {
    type: Boolean,
    default: false,
    index: true
  },
  publishedAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ featured: 1, status: 1 });
productSchema.index({ trending: 1, status: 1 });
productSchema.index({ onSale: 1, status: 1 });
productSchema.index({ brand: 1, status: 1 });
productSchema.index({ 'inventory.stock': 1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

// Virtual for availability
productSchema.virtual('isAvailable').get(function() {
  if (!this.inventory.trackQuantity) return true;
  return this.inventory.stock > this.inventory.reservedStock;
});

// Virtual for low stock status
productSchema.virtual('isLowStock').get(function() {
  if (!this.inventory.trackQuantity) return false;
  const availableStock = this.inventory.stock - this.inventory.reservedStock;
  return availableStock <= this.inventory.lowStockThreshold && availableStock > 0;
});

// Virtual for out of stock status
productSchema.virtual('isOutOfStock').get(function() {
  if (!this.inventory.trackQuantity) return false;
  return (this.inventory.stock - this.inventory.reservedStock) <= 0;
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg ? primaryImg.url : (this.images.length > 0 ? this.images[0].url : null);
});

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  
  // Set published date if status changed to active
  if (this.isModified('status') && this.status === 'active' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Ensure only one primary image
  const primaryImages = this.images.filter(img => img.isPrimary);
  if (primaryImages.length > 1) {
    this.images.forEach((img, index) => {
      img.isPrimary = index === 0;
    });
  } else if (primaryImages.length === 0 && this.images.length > 0) {
    this.images[0].isPrimary = true;
  }
  
  next();
});

// Method to add review
productSchema.methods.addReview = function(reviewData) {
  this.reviews.push(reviewData);
  this.updateRatings();
  return this.save();
};

// Method to update ratings
productSchema.methods.updateRatings = function() {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
    this.ratings.distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    return;
  }
  
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRating = 0;
  
  this.reviews.forEach(review => {
    distribution[review.rating]++;
    totalRating += review.rating;
  });
  
  this.ratings.average = Math.round((totalRating / this.reviews.length) * 10) / 10;
  this.ratings.count = this.reviews.length;
  this.ratings.distribution = distribution;
};

// Method to reserve stock
productSchema.methods.reserveStock = function(quantity) {
  if (!this.inventory.trackQuantity) return true;
  
  const availableStock = this.inventory.stock - this.inventory.reservedStock;
  if (availableStock >= quantity) {
    this.inventory.reservedStock += quantity;
    return true;
  }
  return false;
};

// Method to release reserved stock
productSchema.methods.releaseReservedStock = function(quantity) {
  this.inventory.reservedStock = Math.max(0, this.inventory.reservedStock - quantity);
};

// Method to reduce stock (on sale)
productSchema.methods.reduceStock = function(quantity) {
  if (!this.inventory.trackQuantity) return true;
  
  if (this.inventory.stock >= quantity) {
    this.inventory.stock -= quantity;
    this.inventory.reservedStock = Math.max(0, this.inventory.reservedStock - quantity);
    this.sales.totalSold += quantity;
    return true;
  }
  return false;
};

// Method to increase stock (on return/restock)
productSchema.methods.increaseStock = function(quantity) {
  this.inventory.stock += quantity;
  this.sales.totalSold = Math.max(0, this.sales.totalSold - quantity);
};

// Static method to find active products
productSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

// Static method to find featured products
productSchema.statics.findFeatured = function(limit = 10) {
  return this.find({ status: 'active', featured: true })
    .populate('category', 'name slug')
    .limit(limit)
    .sort({ createdAt: -1 });
};

// Static method to find trending products
productSchema.statics.findTrending = function(limit = 10) {
  return this.find({ status: 'active', trending: true })
    .populate('category', 'name slug')
    .limit(limit)
    .sort({ 'sales.totalSold': -1 });
};

// Static method to find products on sale
productSchema.statics.findOnSale = function(limit = 10) {
  return this.find({ status: 'active', onSale: true })
    .populate('category', 'name slug')
    .limit(limit)
    .sort({ discountPercentage: -1 });
};

// Static method to search products
productSchema.statics.searchProducts = function(query, options = {}) {
  const {
    category,
    minPrice,
    maxPrice,
    brand,
    rating,
    sortBy = 'relevance',
    page = 1,
    limit = 20
  } = options;
  
  let searchQuery = { status: 'active' };
  
  // Text search
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  // Category filter
  if (category) {
    searchQuery.category = category;
  }
  
  // Price range filter
  if (minPrice || maxPrice) {
    searchQuery.price = {};
    if (minPrice) searchQuery.price.$gte = minPrice;
    if (maxPrice) searchQuery.price.$lte = maxPrice;
  }
  
  // Brand filter
  if (brand) {
    searchQuery.brand = new RegExp(brand, 'i');
  }
  
  // Rating filter
  if (rating) {
    searchQuery['ratings.average'] = { $gte: rating };
  }
  
  // Sort options
  let sortOptions = {};
  switch (sortBy) {
    case 'price_low':
      sortOptions.price = 1;
      break;
    case 'price_high':
      sortOptions.price = -1;
      break;
    case 'rating':
      sortOptions['ratings.average'] = -1;
      break;
    case 'newest':
      sortOptions.createdAt = -1;
      break;
    case 'popularity':
      sortOptions['sales.totalSold'] = -1;
      break;
    default:
      if (query) {
        sortOptions.score = { $meta: 'textScore' };
      } else {
        sortOptions.createdAt = -1;
      }
  }
  
  const skip = (page - 1) * limit;
  
  return this.find(searchQuery)
    .populate('category', 'name slug')
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);
};

module.exports = mongoose.model('Product', productSchema);