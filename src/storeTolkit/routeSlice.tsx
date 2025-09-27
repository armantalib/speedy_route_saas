import { createSlice } from '@reduxjs/toolkit';
import { constant } from '../constraints';

type InitialStateType = {
  route: any | null;
  routeDetail: any | null;  // Replace 'any' with actual user type if available
  editCommunity: any | null;
  routeLocationSingle: any | null;


};

const initialState: InitialStateType = {
  route: null, 
  routeDetail:null,
  editCommunity:null,
  routeLocationSingle:null
};

const routeSlice = createSlice({
  name: 'community',
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