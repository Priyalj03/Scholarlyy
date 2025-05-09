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
    Grid, Slider
} from '@mui/material';
import { GreenButton } from '../../../components/buttonStyles';
import Popup from '../../../components/Popup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import GradeIcon from '@mui/icons-material/Grade';
import InsertChartIcon from '@mui/icons-material/InsertChart';

const StudentExamMarks = ({ situation }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);
    const { response, error, statestatus } = useSelector((state) => state.student);
    const params = useParams()

    const [studentID, setStudentID] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [chosenSubName, setChosenSubName] = useState("");
    const [marksObtained, setMarksObtained] = useState("");

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

    const fields = { subName: chosenSubName, marksObtained }

    const submitHandler = (event) => {
        event.preventDefault()
        setLoader(true)
        dispatch(updateStudentFields(studentID, fields, "UpdateExamResult"))
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
            setMessage("error")
        }
        else if (statestatus === "added") {
            setLoader(false)
            setShowPopup(true)
            setMessage("Done Successfully")
        }
    }, [response, statestatus, error])

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

    // Calculate grade based on marks
    const calculateGrade = (marks) => {
        if (marks >= 90) return { grade: 'A+', color: '#2e7d32' };
        if (marks >= 80) return { grade: 'A', color: '#2e7d32' };
        if (marks >= 70) return { grade: 'B', color: '#1976d2' };
        if (marks >= 60) return { grade: 'C', color: '#ed6c02' };
        if (marks >= 50) return { grade: 'D', color: '#ed6c02' };
        return { grade: 'F', color: '#d32f2f' };
    };

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
                                    Enter Exam Marks
                                </Typography>
                            </Box>
                            <Typography variant="subtitle1" sx={{ color: 'var(--color-text)' }}>
                                Record student exam marks for a specific subject
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
                                            icon={<SchoolIcon sx={{ color: '#2e7d32' }} />}
                                            color="success"
                                        />
                                        
                                        {currentUser.teachSubject && (
                                            <InfoItem 
                                                label="Subject" 
                                                value={currentUser.teachSubject?.subName || 'Not specified'} 
                                                icon={<SchoolIcon sx={{ color: '#9c27b0' }} />}
                                                color="purple"
                                            />
                                        )}
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
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'var(--color-text)' }}>
                                            Marks Entry Form
                                        </Typography>
                                        
                            <form onSubmit={submitHandler}>
                                <Stack spacing={3}>
                                                {situation === "Student" && (
                                        <FormControl fullWidth>
                                                        <InputLabel id="subject-select-label" sx={{ color: 'var(--color-text)' }}>Select Subject</InputLabel>
                                            <Select
                                                            labelId="subject-select-label"
                                                            id="subject-select"
                                                value={subjectName}
                                                            label="Select Subject"
                                                            onChange={changeHandler} 
                                                            required
                                                            sx={{ 
                                                                color: 'var(--color-text)',
                                                                backgroundColor: 'var(--color-background-paper)',
                                                                '& .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: 'var(--color-border)',
                                                                },
                                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: 'var(--color-primary)',
                                                                },
                                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: 'var(--color-primary)',
                                                                },
                                                                '& .MuiSelect-icon': {
                                                                    color: 'var(--color-text)',
                                                                }
                                                            }}
                                                            MenuProps={{
                                                                PaperProps: {
                                                                    sx: {
                                                                        backgroundColor: '#ffffff',
                                                                        color: '#000000',
                                                                        boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
                                                                        '& .MuiMenuItem-root': {
                                                                            color: '#000000',
                                                                            '&:hover': {
                                                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                                                            },
                                                                        },
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            {subjectsList ? (
                                                    subjectsList.map((subject, index) => (
                                                                    <MenuItem key={index} value={subject.subName} sx={{ color: 'var(--color-text)' }}>
                                                            {subject.subName}
                                                        </MenuItem>
                                                    ))
                                                            ) : (
                                                                <MenuItem value="Select Subject" sx={{ color: 'var(--color-text)' }}>
                                                        Add Subjects For Marks
                                                    </MenuItem>
                                                            )}
                                            </Select>
                                        </FormControl>
                                                )}
                                                
                                                <FormControl fullWidth>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <GradeIcon sx={{ color: '#9c27b0', mr: 1 }} />
                                                        <Typography variant="subtitle2" sx={{ color: 'var(--color-text)', fontWeight: 600 }}>
                                                            Enter Marks (0-100)
                                                        </Typography>
                                                    </Box>
                                                    
                                                    <Box sx={{ px: 1 }}>
                                                        <Slider
                                                            value={marksObtained ? parseInt(marksObtained) : 0}
                                                            onChange={(e, newValue) => setMarksObtained(newValue.toString())}
                                                            aria-labelledby="marks-slider"
                                                            valueLabelDisplay="auto"
                                                            step={1}
                                                            marks
                                                            min={0}
                                                            max={100}
                                                            sx={{
                                                                color: marksObtained ? 
                                                                    (parseInt(marksObtained) >= 90 ? '#2e7d32' : 
                                                                    parseInt(marksObtained) >= 80 ? '#2e7d32' : 
                                                                    parseInt(marksObtained) >= 70 ? '#1976d2' : 
                                                                    parseInt(marksObtained) >= 60 ? '#ed6c02' : 
                                                                    parseInt(marksObtained) >= 50 ? '#ed6c02' : 
                                                                    '#d32f2f') : '#9c27b0',
                                                                '& .MuiSlider-thumb': {
                                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                                },
                                                                '& .MuiSlider-track': {
                                                                    height: 8,
                                                                    borderRadius: 4,
                                                                },
                                                                '& .MuiSlider-rail': {
                                                                    height: 8,
                                                                    borderRadius: 4,
                                                                    opacity: 0.3,
                                                                },
                                                                '& .MuiSlider-valueLabel': {
                                                                    backgroundColor: marksObtained ? 
                                                                        (parseInt(marksObtained) >= 90 ? '#2e7d32' : 
                                                                        parseInt(marksObtained) >= 80 ? '#2e7d32' : 
                                                                        parseInt(marksObtained) >= 70 ? '#1976d2' : 
                                                                        parseInt(marksObtained) >= 60 ? '#ed6c02' : 
                                                                        parseInt(marksObtained) >= 50 ? '#ed6c02' : 
                                                                        '#d32f2f') : '#9c27b0',
                                                                }
                                                            }}
                                                        />
                                                    </Box>
                                                    
                                                    <TextField 
                                                        type="number" 
                                                        value={marksObtained}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
                                                                setMarksObtained(value);
                                                            }
                                                        }}
                                                        required
                                                        fullWidth
                                                        sx={{ 
                                                            mt: 2,
                                                            '& .MuiOutlinedInput-root': {
                                                                color: 'var(--color-text)',
                                                                backgroundColor: 'var(--color-background-paper)',
                                                                '& .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: 'var(--color-border)',
                                                                },
                                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: 'var(--color-primary)',
                                                                },
                                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                    borderColor: 'var(--color-primary)',
                                                                },
                                                                '& input': {
                                                                    color: 'var(--color-text)',
                                                                }
                                                            }
                                                        }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                                    
                                                    {marksObtained && (
                                                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                                            <Box 
                                                                sx={{ 
                                                                    display: 'flex', 
                                                                    alignItems: 'center', 
                                                                    justifyContent: 'center',
                                                                    width: 36, 
                                                                    height: 36, 
                                                                    borderRadius: '50%',
                                                                    backgroundColor: calculateGrade(parseInt(marksObtained)).color + '20',
                                                                    mr: 2
                                                                }}
                                                            >
                                                                <GradeIcon sx={{ color: calculateGrade(parseInt(marksObtained)).color }} />
                                                            </Box>
                                                            <Typography variant="body1" sx={{ color: 'var(--color-text)' }}>
                                                                Grade: <strong style={{ color: calculateGrade(parseInt(marksObtained)).color }}>
                                                                    {calculateGrade(parseInt(marksObtained)).grade}
                                                                </strong>
                                                            </Typography>
                                                        </Box>
                                                    )}
                                    </FormControl>
                                </Stack>

                                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                                                <GreenButton
                                    size="large"
                                    variant="contained"
                                    type="submit"
                                    disabled={loader}
                                                    startIcon={loader ? <CircularProgress size={20} color="inherit" /> : <InsertChartIcon />}
                                                    sx={{ 
                                                        minWidth: 150,
                                                        transition: 'all 0.3s ease-in-out',
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                                        }
                                                    }}
                                                >
                                                    {loader ? "Submitting..." : "Submit"}
                                                </GreenButton>
                                            </Box>
                            </form>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        
                        <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
                    </Box>
                )}
            </Box>
        </Fade>
    )
}

export default StudentExamMarks