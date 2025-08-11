import { createSlice } from "@reduxjs/toolkit";

const allUsersSlice = createSlice({
  name: "allUsers",
  initialState: null,
  reducers: {
    addAllUsers: (state, action) => action.payload,
    removeAllUsers: (state, action) => {
      const newArray = state.filter((r) => r._id !== action.payload);
      return newArray;
    },
  },
});

export const { addAllUsers, removeAllUsers } = allUsersSlice.actions;
export default allUsersSlice.reducer;
