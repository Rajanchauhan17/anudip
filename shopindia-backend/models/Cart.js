const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  variant: {
    name: String,
    value: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  appliedCoupon: {
    code: String,
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    discountType: {
      type: String,
      enum: ['fixed', 'percentage'],
      default: 'fixed'
    }
  },
  pricing: {
    subtotal: {
      type: Number,
      default: 0,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    shipping: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    index: { expireAfterSeconds: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
cartSchema.index({ user: 1 });
cartSchema.index({ expiresAt: 1 });

// Virtual for total items count
cartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for unique items count
cartSchema.virtual('uniqueItems').get(function() {
  return this.items.length;
});

// Pre-save middleware to calculate pricing
cartSchema.pre('save', async function(next) {
  if (this.isModified('items') || this.isModified('appliedCoupon')) {
    await this.calculatePricing();
  }
  next();
});

// Method to add item to cart
cartSchema.methods.addItem = async function(productId, quantity = 1, variant = null, price) {
  const existingItemIndex = this.items.findIndex(item => 
    item.product.toString() === productId.toString() &&
    JSON.stringify(item.variant) === JSON.stringify(variant)
  );
  
  if (existingItemIndex > -1) {
    // Update existing item quantity
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    this.items.push({
      product: productId,
      quantity,
      variant,
      price,
      addedAt: new Date()
    });
  }
  
  // Reset expiration
  this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(itemId, quantity) {
  const item = this.items.id(itemId);
  if (!item) {
    throw new Error('Item not found in cart');
  }
  
  if (quantity <= 0) {
    return this.removeItem(itemId);
  }
  
  item.quantity = quantity;
  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(itemId) {
  const item = this.items.id(itemId);
  if (!item) {
    throw new Error('Item not found in cart');
  }
  
  item.remove();
  return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.appliedCoupon = {};
  return this.save();
};

// Method to apply coupon
cartSchema.methods.applyCoupon = async function(couponCode) {
  const Coupon = mongoose.model('Coupon');
  const coupon = await Coupon.findOne({
    code: couponCode,
    isActive: true,
    validFrom: { $lte: new Date() },
    validUntil: { $gte: new Date() }
  });
  
  if (!coupon) {
    throw new Error('Invalid or expired coupon');
  }
  
  // Check minimum order value
  if (coupon.minOrderValue && this.pricing.subtotal < coupon.minOrderValue) {
    throw new Error(`Minimum order value of ₹${coupon.minOrderValue} required`);
  }
  
  // Check usage limits
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new Error('Coupon usage limit exceeded');
  }
  
  // Check user-specific usage
  if (coupon.perUserLimit) {
    const Order = mongoose.model('Order');
    const userUsageCount = await Order.countDocuments({
      user: this.user,
      'coupon.code': couponCode,
      status: { $nin: ['cancelled', 'refunded'] }
    });
    
    if (userUsageCount >= coupon.perUserLimit) {
      throw new Error('Coupon usage limit per user exceeded');
    }
  }
  
  // Calculate discount
  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = Math.min(
      (this.pricing.subtotal * coupon.discountValue) / 100,
      coupon.maxDiscountAmount || Infinity
    );
  } else {
    discountAmount = Math.min(coupon.discountValue, this.pricing.subtotal);
  }
  
  this.appliedCoupon = {
    code: couponCode,
    discount: discountAmount,
    discountType: coupon.discountType
  };
  
  return this.save();
};

// Method to remove coupon
cartSchema.methods.removeCoupon = function() {
  this.appliedCoupon = {};
  return this.save();
};

// Method to calculate pricing
cartSchema.methods.calculatePricing = async function() {
  // Populate items to get current prices
  await this.populate('items.product', 'price comparePrice');
  
  let subtotal = 0;
  
  // Calculate subtotal with current prices
  for (const item of this.items) {
    if (item.product) {
      // Use current product price if different from stored price
      const currentPrice = item.product.price;
      item.price = currentPrice;
      subtotal += currentPrice * item.quantity;
    }
  }
  
  this.pricing.subtotal = subtotal;
  
  // Apply coupon discount
  this.pricing.discount = this.appliedCoupon.discount || 0;
  
  // Calculate tax (18% GST for Indian market)
  const taxableAmount = subtotal - this.pricing.discount;
  this.pricing.tax = Math.round(taxableAmount * 0.18 * 100) / 100;
  
  // Calculate shipping (free shipping above ₹500)
  this.pricing.shipping = subtotal >= 500 ? 0 : 50;
  
  // Calculate total
  this.pricing.total = subtotal - this.pricing.discount + this.pricing.tax + this.pricing.shipping;
  
  // Ensure total is not negative
  this.pricing.total = Math.max(0, this.pricing.total);
};

// Method to validate cart items
cartSchema.methods.validateItems = async function() {
  const errors = [];
  
  for (let i = this.items.length - 1; i >= 0; i--) {
    const item = this.items[i];
    
    // Populate product to check availability
    await item.populate('product');
    
    if (!item.product) {
      // Product no longer exists
      this.items.splice(i, 1);
      errors.push(`Product no longer available`);
      continue;
    }
    
    if (item.product.status !== 'active') {
      // Product is not active
      this.items.splice(i, 1);
      errors.push(`${item.product.name} is no longer available`);
      continue;
    }
    
    // Check stock availability
    if (item.product.inventory.trackQuantity) {
      const availableStock = item.product.inventory.stock - item.product.inventory.reservedStock;
      
      if (availableStock <= 0) {
        this.items.splice(i, 1);
        errors.push(`${item.product.name} is out of stock`);
        continue;
      }
      
      if (item.quantity > availableStock) {
        item.quantity = availableStock;
        errors.push(`${item.product.name} quantity reduced to ${availableStock} (limited stock)`);
      }
    }
    
    // Update price if changed
    if (item.price !== item.product.price) {
      const oldPrice = item.price;
      item.price = item.product.price;
      
      if (item.product.price > oldPrice) {
        errors.push(`${item.product.name} price increased from ₹${oldPrice} to ₹${item.product.price}`);
      } else {
        errors.push(`${item.product.name} price reduced from ₹${oldPrice} to ₹${item.product.price}`);
      }
    }
  }
  
  if (errors.length > 0) {
    await this.save();
  }
  
  return errors;
};

// Static method to get or create cart for user
cartSchema.statics.getOrCreateCart = async function(userId) {
  let cart = await this.findOne({ user: userId }).populate('items.product', 'name price images slug status inventory');
  
  if (!cart) {
    cart = new this({ user: userId });
    await cart.save();
  } else {
    // Validate and update cart items
    await cart.validateItems();
  }
  
  return cart;
};

// Static method to merge guest cart with user cart
cartSchema.statics.mergeGuestCart = async function(userId, guestCartItems) {
  const cart = await this.getOrCreateCart(userId);
  
  for (const guestItem of guestCartItems) {
    await cart.addItem(
      guestItem.productId,
      guestItem.quantity,
      guestItem.variant,
      guestItem.price
    );
  }
  
  return cart;
};

// Static method to cleanup expired carts
cartSchema.statics.cleanupExpiredCarts = function() {
  return this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
};

module.exports = mongoose.model('Cart', cartSchema);