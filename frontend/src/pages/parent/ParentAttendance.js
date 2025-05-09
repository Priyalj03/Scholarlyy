import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Container, 
    Paper, 
    Table, 
    TableBody, 
    TableHead, 
    Typography, 
    Box, 
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
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { getAttendanceList } from '../../redux/attendanceRelated/attendanceHandle';
import CustomBarChart from '../../components/CustomBarChart';
import { useNavigate } from 'react-router-dom';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GradeIcon from '@mui/icons-material/Grade';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const ParentAttendance = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { attendanceList } = useSelector((state) => state.attendance);

    const [selectedSection, setSelectedSection] = useState(0);
    const [attendanceStats, setAttendanceStats] = useState({
        present: 0,
        absent: 0,
        total: 0
    });

    useEffect(() => {
        if (currentUser) {
            dispatch(getUserDetails(currentUser._id, "Parent"));
        }
    }, [dispatch, currentUser]);

    useEffect(() => {
        if (userDetails?.student?._id) {
            dispatch(getAttendanceList(userDetails.student._id, "StudentAttendance"));
        }
    }, [dispatch, userDetails]);

    useEffect(() => {
        if (attendanceList) {
            const stats = attendanceList.reduce((acc, record) => {
                acc.total++;
                if (record.status === 'Present') {
                    acc.present++;
                } else {
                    acc.absent++;
                }
                return acc;
            }, { present: 0, absent: 0, total: 0 });
            setAttendanceStats(stats);
        }
    }, [attendanceList]);

    const handleSectionChange = (event, newValue) => {
        setSelectedSection(newValue);
    };

    const renderTableSection = () => (
        <Paper elevation={0} sx={{ 
            p: 3, 
            borderRadius: 2, 
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-background-paper)',
        }}>
            <Table>
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell>Date</StyledTableCell>
                        <StyledTableCell>Subject</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {attendanceList?.map((record) => (
                        <StyledTableRow key={record._id}>
                            <StyledTableCell>{new Date(record.date).toLocaleDateString()}</StyledTableCell>
                            <StyledTableCell>{record.subject?.subName}</StyledTableCell>
                            <StyledTableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {record.status === 'Present' ? (
                                        <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
                                    ) : (
                                        <CancelIcon sx={{ color: 'error.main', mr: 1 }} />
                                    )}
                                    {record.status}
                                </Box>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );

    const renderChartSection = () => (
        <Paper elevation={0} sx={{ 
            p: 3, 
            borderRadius: 2, 
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-background-paper)',
        }}>
            <Box sx={{ height: 400 }}>
                <CustomBarChart
                    data={[
                        { name: 'Present', value: attendanceStats.present },
                        { name: 'Absent', value: attendanceStats.absent }
                    ]}
                    title="Attendance Overview"
                />
            </Box>
        </Paper>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Fade in={true} timeout={500}>
            <Box sx={{ 
                background: 'linear-gradient(180deg, var(--color-bg) 0%, var(--color-surface) 100%)',
                minHeight: '100vh',
                padding: '24px 0',
            }}>
                <Container maxWidth="lg">
                    <Box sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Tooltip title="Back to Dashboard">
                                <IconButton 
                                    onClick={() => navigate('/Parent/dashboard')}
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
                                background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-variant))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                Attendance
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
                            View your child's attendance records and statistics
                        </Typography>
                    </Box>

                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ 
                                borderRadius: 2,
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-background-paper)',
                            }}>
                                <CardContent>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Total Classes
                                    </Typography>
                                    <Typography variant="h4" sx={{ color: 'var(--color-primary)' }}>
                                        {attendanceStats.total}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ 
                                borderRadius: 2,
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-background-paper)',
                            }}>
                                <CardContent>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Present
                                    </Typography>
                                    <Typography variant="h4" sx={{ color: 'success.main' }}>
                                        {attendanceStats.present}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ 
                                borderRadius: 2,
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-background-paper)',
                            }}>
                                <CardContent>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Absent
                                    </Typography>
                                    <Typography variant="h4" sx={{ color: 'error.main' }}>
                                        {attendanceStats.absent}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                        <Tabs 
                            value={selectedSection} 
                            onChange={handleSectionChange}
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
                            <Tab icon={<TableChartIcon />} label="Table View" />
                            <Tab icon={<InsertChartIcon />} label="Chart View" />
                        </Tabs>
                    </Box>

                    {selectedSection === 0 ? renderTableSection() : renderChartSection()}
                </Container>
            </Box>
        </Fade>
    );
};

export default ParentAttendance; 