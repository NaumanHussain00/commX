import { createSlice } from "@reduxjs/toolkit";

const selectedChatSlice = createSlice({
  name: "selectedChat",
  initialState: null,
  reducers: {
    addSelectedChat: (state, action) => action.payload,
    removeSelectedChat: () => null,
  },
});

export const { addSelectedChat, removeSelectedChat } =
  selectedChatSlice.actions;
export default selectedChatSlice.reducer;
