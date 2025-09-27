import { createSlice } from '@reduxjs/toolkit';

type InitialStateType = {
  community: any | null;
  communityDetail: any | null;  // Replace 'any' with actual user type if available
  editCommunity: any | null;

};

const initialState: InitialStateType = {
  community: null, 
  communityDetail:null,
  editCommunity:null,
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setCommunity: (state, action) => {
      state.community = action.payload;
    },
    setCommunityDetail: (state, action) => {
      state.communityDetail = action.payload;
    },
    setEditCommunity: (state, action) => {
      state.editCommunity = action.payload;
    },


    // Other reducers go here
  },
});

export const { setCommunity,setCommunityDetail,setEditCommunity } = communitySlice.actions;

export default communitySlice.reducer;