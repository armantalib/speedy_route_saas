import { createSlice } from '@reduxjs/toolkit';
// import { processArray } from '../../utils/constants';
import { processArray } from '../utils/Helper';
// import { put } from '../../Services/ApiRequest';

// First, define the reducer and action creators via `createSlice`
export const chatDataslice = createSlice({
  name: 'chatConversation',
  initialState: {
    conversationData: [],
    ConversationID: [],
    firstTimeUserData: {},
    conversationWithUser: false,
    messagesData: [],
    currentPlayingUrl: null,
    chatType : 'community',
    chatTypeId:null,
    chatToId : null,
  },
  reducers: {
    setConversationData(state, action) {
      state.conversationData = action.payload;
    },
    setConversationID(state, action) {
      state.ConversationID = action.payload;
    },
    setFirstTimeUserData(state, action) {
      state.firstTimeUserData = action.payload;
    },
    setConversationWithUser(state, action) {
      state.conversationWithUser = action.payload;
    },
    setChatType(state, action) {
      state.chatType = action.payload;
    },
    setChatTypeId(state, action) {
      state.chatTypeId = action.payload;
    },
    setChatToId(state, action) {
      state.chatToId = action.payload;
    },
    
    setMessagesData(state, action) {
      const data = action.payload
      const arr = [...data]
      const mapArray = processArray(arr)
      state.messagesData = mapArray

      return state
    },
    updateMsgImage(state, action) {
      const { _id } = action.payload

      state.messagesData = state.messagesData.map(obj => (obj._id === _id ? { ...obj, loading: false } : obj));

      return state
    },
    paginatedData(state, action) {
      const data = action.payload
      const arr = [...state.messagesData, ...data]
      const mapArray = processArray(arr)
      state.messagesData = mapArray

      return state
    },
    receivedMessage(state, action) {
      const { message } = action.payload
      if (!state.messagesData[message._id]) {
        const newMessage = { ...message }
        if (state?.messagesData.length>0 && state?.messagesData[0]?.day === 'Today') {
          newMessage.day = "Today";
          newMessage.show = false
        } else {
          newMessage.day = "Today";
          newMessage.show = true
        }
        const arr = [newMessage, ...state.messagesData,]
        state.messagesData = arr;
      }

      return state
    },
    messageEmpty(state) {
      state.messagesData = [];
      state.firstTimeUserData = {}
    },
    setCurrentPlayingUrl(state, action) {
      state.currentPlayingUrl = action.payload
    }
  },
});

// // Action creators are generated for each case reducer function
// Destructure and export the plain action creators
export const {
  setConversationData,
  setConversationID,
  setFirstTimeUserData,
  setConversationWithUser,
  setChatType,
  setChatTypeId,
  chatToId,
  setChatToId,
  setMessagesData,
  receivedMessage,
  paginatedData,
  messageEmpty,
  updateMsgImage,
  setCurrentPlayingUrl
} = chatDataslice.actions;

// export const { setGig } = gigSlice.actions;

export default chatDataslice.reducer;



export const msgSeen = (id) => async dispatch => {
  try {
    // await put('api/msg/seen/' + id);
  } catch (error) {
  }
};
