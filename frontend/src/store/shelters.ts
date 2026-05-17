import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Shelter {
  id: string;
  name: string;
  type: "BOMB_SHELTER" | "UNDERGROUND_PARKING" | "METRO";
  description: string | null;
  address: string;
  lat: number;
  lng: number;
  amenities: string[];
  capacity: number;
  photoUrl: string | null;
  status: "OPEN" | "CLOSED";
}

interface SheltersState {
  items: Shelter[];
  loading: boolean;
  error: string | null;
}

const initialState: SheltersState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchShelters = createAsyncThunk("shelters/fetch", async () => {
  const res = await fetch("/api/shelters");
  if (!res.ok) throw new Error("Failed to fetch shelters");
  return (await res.json()) as Shelter[];
});

const sheltersSlice = createSlice({
  name: "shelters",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShelters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShelters.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchShelters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch shelters";
      });
  },
});

export default sheltersSlice.reducer;
