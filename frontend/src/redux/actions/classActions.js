import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Action Types
export const GET_ALL_CLASSES = 'GET_ALL_CLASSES';
export const DELETE_CLASS = 'DELETE_CLASS';
export const ADD_CLASS = 'ADD_CLASS';
export const UPDATE_CLASS = 'UPDATE_CLASS';

// Action Creators
export const getAllClasses = createAsyncThunk(
    GET_ALL_CLASSES,
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/classes');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteClass = createAsyncThunk(
    DELETE_CLASS,
    async (classId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/api/classes/${classId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addClass = createAsyncThunk(
    ADD_CLASS,
    async (classData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/classes', classData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateClass = createAsyncThunk(
    UPDATE_CLASS,
    async ({ classId, classData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/api/classes/${classId}`, classData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
); 