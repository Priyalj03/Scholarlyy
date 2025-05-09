import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
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
import CustomBarChart from '../../components/CustomBarChart'
import { useNavigate } from 'react-router-dom';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GradeIcon from '@mui/icons-material/Grade';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const StudentSubjects = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id])

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [subjectMarks, setSubjectMarks] = useState([]);
    const [selectedSection, setSelectedSection] = useState(0);

    useEffect(() => {
        if (userDetails) {
            setSubjectMarks(userDetails.examResult || []);
        }
    }, [userDetails])

    useEffect(() => {
        if (subjectMarks.length === 0) {
            dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects"));
        }
    }, [subjectMarks, dispatch, currentUser.sclassName._id]);

    const handleSectionChange = (event, newValue) => {
        setSelectedSection(newValue);
    };

    const calculateGrade = (marks) => {
        if (marks >= 90) return { grade: 'A+', color: '#2e7d32' };
        if (marks >= 80) return { grade: 'A', color: '#388e3c' };
        if (marks >= 70) return { grade: 'B+', color: '#689f38' };
        if (marks >= 60) return { grade: 'B', color: '#ffa000' };
        if (marks >= 50) return { grade: 'C', color: '#f57c00' };
        return { grade: 'F', color: '#d32f2f' };
    };

    const renderTableSection = () => {
        return (
            <Paper 
                elevation={0} 
                sx={{ 
                    borderRadius: 2, 
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-background-paper)',
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ p: 3, borderBottom: '1px solid var(--color-border)' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text)' }}>
                        Subject Performance
                </Typography>
                </Box>
                <Table>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Subject</StyledTableCell>
                            <StyledTableCell>Marks</StyledTableCell>
                            <StyledTableCell>Grade</StyledTableCell>
                            <StyledTableCell>Progress</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {subjectMarks.map((result, index) => {
                            if (!result.subName || !result.marksObtained) {
                                return null;
                            }
                            const { grade, color } = calculateGrade(result.marksObtained);
                            return (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{result.subName.subName}</StyledTableCell>
                                    <StyledTableCell>{result.marksObtained}</StyledTableCell>
                                    <StyledTableCell>
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
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {grade}
                                        </Box>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Box sx={{ width: '100%', mr: 1 }}>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={result.marksObtained} 
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
                                    </StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>
        );
    };

    const renderChartSection = () => {
        return (
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
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text)' }}>
                        Performance Chart
                    </Typography>
                </Box>
                <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
            </Paper>
        );
    };

    const renderClassDetailsSection = () => {
        return (
            <Fade in={true} timeout={500}>
                <Box>
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ 
                            fontWeight: 700, 
                            color: 'var(--color-text)', 
                            mb: 1,
                            background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-variant))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Your Class Information
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: 'var(--color-text-secondary)' }}>
                            View your class details and enrolled subjects
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card 
                                elevation={0} 
                                sx={{ 
                                    borderRadius: 2, 
                                    border: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-background-paper)',
                                    height: '100%'
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Box 
                                            sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center',
                                                width: 48, 
                                                height: 48, 
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                                mr: 2
                                            }}
                                        >
                                            <SchoolIcon sx={{ color: '#1976d2' }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ color: 'var(--color-text)', fontWeight: 600 }}>
                                            Class Information
                                        </Typography>
                                    </Box>
                                    <Typography variant="h5" sx={{ mb: 2, color: 'var(--color-text)' }}>
                                        Class {sclassDetails && sclassDetails.sclassName}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'var(--color-text-secondary)', mb: 2 }}>
                                        You are currently enrolled in the above class. This is where you'll find all your subjects and academic information.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card 
                                elevation={0} 
                                sx={{ 
                                    borderRadius: 2, 
                                    border: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-background-paper)',
                                    height: '100%'
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
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
                                            <MenuBookIcon sx={{ color: '#9c27b0' }} />
                                        </Box>
                                        <Typography variant="h6" sx={{ color: 'var(--color-text)', fontWeight: 600 }}>
                                            Enrolled Subjects
                </Typography>
                                    </Box>
                                    <Typography variant="h5" sx={{ mb: 2, color: 'var(--color-text)' }}>
                                        {subjectsList && subjectsList.length} Subjects
                </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    {subjectsList && subjectsList.map((subject, index) => (
                                        <Box key={index} sx={{ mb: 1.5 }}>
                                            <Typography variant="subtitle1" sx={{ color: 'var(--color-text)', fontWeight: 500 }}>
                                                {subject.subName} 
                                                <Typography component="span" sx={{ color: 'var(--color-text-secondary)', ml: 1 }}>
                                                    ({subject.subCode})
                </Typography>
                            </Typography>
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Fade>
        );
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
                                        Subject Information
                                    </Typography>
                                </Box>
                                <Typography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
                                    View your subjects, grades, and academic performance
                                </Typography>
                            </Box>

                            {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 ? (
                                <>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                                        <Tabs 
                                            value={selectedSection} 
                                            onChange={handleSectionChange} 
                                            aria-label="subject tabs"
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
                                            <Tab 
                                                icon={<TableChartIcon />} 
                                                label="Table View" 
                                                iconPosition="start"
                                            />
                                            <Tab 
                                                icon={<InsertChartIcon />} 
                                                label="Chart View" 
                                                iconPosition="start"
                                            />
                                        </Tabs>
                                    </Box>

                                    {selectedSection === 0 && renderTableSection()}
                                    {selectedSection === 1 && renderChartSection()}
                                </>
                            ) : (
                                renderClassDetailsSection()
            )}
        </>
                    )}
                </Container>
            </Box>
        </Fade>
    );
};

export default StudentSubjects;