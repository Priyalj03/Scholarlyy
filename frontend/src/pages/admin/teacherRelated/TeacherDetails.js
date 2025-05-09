import React, { useEffect } from 'react';
import { getTeacherDetails } from '../../../redux/teacherRelated/teacherHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Button, Container, Typography, Box, Card, CardContent, 
    Grid, Fade, CircularProgress, Tooltip, IconButton, Divider,
    Paper
} from '@mui/material';
import { BlueButton, GreenButton, PurpleButton } from '../../../components/buttonStyles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailIcon from '@mui/icons-material/Email';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const TeacherDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { loading, teacherDetails, error } = useSelector((state) => state.teacher);

    const teacherID = params.id;

    useEffect(() => {
        dispatch(getTeacherDetails(teacherID));
    }, [dispatch, teacherID]);

    if (error) {
        console.log(error);
    }

    const isSubjectNamePresent = teacherDetails?.teachSubject?.subName;
    const classID = teacherDetails?.teachSclass?._id;
    const subjectID = teacherDetails?.teachSubject?._id;

    const handleAddSubject = () => {
        navigate(`/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`);
    };

    const handleBack = () => {
        navigate('/Admin/teachers');
    };

    const handleDelete = () => {
        // Implement delete functionality
        console.log('Delete teacher:', teacherID);
    };

    const handleEdit = () => {
        // Implement edit functionality
        console.log('Edit teacher:', teacherID);
    };

    const handleViewStudents = () => {
        if (classID) {
            navigate(`/Admin/classes/class/${classID}`);
        }
    };

    const handleManageAttendance = () => {
        if (classID && subjectID) {
            navigate(`/Admin/subject/student/attendance/${classID}/${subjectID}`);
        }
    };

    const handleManageMarks = () => {
        if (classID && subjectID) {
            navigate(`/Admin/subject/student/marks/${classID}/${subjectID}`);
        }
    };

    const InfoItem = ({ label, value, icon, color = 'primary' }) => (
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            p: 1.5,
            borderRadius: 1,
            backgroundColor: 'var(--color-background)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
                backgroundColor: 'var(--color-background-hover)',
            }
        }}>
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 40, 
                height: 40, 
                borderRadius: '50%',
                backgroundColor: color === 'primary' ? 'rgba(25, 118, 210, 0.1)' : 
                               color === 'success' ? 'rgba(46, 125, 50, 0.1)' : 
                               color === 'purple' ? 'rgba(156, 39, 176, 0.1)' : 
                               'rgba(0, 0, 0, 0.1)',
                mr: 2
            }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="subtitle2" sx={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                    {label}
                </Typography>
                <Typography variant="body1" sx={{ color: 'var(--color-text)', fontWeight: 600 }}>
                    {value || 'Not provided'}
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Fade in={true} timeout={500}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                            <Tooltip title="Back to Teachers">
                                <IconButton 
                                    onClick={handleBack}
                                    sx={{ 
                                        mr: 2,
                                        backgroundColor: 'var(--color-background)',
                                        '&:hover': { backgroundColor: 'var(--color-background-hover)' }
                                    }}
                                >
                                    <ArrowBackIcon />
                                </IconButton>
                            </Tooltip>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--color-text)' }}>
                                    Teacher Details
                                </Typography>
                                <Typography variant="subtitle1" sx={{ color: 'var(--color-text-secondary)' }}>
                                    View and manage teacher information
                                </Typography>
                            </Box>
                            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                                <Tooltip title="Edit Teacher">
                                    <IconButton 
                                        onClick={handleEdit}
                                        sx={{ 
                                            backgroundColor: 'var(--color-background)',
                                            '&:hover': { backgroundColor: 'var(--color-background-hover)' }
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Teacher">
                                    <IconButton 
                                        onClick={handleDelete}
                                        sx={{ 
                                            backgroundColor: 'var(--color-background)',
                                            '&:hover': { backgroundColor: '#ffebee' }
                                        }}
                                    >
                                        <DeleteIcon sx={{ color: '#d32f2f' }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
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
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'var(--color-text)' }}>
                                            Personal Information
                                        </Typography>
                                        
                                        <InfoItem 
                                            label="Teacher Name" 
                                            value={teacherDetails?.name} 
                                            icon={<PersonIcon sx={{ color: '#1976d2' }} />}
                                            color="primary"
                                        />
                                        
                                        <InfoItem 
                                            label="Email" 
                                            value={teacherDetails?.email} 
                                            icon={<EmailIcon sx={{ color: '#1976d2' }} />}
                                            color="primary"
                                        />
                                        
                                        <InfoItem 
                                            label="Class" 
                                            value={teacherDetails?.teachSclass?.sclassName} 
                                            icon={<SchoolIcon sx={{ color: '#2e7d32' }} />}
                                            color="success"
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
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
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'var(--color-text)' }}>
                                            Subject Information
                                        </Typography>
                                        
                                        {isSubjectNamePresent ? (
                                            <>
                                                <InfoItem 
                                                    label="Subject Name" 
                                                    value={teacherDetails?.teachSubject?.subName} 
                                                    icon={<MenuBookIcon sx={{ color: '#9c27b0' }} />}
                                                    color="purple"
                                                />
                                                
                                                <InfoItem 
                                                    label="Subject Sessions" 
                                                    value={teacherDetails?.teachSubject?.sessions} 
                                                    icon={<AccessTimeIcon sx={{ color: '#9c27b0' }} />}
                                                    color="purple"
                                                />
                                            </>
                                        ) : (
                                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                                <Typography variant="body1" sx={{ mb: 2, color: 'var(--color-text-secondary)' }}>
                                                    No subject assigned to this teacher
                                                </Typography>
                                                <PurpleButton 
                                                    variant="contained"
                                                    onClick={handleAddSubject}
                                                    startIcon={<MenuBookIcon />}
                                                >
                                                    Assign Subject
                                                </PurpleButton>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 4 }}>
                            <Paper 
                                elevation={0} 
                                sx={{ 
                                    borderRadius: 2, 
                                    overflow: 'hidden', 
                                    border: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-background-paper)'
                                }}
                            >
                                <Box sx={{ p: 3, borderBottom: '1px solid var(--color-border)' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-text)' }}>
                                        Actions
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <BlueButton
                                        variant="contained"
                                        onClick={handleViewStudents}
                                        startIcon={<PersonIcon />}
                                        disabled={!classID}
                                    >
                                        View Students
                                    </BlueButton>
                                    
                                    <GreenButton
                                        variant="contained"
                                        onClick={handleManageAttendance}
                                        startIcon={<AccessTimeIcon />}
                                        disabled={!classID || !subjectID}
                                    >
                                        Manage Attendance
                                    </GreenButton>
                                    
                                    <PurpleButton
                                        variant="contained"
                                        onClick={handleManageMarks}
                                        startIcon={<MenuBookIcon />}
                                        disabled={!classID || !subjectID}
                                    >
                                        Manage Marks
                                    </PurpleButton>
                                </Box>
                            </Paper>
                        </Box>
                    </>
                )}
            </Container>
        </Fade>
    );
};

export default TeacherDetails;