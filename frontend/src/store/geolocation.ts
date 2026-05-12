import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface GeolocationState {
  status: "idle" | "granted" | "denied" | "loading";
  position: { lat: number; lng: number } | null;
  error: string | null;
}

const initialState: GeolocationState = {
  status: "idle",
  position: null,
  error: null,
};

export const requestGeolocation = createAsyncThunk(
  "geolocation/request",
  async () => {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
      });
    });
    return {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    };
  }
);

const geolocationSlice = createSlice({
  name: "geolocation",
  initialState,
  reducers: {
    resetGeolocation(state) {
      state.status = "idle";
      state.position = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestGeolocation.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(requestGeolocation.fulfilled, (state, action) => {
        state.status = "granted";
        state.position = action.payload;
      })
      .addCase(requestGeolocation.rejected, (state, action) => {
        state.status = "denied";
        state.error = action.error.message ?? "Доступ до геолокації відхилено";
      });
  },
});

export const { resetGeolocation } = geolocationSlice.actions;
export default geolocationSlice.reducer;
