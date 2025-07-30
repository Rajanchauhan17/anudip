const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  variant: {
    name: String,
    value: String
  },
  image: String,
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  addressLine1: {
    type: String,
    required: true,
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    match: /^[1-9][0-9]{5}$/
  },
  country: {
    type: String,
    default: 'India'
  }
});

const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'cod', 'emi'],
    required: true
  },
  provider: {
    type: String,
    enum: ['razorpay', 'stripe', 'paypal', 'paytm', 'phonepe', 'cod'],
    required: true
  },
  transactionId: String,
  paymentId: String,
  orderId: String,
  signature: String,
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paidAt: Date,
  failureReason: String,
  refunds: [{
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    reason: String,
    refundId: String,
    processedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'processed', 'failed'],
      default: 'pending'
    }
  }]
});

const shippingSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['standard', 'express', 'overnight', 'pickup'],
    default: 'standard'
  },
  provider: {
    type: String,
    enum: ['delhivery', 'bluedart', 'fedex', 'dtdc', 'indiapost', 'ecom'],
    default: 'delhivery'
  },
  trackingNumber: String,
  trackingUrl: String,
  estimatedDelivery: Date,
  actualDelivery: Date,
  charges: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'],
    default: 'pending'
  },
  updates: [{
    status: String,
    message: String,
    location: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  items: [orderItemSchema],
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    shipping: {
      type: Number,
      default: 0,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  currency: {
    type: String,
    default: 'INR'
  },
  coupon: {
    code: String,
    discountAmount: {
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
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  billingAddress: shippingAddressSchema,
  payment: paymentSchema,
  shipping: shippingSchema,
  status: {
    type: String,
    enum: [
      'pending',           // Order created, payment pending
      'confirmed',         // Payment confirmed, processing
      'processing',        // Order being prepared
      'shipped',          // Order shipped
      'delivered',        // Order delivered
      'cancelled',        // Order cancelled
      'refunded',         // Order refunded
      'returned',         // Order returned
      'exchange_requested', // Exchange requested
      'exchanged'         // Item exchanged
    ],
    default: 'pending',
    index: true
  },
  notes: {
    customer: String,
    internal: String
  },
  timeline: [{
    status: {
      type: String,
      required: true
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  returnRequest: {
    isRequested: {
      type: Boolean,
      default: false
    },
    reason: String,
    description: String,
    requestedAt: Date,
    approvedAt: Date,
    rejectedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending'
    },
    refundAmount: {
      type: Number,
      min: 0
    }
  },
  cancellation: {
    reason: String,
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    refundStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    }
  },
  deliveredAt: Date,
  expectedDeliveryDate: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ 'shipping.status': 1 });
orderSchema.index({ createdAt: -1 });

// Virtual for order age in days
orderSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for is returnable
orderSchema.virtual('isReturnable').get(function() {
  if (!this.deliveredAt) return false;
  const returnWindow = 15; // 15 days return policy
  const daysSinceDelivery = Math.floor((Date.now() - this.deliveredAt) / (1000 * 60 * 60 * 24));
  return daysSinceDelivery <= returnWindow && this.status === 'delivered';
});

// Virtual for can be cancelled
orderSchema.virtual('canBeCancelled').get(function() {
  return ['pending', 'confirmed', 'processing'].includes(this.status);
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Generate order number: SI + YYYYMMDD + 6-digit sequence
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Find the last order of today
    const lastOrder = await this.constructor
      .findOne({
        orderNumber: new RegExp(`^SI${dateStr}`)
      })
      .sort({ orderNumber: -1 });
    
    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-6));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `SI${dateStr}${sequence.toString().padStart(6, '0')}`;
  }
  
  // Calculate expected delivery date
  if (this.isModified('shipping.method') && this.status === 'confirmed') {
    const deliveryDays = {
      'standard': 7,
      'express': 3,
      'overnight': 1,
      'pickup': 0
    };
    
    const days = deliveryDays[this.shipping.method] || 7;
    this.expectedDeliveryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }
  
  next();
});

// Method to add timeline entry
orderSchema.methods.addTimelineEntry = function(status, message, updatedBy = null) {
  this.timeline.push({
    status,
    message,
    updatedBy,
    timestamp: new Date()
  });
  
  this.status = status;
  
  // Set specific timestamps
  if (status === 'delivered') {
    this.deliveredAt = new Date();
  }
  
  return this.save();
};

// Method to update payment status
orderSchema.methods.updatePaymentStatus = function(status, paymentData = {}) {
  this.payment.status = status;
  
  if (status === 'completed') {
    this.payment.paidAt = new Date();
    this.addTimelineEntry('confirmed', 'Payment confirmed successfully');
  } else if (status === 'failed') {
    this.payment.failureReason = paymentData.failureReason || 'Payment failed';
    this.addTimelineEntry('cancelled', 'Order cancelled due to payment failure');
  }
  
  Object.assign(this.payment, paymentData);
  return this.save();
};

// Method to update shipping status
orderSchema.methods.updateShippingStatus = function(status, updateData = {}) {
  this.shipping.status = status;
  
  if (updateData.trackingNumber) {
    this.shipping.trackingNumber = updateData.trackingNumber;
  }
  
  if (updateData.message) {
    this.shipping.updates.push({
      status,
      message: updateData.message,
      location: updateData.location || '',
      timestamp: new Date()
    });
  }
  
  // Update order status based on shipping status
  const statusMapping = {
    'shipped': 'shipped',
    'delivered': 'delivered'
  };
  
  if (statusMapping[status]) {
    this.addTimelineEntry(statusMapping[status], updateData.message || `Order ${status}`);
  }
  
  return this.save();
};

// Method to cancel order
orderSchema.methods.cancelOrder = function(reason, cancelledBy) {
  if (!this.canBeCancelled) {
    throw new Error('Order cannot be cancelled at this stage');
  }
  
  this.status = 'cancelled';
  this.cancellation = {
    reason,
    cancelledAt: new Date(),
    cancelledBy,
    refundStatus: this.payment.status === 'completed' ? 'pending' : 'completed'
  };
  
  this.addTimelineEntry('cancelled', `Order cancelled: ${reason}`, cancelledBy);
  return this.save();
};

// Method to request return
orderSchema.methods.requestReturn = function(reason, description) {
  if (!this.isReturnable) {
    throw new Error('Order is not eligible for return');
  }
  
  this.returnRequest = {
    isRequested: true,
    reason,
    description,
    requestedAt: new Date(),
    status: 'pending'
  };
  
  this.addTimelineEntry('return_requested', `Return requested: ${reason}`);
  return this.save();
};

// Method to process refund
orderSchema.methods.processRefund = function(amount, refundId) {
  this.payment.refunds.push({
    amount,
    refundId,
    processedAt: new Date(),
    status: 'processed'
  });
  
  const totalRefunded = this.payment.refunds.reduce((sum, refund) => sum + refund.amount, 0);
  
  if (totalRefunded >= this.pricing.total) {
    this.payment.status = 'refunded';
    this.status = 'refunded';
  } else {
    this.payment.status = 'partially_refunded';
  }
  
  this.addTimelineEntry('refunded', `Refund processed: ₹${amount}`);
  return this.save();
};

// Static method to get orders by user
orderSchema.statics.getOrdersByUser = function(userId, options = {}) {
  const { page = 1, limit = 10, status } = options;
  const skip = (page - 1) * limit;
  
  let query = { user: userId };
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('items.product', 'name slug images')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get orders by status
orderSchema.statics.getOrdersByStatus = function(status, options = {}) {
  const { page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;
  
  return this.find({ status })
    .populate('user', 'firstName lastName email phone')
    .populate('items.product', 'name sku')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get sales analytics
orderSchema.statics.getSalesAnalytics = async function(startDate, endDate) {
  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ['delivered', 'shipped', 'processing'] }
      }
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.total' },
        averageOrderValue: { $avg: '$pricing.total' },
        totalItems: { $sum: { $size: '$items' } }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalItems: 0
  };
};

module.exports = mongoose.model('Order', orderSchema);