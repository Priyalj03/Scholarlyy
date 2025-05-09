import React, { useEffect, useState } from 'react'
import { Grid, Typography, Box, Fade, CircularProgress, Paper, Card, CardContent, IconButton, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { calculateOverallAttendancePercentage } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import SeeNotice from '../../components/SeeNotice';
import CountUp from 'react-countup';
import Subject from "../../assets/subjects.svg";
import Assignment from "../../assets/assignment.svg";
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { useNavigate } from 'react-router-dom';
import { 
    DashboardCard, 
    CardIcon, 
    CardTitle, 
    CardValue, 
    DashboardContainer, 
    DashboardGrid,
    DashboardSection,
    SectionTitle
} from '../../components/styles';

// Import icons
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const StudentHomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userDetails, currentUser, loading, response } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);

    const [subjectAttendance, setSubjectAttendance] = useState([]);

    const classID = currentUser.sclassName._id

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
        dispatch(getSubjectList(classID, "ClassSubjects"));
    }, [dispatch, currentUser._id, classID]);

    const numberOfSubjects = subjectsList && subjectsList.length;

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails])

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    const StatCard = ({ icon, title, value, color, onClick }) => (
        <Card 
            elevation={0} 
            sx={{ 
                height: '100%', 
                borderRadius: 2, 
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-background-paper)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    cursor: onClick ? 'pointer' : 'default',
                }
            }}
            onClick={onClick}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            width: 48, 
                            height: 48, 
                            borderRadius: '50%',
                            backgroundColor: color === 'primary' ? 'rgba(25, 118, 210, 0.1)' : 
                                           color === 'success' ? 'rgba(46, 125, 50, 0.1)' : 
                                           color === 'warning' ? 'rgba(237, 108, 2, 0.1)' : 
                                           'rgba(156, 39, 176, 0.1)',
                            mr: 2
                        }}
                    >
                        {icon}
                    </Box>
                    <Typography variant="h6" sx={{ color: 'var(--color-text)', fontWeight: 600 }}>
                        {title}
                    </Typography>
                </Box>
                <Typography variant="h3" sx={{ 
                    fontWeight: 700, 
                    color: color === 'primary' ? '#1976d2' : 
                           color === 'success' ? '#2e7d32' : 
                           color === 'warning' ? '#ed6c02' : 
                           '#9c27b0',
                    mb: 1
                }}>
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );

    return (
        <Fade in={true} timeout={500}>
            <Box sx={{ 
                background: 'linear-gradient(180deg, var(--color-bg) 0%, var(--color-surface) 100%)',
                minHeight: '100vh',
                padding: '24px 0',
            }}>
                <DashboardContainer maxWidth="lg">
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h4" sx={{ 
                                    fontWeight: 700, 
                                    color: 'var(--color-text)',
                                    mb: 1,
                                    background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-variant))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>
                                    Student Dashboard
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
                                    Welcome back, {currentUser.name}! Here's your academic overview.
                                </Typography>
                            </Box>
                            
                            <DashboardGrid container spacing={3}>
                                <Grid item xs={12} md={3} lg={3}>
                                    <StatCard
                                        icon={<PersonIcon sx={{ color: '#1976d2' }} />}
                                        title="Student ID"
                                        value={currentUser.rollNum}
                                        color="primary"
                                    />
                                </Grid>
                                <Grid item xs={12} md={3} lg={3}>
                                    <StatCard
                                        icon={<SchoolIcon sx={{ color: '#2e7d32' }} />}
                                        title="Class"
                                        value={currentUser.sclassName.sclassName}
                                        color="success"
                                    />
                                </Grid>
                                <Grid item xs={12} md={3} lg={3}>
                                    <StatCard
                                        icon={<MenuBookIcon sx={{ color: '#ed6c02' }} />}
                                        title="Total Subjects"
                                        value={numberOfSubjects || 0}
                                        color="warning"
                                        onClick={() => navigate('/Student/subjects')}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3} lg={3}>
                                    <StatCard
                                        icon={<CalendarTodayIcon sx={{ color: '#9c27b0' }} />}
                                        title="Attendance"
                                        value={`${overallAttendancePercentage}%`}
                                        color="purple"
                                        onClick={() => navigate('/Student/attendance')}
                                    />
                                </Grid>
                            </DashboardGrid>

                            <Grid container spacing={3} sx={{ mt: 2 }}>
                                <Grid item xs={12} md={6}>
                                    <Paper 
                                        elevation={0} 
                                        sx={{ 
                                            p: 3, 
                                            borderRadius: 2, 
                                            border: '1px solid var(--color-border)',
                                            backgroundColor: 'var(--color-background-paper)',
                                            height: '100%'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text)' }}>
                                                Attendance Overview
                                            </Typography>
                                            <Tooltip title="View detailed attendance">
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => navigate('/Student/attendance')}
                                                    sx={{ 
                                                        color: 'var(--color-primary)',
                                                        '&:hover': { backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)' }
                                                    }}
                                                >
                                                    <ArrowForwardIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        {response ? (
                                            <Typography variant="body1" color="text.secondary">No Attendance Found</Typography>
                                        ) : (
                                            loading ? (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                                    <CircularProgress size={40} />
                                                </Box>
                                            ) : (
                                                subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                                                    <CustomPieChart data={chartData} />
                                                ) : (
                                                    <Typography variant="body1" color="text.secondary">No Attendance Found</Typography>
                                                )
                                            )
                                        )}
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper 
                                        elevation={0} 
                                        sx={{ 
                                            p: 3, 
                                            borderRadius: 2, 
                                            border: '1px solid var(--color-border)',
                                            backgroundColor: 'var(--color-background-paper)',
                                            height: '100%'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text)' }}>
                                                Recent Notices
                                            </Typography>
                                            <Tooltip title="View all notices">
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => navigate('/Student/complain')}
                                                    sx={{ 
                                                        color: 'var(--color-primary)',
                                                        '&:hover': { backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)' }
                                                    }}
                                                >
                                                    <ArrowForwardIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        <SeeNotice />
                                    </Paper>
                                </Grid>
                            </Grid>
                        </>
                    )}
                </DashboardContainer>
            </Box>
        </Fade>
    )
}

export default StudentHomePage;