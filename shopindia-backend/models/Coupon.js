const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  name: {
    type: String,
    required: [true, 'Coupon name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['fixed', 'percentage'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  maxDiscountAmount: {
    type: Number,
    min: 0
  },
  minOrderValue: {
    type: Number,
    default: 0,
    min: 0
  },
  usageLimit: {
    type: Number,
    min: 1
  },
  perUserLimit: {
    type: Number,
    default: 1,
    min: 1
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  validFrom: {
    type: Date,
    required: true,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  excludeCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  excludeProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
couponSchema.index({ code: 1 });
couponSchema.index({ validFrom: 1, validUntil: 1 });
couponSchema.index({ isActive: 1 });

// Virtual for is expired
couponSchema.virtual('isExpired').get(function() {
  return new Date() > this.validUntil;
});

// Virtual for is valid
couponSchema.virtual('isValid').get(function() {
  const now = new Date();
  return this.isActive && now >= this.validFrom && now <= this.validUntil;
});

// Method to check if coupon is applicable to cart
couponSchema.methods.isApplicableToCart = function(cart) {
  // Check if coupon is valid
  if (!this.isValid) return false;
  
  // Check minimum order value
  if (this.minOrderValue && cart.pricing.subtotal < this.minOrderValue) {
    return false;
  }
  
  // Check usage limits
  if (this.usageLimit && this.usedCount >= this.usageLimit) {
    return false;
  }
  
  // If no specific products/categories, applicable to all
  if (this.applicableCategories.length === 0 && this.applicableProducts.length === 0) {
    return true;
  }
  
  // Check if any cart item matches applicable products/categories
  for (const item of cart.items) {
    const productId = item.product._id || item.product;
    const categoryId = item.product.category;
    
    // Check applicable products
    if (this.applicableProducts.some(id => id.toString() === productId.toString())) {
      return true;
    }
    
    // Check applicable categories
    if (this.applicableCategories.some(id => id.toString() === categoryId.toString())) {
      return true;
    }
  }
  
  return false;
};

// Method to increment usage count
couponSchema.methods.incrementUsage = function() {
  this.usedCount += 1;
  return this.save();
};

// Static method to find valid coupons
couponSchema.statics.findValidCoupons = function() {
  const now = new Date();
  return this.find({
    isActive: true,
    validFrom: { $lte: now },
    validUntil: { $gte: now }
  });
};

module.exports = mongoose.model('Coupon', couponSchema);