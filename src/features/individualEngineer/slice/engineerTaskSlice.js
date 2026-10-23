import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logout } from "@/features/auth/slice/authSlice";
import getMyTasks from "@/features/individualEngineer/services/myTasks";
import { extractErrorMessage } from "@/utils/extractErrorMessage";

const initialState = {
  engineerTaskData: [],
  taskFirstId: null,
  taskLastId: null,
  hasNextPage: false,
  hasPreviousPage: false,
  taskLength: 0,
  dataLimit: null,
  direction: "next",
  totalCount: null,
  totalActiveCount: null,
  loading: true,
  error: null,
  success: null,
  currentRequestId: null,
};

export const fetchEngineerTasks = createAsyncThunk(
  "engineerTask/fetchTasks",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getMyTasks(params);
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error, "Failed to load tasks"),
      );
    }
  },
);

const engineerTaskSlice = createSlice({
  name: "engineerTask",
  initialState,
  reducers: {
    updateEngineerTaskStatus: (state, action) => {
      const { caseId, status } = action.payload;
      const task = state.engineerTaskData.find(
        (item) => item.case_id === caseId,
      );
      if (task) task.status = status;
    },
    clearEngineerTasks: (state) => {
      state.engineerTaskData = [];
      state.taskFirstId = null;
      state.taskLastId = null;
      state.hasNextPage = false;
      state.hasPreviousPage = false;
      state.taskLength = 0;
      state.direction = "next";
      state.loading = false;
      state.currentRequestId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEngineerTasks.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchEngineerTasks.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        const payload = action.payload ?? {};
        const data = Array.isArray(payload.data) ? payload.data : [];

        state.engineerTaskData = data;
        state.taskFirstId = payload.taskFirstId ?? null;
        state.taskLastId = payload.taskLastId ?? null;
        state.hasNextPage = payload.hasNextPage ?? false;
        state.hasPreviousPage = payload.hasPreviousPage ?? false;
        state.taskLength = payload.taskLength ?? data.length;
        state.dataLimit = payload.dataLimit ?? state.dataLimit;
        state.direction = action.meta.arg?.direction ?? "next";
        state.totalCount = payload.totalCount ?? 0;
        state.totalActiveCount = payload.totalActiveCount ?? 0;
        state.loading = false;
        state.error = null;
        state.success = true;
        state.currentRequestId = null;
      })
      .addCase(fetchEngineerTasks.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        state.loading = false;
        state.error = action.payload ?? "Failed to load tasks";
        state.success = false;
        state.currentRequestId = null;
      })
      .addCase(logout, () => initialState);
  },
});

export const { clearEngineerTasks, updateEngineerTaskStatus } =
  engineerTaskSlice.actions;

export const selectEngineerTasks = (state) =>
  state.engineerTask.engineerTaskData;

export default engineerTaskSlice.reducer;
