import { configureStore } from "@reduxjs/toolkit";
import geolocationReducer from "./geolocation";
import authReducer from "./auth";
import sheltersReducer from "./shelters";

export const store = configureStore({
  reducer: {
    geolocation: geolocationReducer,
    auth: authReducer,
    shelters: sheltersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
