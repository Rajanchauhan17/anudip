// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'super_admin';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  addresses: Address[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface UserPreferences {
  newsletter: boolean;
  smsUpdates: boolean;
  language: string;
  currency: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: Category;
  subcategory?: Category;
  brand?: string;
  price: number;
  comparePrice?: number;
  currency: string;
  sku: string;
  images: ProductImage[];
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  tags: string[];
  inventory: ProductInventory;
  shipping: ProductShipping;
  ratings: ProductRatings;
  reviews: ProductReview[];
  sales: ProductSales;
  status: 'draft' | 'active' | 'inactive' | 'archived';
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  onSale: boolean;
  discountPercentage: number;
  isAvailable: boolean;
  isLowStock: boolean;
  isOutOfStock: boolean;
  primaryImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price: number;
  comparePrice?: number;
  sku: string;
  stock: number;
  images: string[];
  isActive: boolean;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface ProductInventory {
  stock: number;
  lowStockThreshold: number;
  trackQuantity: boolean;
  allowBackorder: boolean;
  reservedStock: number;
}

export interface ProductShipping {
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'inch';
  };
  freeShipping: boolean;
  shippingClass: 'standard' | 'express' | 'overnight';
}

export interface ProductRatings {
  average: number;
  count: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ProductReview {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  images: string[];
  createdAt: string;
}

export interface ProductSales {
  totalSold: number;
  revenue: number;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string;
  level: number;
  image?: {
    url: string;
    alt: string;
  };
  icon?: string;
  color: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  productCount: number;
  children?: Category[];
  fullPath: string;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  variant?: {
    name: string;
    value: string;
  };
  price: number;
  addedAt: string;
}

export interface Cart {
  id: string;
  user: string;
  items: CartItem[];
  appliedCoupon?: {
    code: string;
    discount: number;
    discountType: 'fixed' | 'percentage';
  };
  pricing: {
    subtotal: number;
    discount: number;
    tax: number;
    shipping: number;
    total: number;
  };
  totalItems: number;
  uniqueItems: number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  pricing: OrderPricing;
  currency: string;
  coupon?: OrderCoupon;
  shippingAddress: Address;
  billingAddress?: Address;
  payment: OrderPayment;
  shipping: OrderShipping;
  status: OrderStatus;
  notes?: {
    customer?: string;
    internal?: string;
  };
  timeline: OrderTimeline[];
  returnRequest?: OrderReturnRequest;
  cancellation?: OrderCancellation;
  deliveredAt?: string;
  expectedDeliveryDate?: string;
  ageInDays: number;
  isReturnable: boolean;
  canBeCancelled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  variant?: {
    name: string;
    value: string;
  };
  image: string;
  subtotal: number;
}

export interface OrderPricing {
  subtotal: number;
  tax: number;
  taxRate: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface OrderCoupon {
  code: string;
  discountAmount: number;
  discountType: 'fixed' | 'percentage';
}

export interface OrderPayment {
  method: 'card' | 'upi' | 'netbanking' | 'wallet' | 'cod' | 'emi';
  provider: 'razorpay' | 'stripe' | 'paypal' | 'paytm' | 'phonepe' | 'cod';
  transactionId?: string;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded';
  amount: number;
  currency: string;
  paidAt?: string;
  failureReason?: string;
  refunds: OrderRefund[];
}

export interface OrderRefund {
  amount: number;
  reason?: string;
  refundId: string;
  processedAt: string;
  status: 'pending' | 'processed' | 'failed';
}

export interface OrderShipping {
  method: 'standard' | 'express' | 'overnight' | 'pickup';
  provider: 'delhivery' | 'bluedart' | 'fedex' | 'dtdc' | 'indiapost' | 'ecom';
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  charges: number;
  status: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned';
  updates: OrderShippingUpdate[];
}

export interface OrderShippingUpdate {
  status: string;
  message: string;
  location: string;
  timestamp: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'returned'
  | 'exchange_requested'
  | 'exchanged';

export interface OrderTimeline {
  status: string;
  message: string;
  timestamp: string;
  updatedBy?: string;
}

export interface OrderReturnRequest {
  isRequested: boolean;
  reason?: string;
  description?: string;
  requestedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  refundAmount?: number;
}

export interface OrderCancellation {
  reason: string;
  cancelledAt: string;
  cancelledBy: string;
  refundStatus: 'pending' | 'processing' | 'completed' | 'failed';
}

// Coupon Types
export interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  maxDiscountAmount?: number;
  minOrderValue: number;
  usageLimit?: number;
  perUserLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  applicableCategories: string[];
  applicableProducts: string[];
  excludeCategories: string[];
  excludeProducts: string[];
  isActive: boolean;
  isExpired: boolean;
  isValid: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// Filter and Search Types
export interface ProductFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  onSale?: boolean;
  featured?: boolean;
  trending?: boolean;
  newArrival?: boolean;
}

export interface ProductSearchOptions {
  query?: string;
  filters?: ProductFilters;
  sortBy?: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest' | 'popularity';
  page?: number;
  limit?: number;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface ModalState {
  isOpen: boolean;
  type?: string;
  data?: any;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  createdAt: string;
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface NewsletterSubscription {
  email: string;
}

// Analytics Types
export interface AnalyticsEvent {
  event: string;
  category: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
}