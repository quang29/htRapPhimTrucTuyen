import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedPlanId: null,
  billingCycle: null,
  amount: 0,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscriptionDetails: (state, action) => {
      const { planId, billingCycle, amount } = action.payload;
      state.selectedPlanId = planId;
      state.billingCycle = billingCycle;
      state.amount = amount;
    },
    resetSubscription: () => initialState
  },
});

export const { setSubscriptionDetails, resetSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
