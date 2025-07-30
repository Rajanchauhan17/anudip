import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../types';

interface CategoryState {
  categories: Category[];
  featuredCategories: Category[];
  currentCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  featuredCategories: [],
  currentCategory: null,
  isLoading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    setFeaturedCategories: (state, action: PayloadAction<Category[]>) => {
      state.featuredCategories = action.payload;
    },
    setCurrentCategory: (state, action: PayloadAction<Category | null>) => {
      state.currentCategory = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCategories,
  setFeaturedCategories,
  setCurrentCategory,
  setLoading,
  setError,
} = categorySlice.actions;

export default categorySlice.reducer;