import { configureStore } from "@reduxjs/toolkit";
import geolocationReducer from "./geolocation";
import authReducer from "./auth";

export const store = configureStore({
  reducer: {
    geolocation: geolocationReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
