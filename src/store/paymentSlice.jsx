import { createSlice } from '@reduxjs/toolkit';
// dung de luu thong tin phuong thuc thanh toan ma nguoi dung chon

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
