import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async ({ searchQuery = '', page = 1, limit = 10 } = {}, { rejectWithValue }) => {
  try {
    let endpoint = `/products?page=${page}&limit=${limit}`;
    if (searchQuery) {
      endpoint += `&search=${encodeURIComponent(searchQuery)}`;
    }
    const response = await api.get(endpoint);
    if (response.data.success) {
      return {
        products: response.data.products,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        page // Pass page down to reducer to know if we append or replace
      };
    }
    return rejectWithValue('Failed to fetch products');
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
  }
});

const initialState = {
  items: [],
  loading: false,
  error: null,
  hasMore: true,
  currentPage: 1,
  totalPages: 1
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload.page === 1) {
          state.items = action.payload.products;
        } else {
          // Append new products and filter duplicates just in case
          const newProducts = action.payload.products.filter(
            newProd => !state.items.some(existingProd => existingProd._id === newProd._id)
          );
          state.items = [...state.items, ...newProducts];
        }
        
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.hasMore = action.payload.currentPage < action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
