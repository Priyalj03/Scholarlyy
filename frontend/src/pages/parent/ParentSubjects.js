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
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import CustomBarChart from '../../components/CustomBarChart';
import { useNavigate } from 'react-router-dom';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GradeIcon from '@mui/icons-material/Grade';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ParentSubjects = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser, userDetails, loading } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);

    const [selectedSection, setSelectedSection] = useState(0);

    useEffect(() => {
        if (currentUser) {
            dispatch(getUserDetails(currentUser._id, "Parent"));
        }
    }, [dispatch, currentUser]);

    useEffect(() => {
        if (userDetails?.student?.sclassName?._id) {
            dispatch(getSubjectList(userDetails.student.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

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
                        <StyledTableCell>Subject Name</StyledTableCell>
                        <StyledTableCell>Subject Code</StyledTableCell>
                        <StyledTableCell>Teacher</StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {subjectsList?.map((subject) => (
                        <StyledTableRow key={subject._id}>
                            <StyledTableCell>{subject.subName}</StyledTableCell>
                            <StyledTableCell>{subject.subCode}</StyledTableCell>
                            <StyledTableCell>{subject.teacher?.name || 'Not Assigned'}</StyledTableCell>
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
                    data={subjectsList?.map(subject => ({
                        name: subject.subName,
                        value: subject.teacher ? 1 : 0
                    })) || []}
                    title="Subject Distribution"
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
                                Subjects
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
                            View your child's subjects and their assigned teachers
                        </Typography>
                    </Box>

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

export default ParentSubjects; 