import { configureStore } from "@reduxjs/toolkit";
import geolocationReducer from "./geolocation";
import authReducer from "./auth";
import sheltersReducer from "./shelters";
import reportsReducer from "./reports";

export const store = configureStore({
  reducer: {
    geolocation: geolocationReducer,
    auth: authReducer,
    shelters: sheltersReducer,
    reports: reportsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
