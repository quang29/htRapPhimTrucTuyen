import { createSlice } from '@reduxjs/toolkit';
//luu lua chon tam thoi khi nguoi dung chon goi dang ky(id goi, chu ky, so tien)

const initialState = {
  selectedPlanId: null,
  billingCycle: null,
  amount: 0,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscriptionDetails: (state, action) => { //luu lua chon
      const { planId, billingCycle, amount } = action.payload;
      state.selectedPlanId = planId;
      state.billingCycle = billingCycle;
      state.amount = amount;
    },
    resetSubscription: () => initialState // reset ve trang thai ban dau(xoa lua chon)
  },
});

export const { setSubscriptionDetails, resetSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
