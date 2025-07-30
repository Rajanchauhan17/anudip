import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductFilters } from '../../types';

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  trendingProducts: Product[];
  currentProduct: Product | null;
  filters: ProductFilters;
  searchQuery: string;
  sortBy: string;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  trendingProducts: [],
  currentProduct: null,
  filters: {},
  searchQuery: '',
  sortBy: 'relevance',
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setFeaturedProducts: (state, action: PayloadAction<Product[]>) => {
      state.featuredProducts = action.payload;
    },
    setTrendingProducts: (state, action: PayloadAction<Product[]>) => {
      state.trendingProducts = action.payload;
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    },
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload;
    },
    updateFilter: (state, action: PayloadAction<{ key: keyof ProductFilters; value: any }>) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPagination: (state, action: PayloadAction<Partial<ProductState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
});

export const {
  setProducts,
  setFeaturedProducts,
  setTrendingProducts,
  setCurrentProduct,
  setFilters,
  updateFilter,
  clearFilters,
  setSearchQuery,
  setSortBy,
  setLoading,
  setError,
  setPagination,
} = productSlice.actions;

export default productSlice.reducer;