import React, { useEffect, useState } from 'react'
import { KeyboardArrowDown, KeyboardArrowUp, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { 
    BottomNavigation, 
    BottomNavigationAction, 
    Box, 
    Button, 
    Collapse, 
    Paper, 
    Table, 
    TableBody, 
    TableHead, 
    Typography, 
    Container, 
    Fade, 
    CircularProgress, 
    Card, 
    CardContent, 
    Grid, 
    Tabs, 
    Tab, 
    IconButton, 
    Tooltip, 
    Divider,
    LinearProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';
import { useNavigate } from 'react-router-dom';

import CustomBarChart from '../../components/CustomBarChart'

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const ViewStdAttendance = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [openStates, setOpenStates] = useState({});

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails])

    const attendanceBySubject = groupAttendanceBySubject(subjectAttendance)

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const subjectData = Object.entries(attendanceBySubject).map(([subName, { subCode, present, sessions }]) => {
        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: subjectAttendancePercentage,
            totalClasses: sessions,
            attendedClasses: present
        };
    });

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const getAttendanceColor = (percentage) => {
        if (percentage >= 90) return '#2e7d32';
        if (percentage >= 80) return '#388e3c';
        if (percentage >= 70) return '#689f38';
        if (percentage >= 60) return '#ffa000';
        if (percentage >= 50) return '#f57c00';
        return '#d32f2f';
    };

    const renderTableSection = () => {
        return (
            <Fade in={true} timeout={500}>
                <Box>
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
                                    {Object.entries(attendanceBySubject).map(([subName, { present, allData, subId, sessions }], index) => {
                                        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
                                        const color = getAttendanceColor(subjectAttendancePercentage);
                                        
                                        return (
                                            <React.Fragment key={index}>
                                                <StyledTableRow>
                                                    <StyledTableCell sx={{ color: 'var(--color-text)' }}>{subName}</StyledTableCell>
                                                    <StyledTableCell sx={{ color: 'var(--color-text)' }}>{present}</StyledTableCell>
                                                    <StyledTableCell sx={{ color: 'var(--color-text)' }}>{sessions}</StyledTableCell>
                                                    <StyledTableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Box 
                                                                sx={{ 
                                                                    display: 'inline-flex', 
                                                                    alignItems: 'center', 
                                                                    justifyContent: 'center',
                                                                    width: 36, 
                                                                    height: 36, 
                                                                    borderRadius: '50%',
                                                                    backgroundColor: `${color}20`,
                                                                    color: color,
                                                                    fontWeight: 'bold',
                                                                    mr: 2
                                                                }}
                                                            >
                                                                {subjectAttendancePercentage}%
                                                            </Box>
                                                            <Box sx={{ width: '100%', mr: 1 }}>
                                                                <LinearProgress 
                                                                    variant="determinate" 
                                                                    value={subjectAttendancePercentage} 
                                                                    sx={{ 
                                                                        height: 10, 
                                                                        borderRadius: 5,
                                                                        backgroundColor: 'rgba(0,0,0,0.1)',
                                                                        '& .MuiLinearProgress-bar': {
                                                                            backgroundColor: color
                                                                        }
                                                                    }} 
                                                                />
                                                            </Box>
                                                        </Box>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <Button 
                                                            variant="outlined"
                                                            onClick={() => handleOpen(subId)}
                                                            sx={{ 
                                                                color: 'var(--color-primary)',
                                                                borderColor: 'var(--color-primary)',
                                                                '&:hover': {
                                                                    borderColor: 'var(--color-primary-variant)',
                                                                    backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)'
                                                                }
                                                            }}
                                                        >
                                                            {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />} Details
                                                        </Button>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                                <StyledTableRow>
                                                    <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                        <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                            <Box sx={{ margin: 1 }}>
                                                                <Typography variant="h6" gutterBottom component="div" sx={{ color: 'var(--color-text)' }}>
                                                                    Attendance Details
                                                                </Typography>
                                                                <Table size="small" aria-label="purchases">
                                                                    <TableHead>
                                                                        <StyledTableRow>
                                                                            <StyledTableCell sx={{ color: 'var(--color-text)', fontWeight: 600 }}>Date</StyledTableCell>
                                                                            <StyledTableCell align="right" sx={{ color: 'var(--color-text)', fontWeight: 600 }}>Status</StyledTableCell>
                                                                        </StyledTableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {allData.map((data, index) => {
                                                                            const date = new Date(data.date);
                                                                            const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                                            const statusColor = data.status === 'Present' ? '#2e7d32' : '#d32f2f';
                                                                            return (
                                                                                <StyledTableRow key={index}>
                                                                                    <StyledTableCell component="th" scope="row" sx={{ color: 'var(--color-text)' }}>
                                                                                        {dateString}
                                                                                    </StyledTableCell>
                                                                                    <StyledTableCell align="right">
                                                                                        <Box 
                                                                                            sx={{ 
                                                                                                display: 'inline-flex', 
                                                                                                alignItems: 'center', 
                                                                                                justifyContent: 'center',
                                                                                                px: 2, 
                                                                                                py: 0.5, 
                                                                                                borderRadius: 1,
                                                                                                backgroundColor: `${statusColor}20`,
                                                                                                color: statusColor,
                                                                                                fontWeight: 500
                                                                                            }}
                                                                                        >
                                                                                            {data.status}
                                                                                        </Box>
                                                                                    </StyledTableCell>
                                                                                </StyledTableRow>
                                                                            )
                                                                        })}
                                                                    </TableBody>
                                                                </Table>
                                                            </Box>
                                                        </Collapse>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            </React.Fragment>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </Box>
                    </Card>
                    
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
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'var(--color-text)' }}>
                                Overall Attendance Summary
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box 
                                    sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        width: 48, 
                                        height: 48, 
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(156, 39, 176, 0.1)',
                                        mr: 2
                                    }}
                                >
                                    <AccessTimeIcon sx={{ color: '#9c27b0' }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ color: 'var(--color-text)', fontWeight: 600 }}>
                                        Overall Attendance
                                    </Typography>
                                    <Typography variant="h4" sx={{ color: 'var(--color-text)', fontWeight: 700 }}>
                                        {overallAttendancePercentage.toFixed(2)}%
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ width: '100%', mr: 1, mb: 2 }}>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={overallAttendancePercentage} 
                                    sx={{ 
                                        height: 10, 
                                        borderRadius: 5,
                                        backgroundColor: 'rgba(0,0,0,0.1)',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: '#9c27b0'
                                        }
                                    }} 
                                />
                            </Box>
                            <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                                You have attended {overallAttendancePercentage.toFixed(2)}% of all classes. 
                                {overallAttendancePercentage < 75 ? 
                                    " Your attendance is below the recommended 75% threshold." : 
                                    " Your attendance is good!"}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Fade>
        )
    }

    const renderChartSection = () => {
        return (
            <Fade in={true} timeout={500}>
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
                            Attendance Visualization
                        </Typography>
                    </Box>
                    <Box sx={{ p: 3 }}>
                        <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
                    </Box>
                </Card>
            </Fade>
        )
    };

    return (
        <Fade in={true} timeout={500}>
            <Box sx={{ 
                background: 'linear-gradient(180deg, var(--color-bg) 0%, var(--color-surface) 100%)',
                minHeight: '100vh',
                padding: '24px 0',
            }}>
                <Container maxWidth="lg">
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Tooltip title="Back to Dashboard">
                                        <IconButton 
                                            onClick={() => navigate('/Student/dashboard')}
                                            sx={{ 
                                                mr: 2,
                                                color: 'var(--color-primary)',
                                                '&:hover': { backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)' }
                                            }}
                                        >
                                            <ArrowBackIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Typography variant="h4" sx={{ 
                                        fontWeight: 700, 
                                        color: 'var(--color-text)',
                                        background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-variant))',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}>
                                        Attendance Records
                                    </Typography>
                                </Box>
                                <Typography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
                                    View your attendance records and performance across all subjects
                                </Typography>
                            </Box>

                            {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                                <>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                                        <Tabs 
                                            value={selectedSection} 
                                            onChange={handleSectionChange} 
                                            aria-label="attendance tabs"
                                            sx={{
                                                '& .MuiTab-root': {
                                                    color: 'var(--color-text-secondary)',
                                                    '&.Mui-selected': {
                                                        color: 'var(--color-primary)',
                                                    },
                                                },
                                                '& .MuiTabs-indicator': {
                                                    backgroundColor: 'var(--color-primary)',
                                                },
                                            }}
                                        >
                                        </Tabs>
                                    </Box>

                                    {selectedSection === 'table' && renderTableSection()}
                                    {selectedSection === 'chart' && renderChartSection()}
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
                                        <Box 
                                            sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                width: 64, 
                                                height: 64, 
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(156, 39, 176, 0.1)',
                                                mx: 'auto',
                                                mb: 2
                                            }}
                                        >
                                            <AccessTimeIcon sx={{ color: '#9c27b0', fontSize: 32 }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text)' }}>
                                            No Attendance Records Found
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 3, color: 'var(--color-text-secondary)' }}>
                                            You don't have any attendance records yet. Attendance will be recorded by your teachers.
                                        </Typography>
                                    </Box>
                                </Card>
                            )}
                        </>
                    )}
                </Container>
            </Box>
        </Fade>
    )
}

export default ViewStdAttendance