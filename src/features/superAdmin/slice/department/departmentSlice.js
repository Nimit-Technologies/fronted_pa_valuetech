import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Data & Pagination
  departmentData: [],
  departmentFirstId: null,
  departmentLastId: null,
  hasNextPage: false,
  hasPreviousPage: false,
  dataLimit: 10,
  direction: "next",

  // Search & Selected State
  searchQuery: "",
  selectedDepartment: null,

  // UI States
  loading: false,
  error: null,
  success: false,
};

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    // 1. Common Loading & Failure Starts
    departmentStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },

    departmentFailure: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },

    // 2. Fetch / Set All Departments (With Pagination Metadata)
    setDepartment: (state, action) => {
      const payload = action.payload || [];
      const data = Array.isArray(payload) ? payload : payload.data || [];

      state.departmentData = data;
      state.departmentFirstId = payload.departmentFirstId || null;
      state.departmentLastId = payload.departmentLastId || null;
      state.hasNextPage = payload.hasNextPage || false;
      state.hasPreviousPage = payload.hasPreviousPage || false;
      state.dataLimit = payload.dataLimit || state.dataLimit;
      state.departmentLength = payload.departmentLength || data.length;

      state.loading = false;
      state.error = null;
      state.success = true;
    },

    // 3. Search & Pagination Controls
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    setPageDirection: (state, action) => {
      state.direction = action.payload; // "next" or "previous"
    },

    // setSelectedDepartment: (state, action) => {
    //   state.selectedDepartment = action.payload;
    // },

    // 4. CRUD Operations

    // Add / Create Department
    // addDepartmentSuccess: (state, action) => {
    //   state.loading = false;
    //   state.success = true;
    //   state.departmentData.unshift(action.payload); // List ke top par add karein
    // },

    // Update Department
    // updateDepartmentSuccess: (state, action) => {
    //   state.loading = false;
    //   state.success = true;
    //   const index = state.departmentData.findIndex(
    //     (dept) => dept._id === action.payload._id
    //   );
    //   if (index !== -1) {
    //     state.departmentData[index] = action.payload;
    //   }
    // },

    // // Delete Department
    // deleteDepartmentSuccess: (state, action) => {
    //   state.loading = false;
    //   state.success = true;
    //   state.departmentData = state.departmentData.filter(
    //     (dept) => dept._id !== action.payload
    //   );
    // },

    // Reset UI Status (Success/Error reset karne ke liye)
    // clearDepartmentStatus: (state) => {
    //   state.error = null;
    //   state.success = false;
    // }
  },
});

export const {
  departmentStart,
  departmentFailure,
  setDepartment,
  setSearchQuery,
  setPageDirection,
  //   setSelectedDepartment,
  //   addDepartmentSuccess,
  //   updateDepartmentSuccess,
  //   deleteDepartmentSuccess,
  //   clearDepartmentStatus
} = departmentSlice.actions;

export default departmentSlice.reducer;
