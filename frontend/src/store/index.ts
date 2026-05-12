import { configureStore } from "@reduxjs/toolkit";
import geolocationReducer from "./geolocation";

export const store = configureStore({
  reducer: {
    geolocation: geolocationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
