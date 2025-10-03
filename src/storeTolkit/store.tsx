// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import routeReducer from './routeSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    route: routeReducer,
    // Other reducers go here
  },
});
export default store;