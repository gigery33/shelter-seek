import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Shelter {
  id: string;
  name: string;
  slug: string;
  type: "BOMB_SHELTER" | "UNDERGROUND_PARKING" | "METRO";
  description: string | null;
  address: string;
  lat: number;
  lng: number;
  amenities: string[];
  capacity: number;
  photoUrl: string | null;
  status: "OPEN" | "CLOSED";
  distance_m?: number;
}

export interface Filters {
  types: string[];
  amenities: string[];
}

export interface ShelterWithDistance extends Shelter {
  distance_m: number;
}

interface SheltersState {
  items: Shelter[];
  loading: boolean;
  error: string | null;
  filters: Filters;
  routingTo: string | null;
  nearestMode: boolean;
  nearest: ShelterWithDistance[];
}

const initialState: SheltersState = {
  items: [],
  loading: false,
  error: null,
  filters: { types: [], amenities: [] },
  routingTo: null,
  nearestMode: false,
  nearest: [],
};

export const fetchShelters = createAsyncThunk("shelters/fetch", async () => {
  const res = await fetch("/api/shelters");
  if (!res.ok) throw new Error("Failed to fetch shelters");
  return (await res.json()) as Shelter[];
});

export const createShelter = createAsyncThunk(
  "shelters/create",
  async (data: Record<string, unknown>) => {
    const res = await fetch("/api/shelters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to create shelter");
    }
    return (await res.json()) as Shelter;
  }
);

export const updateShelter = createAsyncThunk(
  "shelters/update",
  async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
    const res = await fetch(`/api/shelters/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update shelter");
    }
    return (await res.json()) as Shelter;
  }
);

export const deleteShelter = createAsyncThunk(
  "shelters/delete",
  async (id: string) => {
    const res = await fetch(`/api/shelters/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to delete shelter");
    }
    return id;
  }
);

export const fetchNearest = createAsyncThunk(
  "shelters/fetchNearest",
  async ({ lat, lng, limit }: { lat: number; lng: number; limit?: number }) => {
    const params = new URLSearchParams({ lat: String(lat), lng: String(lng) });
    if (limit) params.set("limit", String(limit));
    const res = await fetch(`/api/shelters/nearest?${params}`);
    if (!res.ok) throw new Error("Failed to fetch nearest shelters");
    return (await res.json()) as ShelterWithDistance[];
  }
);

const sheltersSlice = createSlice({
  name: "shelters",
  initialState,
  reducers: {
    setTypeFilter(state, action) {
      state.filters.types = action.payload;
    },
    setAmenityFilter(state, action) {
      state.filters.amenities = action.payload;
    },
    resetFilters(state) {
      state.filters = { types: [], amenities: [] };
    },
    startRoute(state, action) {
      state.routingTo = action.payload;
    },
    clearRoute(state) {
      state.routingTo = null;
    },
    enableNearestMode(state) {
      state.nearestMode = true;
    },
    disableNearestMode(state) {
      state.nearestMode = false;
      state.nearest = [];
    },
  },
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
      })
      .addCase(fetchNearest.fulfilled, (state, action) => {
        state.nearest = action.payload;
      });
  },
});

export const { setTypeFilter, setAmenityFilter, resetFilters, startRoute, clearRoute, enableNearestMode, disableNearestMode } = sheltersSlice.actions;

export function selectVisibleShelters(state: {
  shelters: SheltersState;
}): Shelter[] {
  const { items, filters } = state.shelters;
  return items.filter((s) => {
    if (filters.types.length > 0 && !filters.types.includes(s.type)) return false;
    if (
      filters.amenities.length > 0 &&
      !filters.amenities.every((a) => s.amenities.includes(a))
    )
      return false;
    return true;
  });
}

export default sheltersSlice.reducer;
