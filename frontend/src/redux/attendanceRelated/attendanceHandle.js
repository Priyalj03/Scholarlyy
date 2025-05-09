import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const baseURL = process.env.REACT_APP_BASE_URL;

export const getAttendanceList = createAsyncThunk(
    'attendance/getAttendanceList',
    async ({ id, type }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${baseURL}/Attendance/${type}/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createAttendance = createAsyncThunk(
    'attendance/createAttendance',
    async (attendanceData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${baseURL}/Attendance/Create`, attendanceData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateAttendance = createAsyncThunk(
    'attendance/updateAttendance',
    async ({ id, attendanceData }, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`${baseURL}/Attendance/${id}`, attendanceData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteAttendance = createAsyncThunk(
    'attendance/deleteAttendance',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`${baseURL}/Attendance/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
); 