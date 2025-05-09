import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserDetails } from '../../../redux/userRelated/userHandle';
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { updateStudentFields } from '../../../redux/studentRelated/studentHandle';

import {
    Box, InputLabel,
    MenuItem, Select,
    Typography, Stack,
    TextField, CircularProgress, FormControl,
    Card, CardContent, Fade, IconButton, Tooltip,
    Divider, Paper, Grid
} from '@mui/material';
import { PurpleButton, GreenButton } from '../../../components/buttonStyles';
import Popup from '../../../components/Popup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const StudentAttendance = ({ situation }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { response, error, statestatus } = useSelector((state) => state.student);
    const params = useParams()

    const [studentID, setStudentID] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [chosenSubName, setChosenSubName] = useState("");
    const [status, setStatus] = useState('');
    const [date, setDate] = useState('');

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        if (situation === "Student") {
            setStudentID(params.id);
            const stdID = params.id
            dispatch(getUserDetails(stdID, "Student"));
        }
        else if (situation === "Subject") {
            const { studentID, subjectID } = params
            setStudentID(studentID);
            dispatch(getUserDetails(studentID, "Student"));
            setChosenSubName(subjectID);
        }
    }, [situation]);

    useEffect(() => {
        if (userDetails && userDetails.sclassName && situation === "Student") {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

    const changeHandler = (event) => {
        const selectedSubject = subjectsList.find(
            (subject) => subject.subName === event.target.value
        );
        setSubjectName(selectedSubject.subName);
        setChosenSubName(selectedSubject._id);
    }

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    }

    const handleDateChange = (event) => {
        setDate(event.target.value);
    }

    const submitHandler = (event) => {
        event.preventDefault()
        
        if (!chosenSubName || !status || !date) {
            setMessage("Please fill in all fields");
            setShowPopup(true);
            return;
        }

        setLoader(true)
        const fields = { 
            subName: chosenSubName, 
            status, 
            date: new Date(date).toISOString() 
        }
        
        dispatch(updateStudentFields(studentID, fields, "StudentAttendance"))
            .then(() => {
                setLoader(false);
                setMessage("Attendance marked successfully");
                setShowPopup(true);
                // Reset form
                setStatus('');
                setDate('');
            })
            .catch((error) => {
                setLoader(false);
                setMessage(error.message || "Error marking attendance");
                setShowPopup(true);
            });
    }

    useEffect(() => {
        if (response) {
            setLoader(false)
            setShowPopup(true)
            setMessage(response)
        }
        else if (error) {
            setLoader(false)
            setShowPopup(true)
            setMessage("Error marking attendance")
        }
    }, [response, error])

    const InfoItem = ({ label, value, icon, color }) => (
        <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Box
                    sx={{
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36, 
                        height: 36, 
                        borderRadius: '50%',
                        backgroundColor: color === 'primary' ? 'rgba(25, 118, 210, 0.1)' : 
                                    color === 'success' ? 'rgba(46, 125, 50, 0.1)' : 
                                    color === 'purple' ? 'rgba(156, 39, 176, 0.1)' : 
                                    'rgba(0, 0, 0, 0.1)',
                        mr: 2
                    }}
                >
                    {icon}
                </Box>
                <Typography variant="subtitle2" sx={{ color: 'var(--color-text)', fontWeight: 600 }}>
                    {label}
                </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: 'var(--color-text)', pl: 7 }}>
                {value}
            </Typography>
        </Box>
    );

    return (
        <Fade in={true} timeout={500}>
            <Box sx={{ py: 4, px: { xs: 2, md: 4 } }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box>
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <Tooltip title="Back to Students">
                                    <IconButton 
                                        onClick={() => navigate("/Admin/students")}
                                        sx={{
                                            mr: 2,
                                            '&:hover': { 
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                                transform: 'scale(1.1)',
                                            },
                                            transition: 'all 0.2s ease-in-out'
                                        }}
                                    >
                                        <ArrowBackIcon />
                                    </IconButton>
                                </Tooltip>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--color-text)' }}>
                                    Mark Attendance
                                </Typography>
                            </Box>
                            <Typography variant="subtitle1" sx={{ color: 'var(--color-text)' }}>
                                Record student attendance for a specific subject and date
                            </Typography>
                        </Box>

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={4}>
                                <Card 
                                    elevation={0} 
                                    sx={{ 
                                        borderRadius: 2, 
                                        overflow: 'hidden', 
                                        border: '1px solid var(--color-border)',
                                        backgroundColor: 'var(--color-background-paper)',
                                        height: '100%',
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'var(--color-text)' }}>
                                            Student Information
                                        </Typography>
                                        
                                        <InfoItem 
                                            label="Student Name" 
                                            value={userDetails?.name || 'Not specified'} 
                                            icon={<PersonIcon sx={{ color: '#1976d2' }} />}
                                            color="primary"
                                        />
                                        
                                        <InfoItem 
                                            label="Roll Number" 
                                            value={userDetails?.rollNum || 'Not specified'} 
                                            icon={<PersonIcon sx={{ color: '#1976d2' }} />}
                                            color="primary"
                                        />
                                        
                                        <InfoItem 
                                            label="Class" 
                                            value={userDetails?.sclassName?.sclassName || 'Not specified'} 
                                            icon={<SchoolIcon sx={{ color: '#1976d2' }} />}
                                            color="primary"
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={8}>
                                <Card 
                                    elevation={0} 
                                    sx={{ 
                                        borderRadius: 2, 
                                        overflow: 'hidden', 
                                        border: '1px solid var(--color-border)',
                                        backgroundColor: 'var(--color-background-paper)',
                                        height: '100%',
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'var(--color-text)' }}>
                                            Mark Attendance
                                        </Typography>

                                        <form onSubmit={submitHandler}>
                                            <Stack spacing={3}>
                                                <FormControl fullWidth>
                                                    <InputLabel id="subject-label">Subject</InputLabel>
                                                    <Select
                                                        labelId="subject-label"
                                                        value={subjectName}
                                                        label="Subject"
                                                        onChange={changeHandler}
                                                        required
                                                    >
                                                        {subjectsList?.map((subject) => (
                                                            <MenuItem key={subject._id} value={subject.subName}>
                                                                {subject.subName}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>

                                                <FormControl fullWidth>
                                                    <InputLabel id="status-label">Status</InputLabel>
                                                    <Select
                                                        labelId="status-label"
                                                        value={status}
                                                        label="Status"
                                                        onChange={handleStatusChange}
                                                        required
                                                    >
                                                        <MenuItem value="Present">
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
                                                                Present
                                                            </Box>
                                                        </MenuItem>
                                                        <MenuItem value="Absent">
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <CancelIcon sx={{ color: 'error.main', mr: 1 }} />
                                                                Absent
                                                            </Box>
                                                        </MenuItem>
                                                    </Select>
                                                </FormControl>

                                                <TextField
                                                    label="Date"
                                                    type="date"
                                                    value={date}
                                                    onChange={handleDateChange}
                                                    required
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />

                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                                    <GreenButton
                                                        type="submit"
                                                        variant="contained"
                                                        disabled={loader}
                                                        startIcon={loader ? <CircularProgress size={20} /> : null}
                                                    >
                                                        {loader ? 'Marking Attendance...' : 'Mark Attendance'}
                                                    </GreenButton>
                                                </Box>
                                            </Stack>
                                        </form>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                )}
                <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
            </Box>
        </Fade>
    );
};

export default StudentAttendance;