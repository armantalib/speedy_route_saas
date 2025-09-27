import { createSlice } from '@reduxjs/toolkit';
import { constant } from '../constraints';

type InitialStateType = {
  marketplace: any | null;
  marketplaceDetail: any | null;  // Replace 'any' with actual user type if available
  editDataMarketplace: any | null;
  preFilterCategory: any | null;

};

const initialState: InitialStateType = {
  marketplace: null, 
  marketplaceDetail:null,
  editDataMarketplace:null,
  preFilterCategory:null
};

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    setMarketplace: (state, action) => {
      state.marketplace = action.payload;
    },
    setMarketplaceDetail: (state, action) => {
      state.marketplaceDetail = action.payload;
    },
    setEditDataMarketplace: (state, action) => {
      state.editDataMarketplace = action.payload;
    },
    setPreFilterCategory: (state, action) => {
      state.preFilterCategory = action.payload;
    },


    // Other reducers go here
  },
});

export const { setMarketplace,setMarketplaceDetail,setEditDataMarketplace,setPreFilterCategory } = marketplaceSlice.actions;

export default marketplaceSlice.reducer;