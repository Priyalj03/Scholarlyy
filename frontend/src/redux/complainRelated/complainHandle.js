import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError
} from './complainSlice';

const baseURL = process.env.REACT_APP_BASE_URL;

export const getAllComplains = createAsyncThunk(
    'complain/getAllComplains',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${baseURL}/Complain`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createComplain = createAsyncThunk(
    'complain/createComplain',
    async (complainData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${baseURL}/Complain/Create`, complainData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateComplain = createAsyncThunk(
    'complain/updateComplain',
    async ({ id, complainData }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`${baseURL}/Complain/${id}`, complainData);
            return data;
    } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteComplain = createAsyncThunk(
    'complain/deleteComplain',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`${baseURL}/Complain/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
    }
}
);