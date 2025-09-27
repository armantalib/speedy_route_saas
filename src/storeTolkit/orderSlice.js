import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'order',
  initialState: { gig: null,gigUser:null },
  reducers: {
    setOrder: (state, action) => {
      state.order = action.payload;
    },
    setOrderUser: (state, action) => {
      state.gigUser = action.payload;
    },
    // Other reducers go here
  },
});

export const { setOrder,setOrderUser } = orderSlice.actions;

export default orderSlice.reducer;