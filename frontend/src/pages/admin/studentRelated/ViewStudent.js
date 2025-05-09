import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, getUserDetails, updateUser } from '../../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom'
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { 
  Box, Button, Collapse, IconButton, Table, TableBody, TableHead, Typography, 
  Tab, Paper, BottomNavigation, BottomNavigationAction, Container, Card, 
  CardContent, Grid, Fade, CircularProgress, Tooltip, Divider
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { KeyboardArrowUp, KeyboardArrowDown, Delete as DeleteIcon } from '@mui/icons-material';
import { removeStuff, updateStudentFields } from '../../../redux/studentRelated/studentHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../../components/attendanceCalculator';
import CustomBarChart from '../../../components/CustomBarChart'
import CustomPieChart from '../../../components/CustomPieChart'
import { StyledTableCell, StyledTableRow } from '../../../components/styles';
import { BlueButton, GreenButton, PurpleButton } from '../../../components/buttonStyles';
import styled from 'styled-components';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Popup from '../../../components/Popup';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { ThemeProvider } from '@mui/material/styles';
import { defaultTheme } from '../../../styles/theme';
import { CardHeader } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GradeIcon from '@mui/icons-material/Grade';

// Styled Components
const StyledContainer = styled.div`
    min-height: 100vh;
    padding: 2rem;
    background-color: #121212;
`;

const StyledPaper = styled(Paper)`
    padding: 2rem;
    border-radius: 12px;
    background-color: #1E1E1E;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const InfoCard = styled(Card)`
    height: 100%;
    background-color: #1E1E1E;
    border-radius: 12px;
    transition: all 0.3s ease-in-out;
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }
`;

const ViewStudent = () => {
    const [showTab, setShowTab] = useState(false);

    const navigate = useNavigate()
    const params = useParams()
    const dispatch = useDispatch()
    const { userDetails, response, loading, error } = useSelector((state) => state.user);

    const studentID = params.id
    const address = "Student"

    useEffect(() => {
        dispatch(getUserDetails(studentID, address));
    }, [dispatch, studentID])

    useEffect(() => {
        if (userDetails && userDetails.sclassName && userDetails.sclassName._id !== undefined) {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('');
    const [sclassName, setSclassName] = useState('');
    const [studentSchool, setStudentSchool] = useState('');
    const [subjectMarks, setSubjectMarks] = useState('');
    const [subjectAttendance, setSubjectAttendance] = useState([]);

    const [openStates, setOpenStates] = useState({});

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [selectedSection, setSelectedSection] = useState('table');
    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const fields = password === ""
        ? { name, rollNum }
        : { name, rollNum, password }

    useEffect(() => {
        if (userDetails) {
            setName(userDetails.name || '');
            setRollNum(userDetails.rollNum || '');
            setSclassName(userDetails.sclassName || '');
            setStudentSchool(userDetails.school || '');
            setSubjectMarks(userDetails.examResult || '');
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const submitHandler = (event) => {
        event.preventDefault()
        dispatch(updateUser(fields, studentID, address))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const deleteHandler = () => {
        setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)

        // dispatch(deleteUser(studentID, address))
        //     .then(() => {
        //         navigate(-1)
        //     })
    }

    const removeHandler = (id, deladdress) => {
        dispatch(removeStuff(id, deladdress))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            })
    }

    const removeSubAttendance = (subId) => {
        dispatch(updateStudentFields(studentID, { subId }, "RemoveStudentSubAtten"))
            .then(() => {
                dispatch(getUserDetails(studentID, address));
            })
    }

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    const subjectData = Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { subCode, present, sessions }]) => {
        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: subjectAttendancePercentage,
            totalClasses: sessions,
            attendedClasses: present
        };
    });

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

    const StudentAttendanceSection = () => {
        const renderTableSection = () => {
            return (
                <Card 
                    elevation={0} 
                    sx={{ 
                        borderRadius: 2, 
                        overflow: 'hidden', 
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-background-paper)',
                        mb: 4,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        }
                    }}
                >
                    <Box sx={{ p: 3, borderBottom: '1px solid var(--color-border)' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text)' }}>
                            Attendance Records
                        </Typography>
                    </Box>
                    <Box sx={{ p: 3 }}>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                    <StyledTableCell sx={{ color: 'var(--color-text)', fontWeight: 600 }}>Subject</StyledTableCell>
                                    <StyledTableCell sx={{ color: 'var(--color-text)', fontWeight: 600 }}>Present</StyledTableCell>
                                    <StyledTableCell sx={{ color: 'var(--color-text)', fontWeight: 600 }}>Total Sessions</StyledTableCell>
                                    <StyledTableCell sx={{ color: 'var(--color-text)', fontWeight: 600 }}>Attendance Percentage</StyledTableCell>
                                    <StyledTableCell align="center" sx={{ color: 'var(--color-text)', fontWeight: 600 }}>Actions</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                            <TableBody>
                        {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
                            const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
                            return (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell sx={{ color: 'var(--color-text)' }}>{subName}</StyledTableCell>
                                            <StyledTableCell sx={{ color: 'var(--color-text)' }}>{present}</StyledTableCell>
                                            <StyledTableCell sx={{ color: 'var(--color-text)' }}>{sessions}</StyledTableCell>
                                            <StyledTableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box sx={{ 
                                                        width: '100%', 
                                                        mr: 1, 
                                                        height: 8, 
                                                        borderRadius: 4, 
                                                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                                        overflow: 'hidden'
                                                    }}>
                                                        <Box sx={{ 
                                                            width: `${subjectAttendancePercentage}%`, 
                                                            height: '100%', 
                                                            backgroundColor: subjectAttendancePercentage >= 75 ? '#2e7d32' : 
                                                                          subjectAttendancePercentage >= 50 ? '#ed6c02' : '#d32f2f',
                                                            transition: 'width 0.5s ease-in-out'
                                                        }} />
                                                    </Box>
                                                    <Typography variant="body2" sx={{ minWidth: 45, color: 'var(--color-text)' }}>
                                                        {subjectAttendancePercentage}%
                                                    </Typography>
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                    <Button 
                                                        variant="outlined"
                                                        onClick={() => handleOpen(subId)}
                                                        startIcon={openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                        sx={{ 
                                                            borderColor: 'var(--color-border)',
                                                            color: 'var(--color-text)',
                                                            '&:hover': {
                                                                borderColor: 'var(--color-primary)',
                                                                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                                            }
                                                        }}
                                                    >
                                                        Details
                                                    </Button>
                                                    <IconButton 
                                                        onClick={() => removeSubAttendance(subId)}
                                                        sx={{ 
                                                            color: '#d32f2f',
                                                            '&:hover': { 
                                                                backgroundColor: '#ffebee',
                                                            }
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <PurpleButton 
                                                        variant="contained"
                                                        onClick={() => navigate(`/Admin/subject/student/attendance/${studentID}/${subId}`)}
                                                    >
                                                        Change
                                                    </PurpleButton>
                                                </Box>
                                                                        </StyledTableCell>
                                                                    </StyledTableRow>
                                    );
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                </Card>
            )
        }

        const renderChartSection = () => {
            return (
                <Card 
                    elevation={0} 
                    sx={{ 
                        borderRadius: 2, 
                        overflow: 'hidden', 
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-background-paper)',
                        mb: 4,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        }
                    }}
                >
                    <Box sx={{ p: 3, borderBottom: '1px solid var(--color-border)' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text)' }}>
                            Attendance Overview
                        </Typography>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <CustomPieChart data={chartData} />
                    </Box>
                </Card>
            )
        }

        return (
            <Fade in={true} timeout={500}>
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
                                Student Attendance
                            </Typography>
                        </Box>
                        <Typography variant="subtitle1" sx={{ color: 'var(--color-text)' }}>
                            View and manage attendance records
                        </Typography>
                    </Box>

                    {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                        {selectedSection === 'chart' && renderChartSection()}

                            <Paper 
                                sx={{ 
                                    position: 'fixed', 
                                    bottom: 0, 
                                    left: 0, 
                                    right: 0,
                                    backgroundColor: 'var(--color-background-paper)',
                                    borderTop: '1px solid var(--color-border)',
                                    zIndex: 1000,
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                }} 
                                elevation={3}
                            >
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-around', 
                                    p: 1,
                                    height: 70
                                }}>
                                    <Box 
                                        onClick={() => setSelectedSection('table')}
                                        sx={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flex: 1,
                                            cursor: 'pointer',
                                            color: selectedSection === 'table' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                            borderTop: selectedSection === 'table' ? '3px solid var(--color-primary)' : 'none',
                                            pt: 1,
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                            }
                                        }}
                                    >
                                        {selectedSection === 'table' ? 
                                            <TableChartIcon sx={{ fontSize: 28, mb: 0.5 }} /> : 
                                            <TableChartOutlinedIcon sx={{ fontSize: 28, mb: 0.5 }} />
                                        }
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                fontWeight: selectedSection === 'table' ? 600 : 400,
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Table View
                                        </Typography>
                                    </Box>
                                    
                                    <Box 
                                        onClick={() => setSelectedSection('chart')}
                                        sx={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flex: 1,
                                            cursor: 'pointer',
                                            color: selectedSection === 'chart' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                            borderTop: selectedSection === 'chart' ? '3px solid var(--color-primary)' : 'none',
                                            pt: 1,
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                            }
                                        }}
                                    >
                                        {selectedSection === 'chart' ? 
                                            <InsertChartIcon sx={{ fontSize: 28, mb: 0.5 }} /> : 
                                            <InsertChartOutlinedIcon sx={{ fontSize: 28, mb: 0.5 }} />
                                        }
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                fontWeight: selectedSection === 'chart' ? 600 : 400,
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Chart View
                                        </Typography>
                                    </Box>
                                </Box>
                        </Paper>
                    </>
                    ) : (
                        <Card 
                            elevation={0} 
                            sx={{ 
                                borderRadius: 2, 
                                overflow: 'hidden', 
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-background-paper)',
                                mb: 4,
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                }
                            }}
                        >
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text)' }}>
                                    No attendance records found
                                </Typography>
                                <GreenButton 
                                    variant="contained"
                                    onClick={() => navigate("/Admin/students/student/attendance/" + studentID)}
                                    startIcon={<AccessTimeIcon />}
                                >
                        Add Attendance
                                </GreenButton>
                            </Box>
                        </Card>
                    )}
                </Box>
            </Fade>
        )
    }

    const StudentMarksSection = () => {
        const renderTableSection = () => {
            return (
                <Card 
                    elevation={0} 
                    sx={{ 
                        borderRadius: 2, 
                        overflow: 'hidden', 
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-background-paper)',
                        mb: 4,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        }
                    }}
                >
                    <Box sx={{ p: 3, borderBottom: '1px solid var(--color-border)' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text)' }}>
                            Subject Marks
                        </Typography>
                    </Box>
                    <Box sx={{ p: 3 }}>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                    <StyledTableCell sx={{ color: 'var(--color-text)', fontWeight: 600 }}>Subject</StyledTableCell>
                                    <StyledTableCell sx={{ color: 'var(--color-text)', fontWeight: 600 }}>Marks</StyledTableCell>
                                    <StyledTableCell sx={{ color: 'var(--color-text)', fontWeight: 600 }}>Grade</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {subjectMarks.map((result, index) => {
                                if (!result.subName || !result.marksObtained) {
                                    return null;
                                }
                                    
                                    // Calculate grade based on marks
                                    const marks = result.marksObtained;
                                    let grade = '';
                                    let gradeColor = '';
                                    
                                    if (marks >= 90) {
                                        grade = 'A+';
                                        gradeColor = '#2e7d32';
                                    } else if (marks >= 80) {
                                        grade = 'A';
                                        gradeColor = '#2e7d32';
                                    } else if (marks >= 70) {
                                        grade = 'B';
                                        gradeColor = '#1976d2';
                                    } else if (marks >= 60) {
                                        grade = 'C';
                                        gradeColor = '#ed6c02';
                                    } else if (marks >= 50) {
                                        grade = 'D';
                                        gradeColor = '#ed6c02';
                                    } else {
                                        grade = 'F';
                                        gradeColor = '#d32f2f';
                                    }
                                    
                                return (
                                    <StyledTableRow key={index}>
                                            <StyledTableCell sx={{ color: 'var(--color-text)' }}>{result.subName.subName}</StyledTableCell>
                                            <StyledTableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box sx={{ 
                                                        width: '100%', 
                                                        mr: 1, 
                                                        height: 8, 
                                                        borderRadius: 4, 
                                                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                                        overflow: 'hidden'
                                                    }}>
                                                        <Box sx={{ 
                                                            width: `${(marks / 100) * 100}%`, 
                                                            height: '100%', 
                                                            backgroundColor: gradeColor,
                                                            transition: 'width 0.5s ease-in-out'
                                                        }} />
                                                    </Box>
                                                    <Typography variant="body2" sx={{ minWidth: 45, color: 'var(--color-text)' }}>
                                                        {marks}
                                                    </Typography>
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        color: gradeColor,
                                                        display: 'inline-block',
                                                        px: 1,
                                                        py: 0.5,
                                                        borderRadius: 1,
                                                        backgroundColor: `${gradeColor}15`
                                                    }}
                                                >
                                                    {grade}
                                                </Typography>
                                            </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    </Box>
                </Card>
            )
        }
        
        const renderChartSection = () => {
            return (
                <Card 
                    elevation={0} 
                    sx={{ 
                        borderRadius: 2, 
                        overflow: 'hidden', 
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-background-paper)',
                        mb: 4,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                        }
                    }}
                >
                    <Box sx={{ p: 3, borderBottom: '1px solid var(--color-border)' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text)' }}>
                            Marks Overview
                        </Typography>
                    </Box>
                    <Box sx={{ p: 3 }}>
                    <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
                    </Box>
                </Card>
            )
        }
        
        return (
            <Fade in={true} timeout={500}>
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
                                Student Marks
                            </Typography>
                        </Box>
                        <Typography variant="subtitle1" sx={{ color: 'var(--color-text)' }}>
                            View and manage student marks
                        </Typography>
                    </Box>

                    {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 ? (
                    <>
                        {selectedSection === 'table' && renderTableSection()}
                        {selectedSection === 'chart' && renderChartSection()}

                            <Paper 
                                sx={{ 
                                    position: 'fixed', 
                                    bottom: 0, 
                                    left: 0, 
                                    right: 0,
                                    backgroundColor: 'var(--color-background-paper)',
                                    borderTop: '1px solid var(--color-border)',
                                    zIndex: 1000,
                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                }} 
                                elevation={3}
                            >
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-around', 
                                    p: 1,
                                    height: 70
                                }}>
                                    <Box 
                                        onClick={() => setSelectedSection('table')}
                                        sx={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flex: 1,
                                            cursor: 'pointer',
                                            color: selectedSection === 'table' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                            borderTop: selectedSection === 'table' ? '3px solid var(--color-primary)' : 'none',
                                            pt: 1,
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                            }
                                        }}
                                    >
                                        {selectedSection === 'table' ? 
                                            <TableChartIcon sx={{ fontSize: 28, mb: 0.5 }} /> : 
                                            <TableChartOutlinedIcon sx={{ fontSize: 28, mb: 0.5 }} />
                                        }
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                fontWeight: selectedSection === 'table' ? 600 : 400,
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Table View
                                        </Typography>
                                    </Box>
                                    
                                    <Box 
                                        onClick={() => setSelectedSection('chart')}
                                        sx={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flex: 1,
                                            cursor: 'pointer',
                                            color: selectedSection === 'chart' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                            borderTop: selectedSection === 'chart' ? '3px solid var(--color-primary)' : 'none',
                                            pt: 1,
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                            }
                                        }}
                                    >
                                        {selectedSection === 'chart' ? 
                                            <InsertChartIcon sx={{ fontSize: 28, mb: 0.5 }} /> : 
                                            <InsertChartOutlinedIcon sx={{ fontSize: 28, mb: 0.5 }} />
                                        }
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                fontWeight: selectedSection === 'chart' ? 600 : 400,
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Chart View
                                        </Typography>
                                    </Box>
                                </Box>
                        </Paper>
                    </>
                    ) : (
                        <Card 
                            elevation={0} 
                            sx={{ 
                                borderRadius: 2, 
                                overflow: 'hidden', 
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-background-paper)',
                                mb: 4,
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                }
                            }}
                        >
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text)' }}>
                                    No marks records found
                                </Typography>
                                <GreenButton 
                                    variant="contained"
                                    onClick={() => navigate("/Admin/students/student/marks/" + studentID)}
                                    startIcon={<InsertChartIcon />}
                                >
                        Add Marks
                                </GreenButton>
                            </Box>
                        </Card>
                    )}
                </Box>
            </Fade>
        )
    }

    const StudentDetailsSection = () => {
        return (
            <ThemeProvider theme={defaultTheme}>
                <StyledContainer>
            <Fade in={true} timeout={500}>
                        <StyledPaper>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                                <Typography variant="h4" sx={{ color: 'white' }}>
                                Student Details
                            </Typography>
                                <Box>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => navigate(-1)}
                                        startIcon={<ArrowBackIcon />}
                                        sx={{ mr: 2 }}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={deleteHandler}
                                        startIcon={<DeleteIcon />}
                                    >
                                        Delete
                                    </Button>
                        </Box>
                    </Box>

                            {loading ? (
                                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <Grid container spacing={3}>
                                    {/* Student Information Card */}
                        <Grid item xs={12} md={6}>
                                        <InfoCard>
                                            <CardHeader
                                                title="Student Information"
                                                avatar={<PersonIcon />}
                                            />
                                            <CardContent>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Typography variant="h6" color="primary">
                                                            {userDetails?.name}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Roll Number
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {userDetails?.rollNum}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Class
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {userDetails?.sclassName?.sclassName}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Email
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {userDetails?.email}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Phone Number
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {userDetails?.phoneNumber}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Address
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {userDetails?.address}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                </CardContent>
                                        </InfoCard>
                        </Grid>
                        
                                    {/* Parent Information Card */}
                        <Grid item xs={12} md={6}>
                                        <InfoCard>
                                            <CardHeader
                                                title="Parent Information"
                                                avatar={<PersonIcon />}
                                            />
                                            <CardContent>
                                                {userDetails?.parent ? (
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12}>
                                                            <Typography variant="h6" color="primary">
                                                                {userDetails.parent.name}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <Typography variant="subtitle2" color="textSecondary">
                                                                Email
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ color: 'var(--color-text)' }}>
                                                                {userDetails.parent.email || 'Not provided'}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <Typography variant="subtitle2" color="textSecondary">
                                                                Phone Number
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ color: 'var(--color-text)' }}>
                                                                {userDetails.parent.phoneNumber || 'Not provided'}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Button
                                                                variant="outlined"
                                                                color="primary"
                                                                startIcon={<PersonIcon />}
                                                                onClick={() => navigate(`/Admin/parents/parent/${userDetails.parent._id}`)}
                                sx={{ 
                                                                    borderColor: 'var(--color-primary)',
                                                                    color: 'var(--color-primary)',
                                    '&:hover': {
                                                                        borderColor: 'var(--color-primary)',
                                                                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                                                    }
                                                                }}
                                                            >
                                                                View Parent Profile
                                                            </Button>
                        </Grid>
                    </Grid>
                                                ) : (
                                                    <Box textAlign="center" py={2}>
                                                        <Typography variant="body1" color="textSecondary" gutterBottom>
                                                            No parent information available
                                                        </Typography>
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            startIcon={<PersonAddAlt1Icon />}
                                                            onClick={() => navigate(`/Admin/parents/add/${userDetails?._id}`)}
                        sx={{ 
                                                                borderColor: 'var(--color-primary)',
                                                                color: 'var(--color-primary)',
                            '&:hover': {
                                                                    borderColor: 'var(--color-primary)',
                                                                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                                                }
                                                            }}
                                                        >
                                                            Add Parent
                                                        </Button>
                                </Box>
                                                )}
                                            </CardContent>
                                        </InfoCard>
                                    </Grid>

                                    {/* Attendance Card */}
                                    <Grid item xs={12} md={6}>
                                        <InfoCard>
                                            <CardHeader
                                                title="Attendance Overview"
                                                avatar={<CalendarMonthIcon />}
                                            />
                                            <CardContent>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Present Days
                                    </Typography>
                                                        <Typography variant="h4" color="primary">
                                                            {userDetails?.attendance?.filter(a => a.status === "Present").length || 0}
                                            </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Absent Days
                                            </Typography>
                                                        <Typography variant="h4" color="error">
                                                            {userDetails?.attendance?.filter(a => a.status === "Absent").length || 0}
                                            </Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            startIcon={<CalendarMonthIcon />}
                                                            onClick={() => navigate(`/Admin/students/student/${userDetails?._id}/attendance`)}
                                                        >
                                                            View Detailed Attendance
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </InfoCard>
                                    </Grid>

                                    {/* Marks Card */}
                                    <Grid item xs={12} md={6}>
                                        <InfoCard>
                                            <CardHeader
                                                title="Academic Performance"
                                                avatar={<GradeIcon />}
                                            />
                                            <CardContent>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Overall Percentage
                                                        </Typography>
                                                        <Typography variant="h4" color="primary">
                                                            {userDetails?.examResult?.length > 0
                                                                ? (userDetails.examResult.reduce((acc, curr) => acc + curr.obtainedMarks, 0) /
                                                                    userDetails.examResult.reduce((acc, curr) => acc + curr.totalMarks, 0) * 100).toFixed(2)
                                                                : "N/A"}%
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            startIcon={<GradeIcon />}
                                                            onClick={() => navigate(`/Admin/students/student/${userDetails?._id}/marks`)}
                                                        >
                                                            View Detailed Marks
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                        </CardContent>
                                        </InfoCard>
                                    </Grid>
                                </Grid>
                            )}
                        </StyledPaper>
            </Fade>
                </StyledContainer>
                <Popup
                    showPopup={showPopup}
                    setShowPopup={setShowPopup}
                    message={message}
                />
            </ThemeProvider>
        )
    }

    return (
        <Fade in={true} timeout={500}>
            <StyledContainer maxWidth="lg" sx={{ py: 4 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                                <TabList onChange={handleChange} sx={{ 
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: 'var(--color-primary)',
                                    },
                                    '& .MuiTab-root': {
                                        color: 'var(--color-text-secondary)',
                                        '&.Mui-selected': {
                                            color: 'var(--color-primary)',
                                            fontWeight: 600,
                                        },
                                    }
                                }}>
                                    <Tab label="Details" value="1" />
                                    <Tab label="Attendance" value="2" />
                                    <Tab label="Marks" value="3" />
                                </TabList>
                            </Box>
                                <TabPanel value="1">
                                    <StudentDetailsSection />
                                </TabPanel>
                                <TabPanel value="2">
                                    <StudentAttendanceSection />
                                </TabPanel>
                                <TabPanel value="3">
                                    <StudentMarksSection />
                                </TabPanel>
                        </TabContext>
                    </Box>
                )}
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
            </StyledContainer>
        </Fade>
    )
}

export default ViewStudent;