import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  route: null, 
  routeDetail:null,
  editCommunity:null,
  routeLocationSingle:null
};

const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    setRoute: (state, action) => {
      state.route = action.payload;
    },
    setRouteDetail: (state, action) => {
      state.routeDetail = action.payload;
    },
     setRouteLocationSingle: (state, action) => {
      state.routeLocationSingle = action.payload;
    },


    // Other reducers go here
  },
});

export const { setRoute,setRouteDetail,setRouteLocationSingle } = routeSlice.actions;

export default routeSlice.reducer;