import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { toast } from 'sonner';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/cart');
    if (response.data.success) {
      return response.data;
    }
    return rejectWithValue('Failed to fetch cart');
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
  }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ productId, size, quantity }, { dispatch, rejectWithValue }) => {
  try {
    const response = await api.put('/cart/update', { productId, size, quantity });
    if (response.data.success) {
      dispatch(fetchCart());
      toast.success('Cart updated');
      return response.data;
    }
    return rejectWithValue('Failed to update cart');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update cart');
    return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
  }
});

export const removeCartItem = createAsyncThunk('cart/removeCartItem', async ({ productId, size }, { dispatch, rejectWithValue }) => {
  try {
    const response = await api.delete(`/cart/remove/${productId}/${size}`);
    if (response.data.success) {
      dispatch(fetchCart());
      toast.success('Item removed from cart');
      return response.data;
    }
    return rejectWithValue('Failed to remove item');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to remove item');
    return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
  }
});

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.items = [];
      state.total = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cart;
        state.total = action.payload.total;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
