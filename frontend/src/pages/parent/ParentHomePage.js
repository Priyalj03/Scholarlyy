import React, { useEffect, useState } from 'react'
import { Grid, Typography, Box, Fade, CircularProgress, Paper, Card, CardContent, IconButton, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { calculateOverallAttendancePercentage } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import SeeNotice from '../../components/SeeNotice';
import CountUp from 'react-countup';
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

const ParentHomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);

    const [overallAttendancePercentage, setOverallAttendancePercentage] = useState(0);
    const [numberOfSubjects, setNumberOfSubjects] = useState(0);

    useEffect(() => {
        if (currentUser) {
            dispatch(getUserDetails(currentUser._id, "Parent"));
        }
    }, [dispatch, currentUser]);

    useEffect(() => {
        if (userDetails) {
            const student = userDetails.student;
            if (student) {
                dispatch(getSubjectList(student.sclassName._id, "ClassSubjects"));
                const attendancePercentage = calculateOverallAttendancePercentage(student.attendance);
                setOverallAttendancePercentage(attendancePercentage);
            }
        }
    }, [dispatch, userDetails]);

    useEffect(() => {
        if (subjectsList) {
            setNumberOfSubjects(subjectsList.length);
        }
    }, [subjectsList]);

    const StatCard = ({ icon, title, value, color, onClick }) => (
        <Card 
            sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                cursor: onClick ? 'pointer' : 'default',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                },
                background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-bg) 100%)',
                border: '1px solid var(--color-border)',
            }}
            onClick={onClick}
        >
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {icon}
                    <Typography variant="h6" sx={{ ml: 1, color: 'var(--color-text-secondary)' }}>
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
                                    Parent Dashboard
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
                                    Welcome back, {currentUser.name}! Here's your child's academic overview.
                                </Typography>
                            </Box>
                            
                            <DashboardGrid container spacing={3}>
                                <Grid item xs={12} md={3} lg={3}>
                                    <StatCard
                                        icon={<PersonIcon sx={{ color: '#1976d2' }} />}
                                        title="Student ID"
                                        value={userDetails?.student?.rollNum || 'N/A'}
                                        color="primary"
                                    />
                                </Grid>
                                <Grid item xs={12} md={3} lg={3}>
                                    <StatCard
                                        icon={<SchoolIcon sx={{ color: '#2e7d32' }} />}
                                        title="Class"
                                        value={userDetails?.student?.sclassName?.sclassName || 'N/A'}
                                        color="success"
                                    />
                                </Grid>
                                <Grid item xs={12} md={3} lg={3}>
                                    <StatCard
                                        icon={<MenuBookIcon sx={{ color: '#ed6c02' }} />}
                                        title="Total Subjects"
                                        value={numberOfSubjects || 0}
                                        color="warning"
                                        onClick={() => navigate('/Parent/subjects')}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3} lg={3}>
                                    <StatCard
                                        icon={<CalendarTodayIcon sx={{ color: '#9c27b0' }} />}
                                        title="Attendance"
                                        value={`${overallAttendancePercentage}%`}
                                        color="purple"
                                        onClick={() => navigate('/Parent/attendance')}
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
                                        <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text)' }}>
                                            Attendance Overview
                                        </Typography>
                                        <Box sx={{ height: 300 }}>
                                            <CustomPieChart
                                                data={[
                                                    { name: 'Present', value: overallAttendancePercentage },
                                                    { name: 'Absent', value: 100 - overallAttendancePercentage }
                                                ]}
                                            />
                                        </Box>
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
                                        <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text)' }}>
                                            Recent Notices
                                        </Typography>
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

export default ParentHomePage 