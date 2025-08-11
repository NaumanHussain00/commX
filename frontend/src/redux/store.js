import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import requestSlice from "./requestSlice";
import connectionSlice from "./connectionSlice";
import allUsersSlice from "./allUsersSlice";
import selectedChatSlice from "./selectedChatSlice";

const appStore = configureStore({
  reducer: {
    user: userSlice,
    requests: requestSlice,
    connections: connectionSlice,
    allUsers: allUsersSlice,
    selectedChat: selectedChatSlice,
  },
});

export default appStore;
