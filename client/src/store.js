import { configureStore, createSlice } from "@reduxjs/toolkit";

const saved = JSON.parse(localStorage.getItem("sb-auth") || "null");
const authSlice = createSlice({
  name: "auth",
  initialState: { session: saved },
  reducers: {
    setSession: (state, action) => { state.session = action.payload; localStorage.setItem("sb-auth", JSON.stringify(action.payload)); },
    clearSession: state => { state.session = null; localStorage.removeItem("sb-auth"); }
  }
});
export const { setSession, clearSession } = authSlice.actions;
export const store = configureStore({ reducer: { auth: authSlice.reducer } });
