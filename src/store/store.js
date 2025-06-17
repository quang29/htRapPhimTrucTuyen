import { configureStore } from '@reduxjs/toolkit'
import movieReducer from './movieSlice'
import authReducer from './authSlice'
import subscriptionReducer from './subscriptionSlice'
import paymentReducer from './paymentSlice'

export const store = configureStore({
  reducer: {
    movieData : movieReducer,
    auth: authReducer, 
    subscription: subscriptionReducer,
    payment: paymentReducer,
  },
})