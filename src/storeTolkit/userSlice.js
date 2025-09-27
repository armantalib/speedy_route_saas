import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  user: null,headerName:'Admin'
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
      setHeaderName: (state, action) => {
      state.headerName = action.payload;
    },

  


    // Other reducers go here
  },
});

export const { setUser,setHeaderName  } = userSlice.actions;

export default userSlice.reducer;