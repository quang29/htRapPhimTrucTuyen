import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  paymentMethod: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    resetPaymentMethod: () => initialState,
  },
});

export const { setPaymentMethod, resetPaymentMethod } = paymentSlice.actions;
export default paymentSlice.reducer;
