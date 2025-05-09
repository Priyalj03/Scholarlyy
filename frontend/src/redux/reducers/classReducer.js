import { createReducer } from '@reduxjs/toolkit';
import { GET_ALL_CLASSES, DELETE_CLASS, ADD_CLASS, UPDATE_CLASS } from '../actions/classActions';
import { getAllClasses, deleteClass, addClass, updateClass } from '../actions/classActions';

const initialState = {
    classes: [],
    loading: false,
    error: null,
};

const classReducer = createReducer(initialState, (builder) => {
    builder
        // Get All Classes
        .addCase(getAllClasses.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllClasses.fulfilled, (state, action) => {
            state.loading = false;
            state.classes = action.payload;
        })
        .addCase(getAllClasses.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        // Delete Class
        .addCase(deleteClass.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteClass.fulfilled, (state, action) => {
            state.loading = false;
            state.classes = state.classes.filter(cls => cls._id !== action.payload._id);
        })
        .addCase(deleteClass.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        // Add Class
        .addCase(addClass.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addClass.fulfilled, (state, action) => {
            state.loading = false;
            state.classes.push(action.payload);
        })
        .addCase(addClass.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        // Update Class
        .addCase(updateClass.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateClass.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.classes.findIndex(cls => cls._id === action.payload._id);
            if (index !== -1) {
                state.classes[index] = action.payload;
            }
        })
        .addCase(updateClass.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
});

export default classReducer; 