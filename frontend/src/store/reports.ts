import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Report {
  id: string;
  shelterId: string | null;
  type: string;
  comment: string | null;
  status: string;
  createdAt: string;
  resolvedAt: string | null;
}

interface ReportsState {
  items: Report[];
  submitting: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  items: [],
  submitting: false,
  error: null,
};

export const submitReport = createAsyncThunk(
  "reports/submit",
  async (data: { shelterId?: string; type: string; comment?: string }) => {
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to submit report");
    return (await res.json()) as Report;
  }
);

export const fetchReports = createAsyncThunk("reports/fetch", async () => {
  const res = await fetch("/api/reports?status=OPEN", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch reports");
  return (await res.json()) as Report[];
});

export const resolveReport = createAsyncThunk(
  "reports/resolve",
  async (id: string) => {
    const res = await fetch(`/api/reports/${id}/resolve`, {
      method: "PATCH",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to resolve report");
    return (await res.json()) as Report;
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitReport.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitReport.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(submitReport.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.error.message || "Failed to submit report";
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(resolveReport.fulfilled, (state, action) => {
        const idx = state.items.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.items.splice(idx, 1);
      });
  },
});

export default reportsSlice.reducer;
